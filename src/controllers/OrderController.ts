import { Request, Response } from 'express';
import logger from '../lib/logger';
import { BusinessError } from '../errors/BusinessError';
import { OrderService } from '../services/OrderService';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  processOrder = async (req: Request, res: Response) => {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      const result = await this.orderService.processOrder({
        customer,
        items,
        paymentMethod,
        paymentDetails,
      });

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailPreview,       // link do Ethereal 
      });
    } catch (error: unknown) {
      if (error instanceof BusinessError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Erro ao processar pedido: ${message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
}
