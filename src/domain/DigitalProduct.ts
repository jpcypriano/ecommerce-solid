import { IProduct } from './IProduct';

export class DigitalProduct implements IProduct {
  readonly type = 'digital';

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number,
  ) {}

  // Produto digital n tem entrega ent n precisa de frete.
  calculateFreight(): number {
    return 0;
  }
}
