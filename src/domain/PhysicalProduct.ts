import { IProduct } from './IProduct';

export class PhysicalProduct implements IProduct {
  static readonly FREIGHT = 10;
  readonly type = 'physical';

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number,
  ) {}

  // Produto físico paga frete fixo
  calculateFreight(): number {
    return PhysicalProduct.FREIGHT;
  }
}
