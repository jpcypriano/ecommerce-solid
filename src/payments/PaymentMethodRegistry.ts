import { IPaymentMethod } from './IPaymentMethod';

export class PaymentMethodRegistry {
  private readonly methods = new Map<string, IPaymentMethod>();

  register(name: string, method: IPaymentMethod): this {
    this.methods.set(name, method);
    return this;
  }

  get(name: string): IPaymentMethod | undefined {
    return this.methods.get(name);
  }
}
