export interface NewOrder {
  customer: string;
  items: string; 
  total: number;
  status: string;
}

export interface SavedOrder {
  id: number;
}

export interface IOrderRepository {
  create(order: NewOrder): Promise<SavedOrder>;
}
