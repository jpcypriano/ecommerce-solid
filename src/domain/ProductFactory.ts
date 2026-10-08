import { IProduct, ProductData } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';

type ProductBuilder = (data: ProductData) => IProduct;

export class ProductFactory {
  private static readonly builders: Record<string, ProductBuilder> = {
    physical: (d) => new PhysicalProduct(d.id, d.name, d.price),
    digital: (d) => new DigitalProduct(d.id, d.name, d.price),
  };

  static createProduct(data: ProductData): IProduct {
    const build = ProductFactory.builders[data.type];
    if (!build) {
      throw new Error(`Tipo de produto desconhecido: ${data.type}`);
    }
    return build(data);
  }
}
