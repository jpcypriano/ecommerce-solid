import logger from '../lib/logger';
import { IMailProvider } from '../providers/IMailProvider';

export interface OrderConfirmation {
  customer: string;
  orderId: number;
  total: number;
  productNames: string[];
}

// Define o que enviar.
export class NotificationService {
  constructor(private readonly mailProvider: IMailProvider) {}

  async sendOrderConfirmation(order: OrderConfirmation): Promise<string | null> {
    const { previewUrl } = await this.mailProvider.sendMail({
      from: '"DevStore" <noreply@devstore.com>',
      to: order.customer,
      subject: `Confirmação do Pedido #${order.orderId}`,
      text: `Olá, seu pedido #${order.orderId} no valor de R$ ${order.total} foi confirmado.`,
      html: `
          <h1>Pedido Confirmado!</h1>
          <p>Olá, seu pedido <b>#${order.orderId}</b> foi processado com sucesso.</p>
          <p>Total: <strong>R$ ${order.total}</strong></p>
          <ul>
            ${order.productNames.map((name) => `<li>${name}</li>`).join('')}
          </ul>
        `,
    });

    //link Ethereal.
    logger.info(`Email enviado: ${previewUrl}`);
    return previewUrl;
  }
}
