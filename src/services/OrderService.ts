import logger from '../lib/logger';
import { BusinessError } from '../errors/BusinessError';
import { IProduct } from '../domain/IProduct';
import { ProductFactory } from '../domain/ProductFactory';
import { PaymentDetails } from '../payments/IPaymentMethod';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { NotificationService } from './NotificationService';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customer: string;
  items?: OrderItemRequest[];
  paymentMethod: string;
  paymentDetails: PaymentDetails;
}

export interface OrderResult {
  orderId: number;
  emailPreview: string | null;
}

interface OrderLine {
  product: IProduct;
  quantity: number;
}

// fluxo do pedido: valida -> calcula -> paga -> salva -> notifica.
export class OrderService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly paymentMethods: PaymentMethodRegistry,
    private readonly notificationService: NotificationService,
  ) {}

  async processOrder(request: OrderRequest): Promise<OrderResult> {
    const { customer, items, paymentMethod, paymentDetails } = request;

    // 1. Validação
    if (!items || items.length === 0) {
      logger.error('Tentativa de pedido sem itens');
      throw new BusinessError('Carrinho vazio');
    }

    // 2. Cálculo do total 
    const lines = await this.loadOrderLines(items);
    const total = lines.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity + product.calculateFreight(),
      0,
    );

    // 3. Pagamento
    const payment = this.paymentMethods.get(paymentMethod);
    if (!payment) {
      throw new BusinessError('Método de pagamento não suportado');
    }
    await payment.process(paymentDetails);

    // 4. Persistência
    const order = await this.orderRepository.create({
      customer,
      items: JSON.stringify(
        lines.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
          quantity,
        })),
      ),
      total,
      status: 'confirmed',
    });

    // 5. Notificação
    const emailPreview = await this.notificationService.sendOrderConfirmation({
      customer,
      orderId: order.id,
      total,
      productNames: lines.map(({ product }) => product.name),
    });

    return { orderId: order.id, emailPreview };
  }

  private async loadOrderLines(items: OrderItemRequest[]): Promise<OrderLine[]> {
    const lines: OrderLine[] = [];

    for (const item of items) {
      const data = await this.productRepository.findById(item.productId);
      if (!data) {
        throw new BusinessError(`Produto ${item.productId} não encontrado`);
      }
      lines.push({ product: ProductFactory.createProduct(data), quantity: item.quantity });
    }

    return lines;
  }
}
