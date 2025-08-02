export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export interface ProductForCreate {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface ProductForUpdate extends Partial<ProductForCreate> {
  // Use `Partial` to make all properties optional for a PUT request
}

export interface ProductFilters {
  title?: string;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  offset?: number;
  limit?: number;
}

// export type ProductsList = Product[];