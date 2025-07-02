export type AgeRating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  genre: string;
  ageRating: AgeRating;
  length: string;
  description: string;
  director: string;
  actors: string;
  releaseDate: string;
  showingDate: string;
}

export interface ProductRating {
  productId: number;
  userId: number;
  rating: number;
  comment: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  email: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
}

export interface Db {
  products: Product[];
  cart: Product[];
  users: User[];
  productRatings: ProductRating[];
  authenticatedUser: User | null;
}
