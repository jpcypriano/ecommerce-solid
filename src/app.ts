import express from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { PaymentMethodRegistry } from './payments/PaymentMethodRegistry';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { PixPayment } from './payments/PixPayment';

const prisma = new PrismaClient();

const paymentMethods = new PaymentMethodRegistry()
  .register('credit_card', new CreditCardPayment())
  .register('debit_card', new DebitCardPayment())
  .register('pix', new PixPayment());

const orderService = new OrderService(
  new PrismaProductRepository(prisma),
  new PrismaOrderRepository(prisma),
  paymentMethods,
  new NotificationService(new EtherealMailProvider()),
);

const orderController = new OrderController(orderService);

const app = express();
app.use(express.json());

app.post('/orders', orderController.processOrder);

export default app;
