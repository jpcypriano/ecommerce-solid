import { PrismaClient } from '@prisma/client';
import { IOrderRepository, NewOrder, SavedOrder } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(order: NewOrder): Promise<SavedOrder> {
    return this.prisma.order.create({ data: order });
  }
}
