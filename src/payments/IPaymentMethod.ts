export type PaymentDetails = Record<string, any>;

export interface IPaymentMethod {
  process(details: PaymentDetails): Promise<void>;
}
