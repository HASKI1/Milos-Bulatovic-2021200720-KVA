import { Injectable, signal } from '@angular/core';
import { LocalStoragePreset } from 'lowdb/browser';
import { LowSync } from 'lowdb';
import { Db, Product, ProductRating, User } from './db.interface';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private db: LowSync<Db>;

  productsSignal = signal<Product[]>([]);
  cartSignal = signal<Product[]>([]);

  constructor() {
    this.db = LocalStoragePreset<Db>('db', INITIAL_DB_DATA);

    this.db.write();
    this.productsSignal.set(this.db.data.products);
    this.cartSignal.set(this.db.data.cart);
  }

  get products() {
    return this.db.data.products;
  }

  get products$() {
    return this.productsSignal;
  }

  set products(products: Product[]) {
    this.db.data.products = products;
    this.db.write();
    this.productsSignal.set(products);
  }

  syncProductsSignal() {
    this.productsSignal.set(this.db.data.products);
  }

  get cart() {
    return this.db.data.cart;
  }

  get cart$() {
    return this.cartSignal;
  }

  set cart(products: Product[]) {
    this.db.data.cart = products;
    this.db.write();
    this.cartSignal.set(products);
  }

  syncCartSignal() {
    this.cartSignal.set(this.db.data.cart);
  }

  get users() {
    return this.db.data.users;
  }

  get authenticatedUser() {
    return this.db.data.authenticatedUser;
  }

  set authenticatedUser(user: User | null) {
    this.db.data.authenticatedUser = user;
    this.db.write();
  }

  set user(user: User) {
    this.db.data.users.push(user);
    this.db.write();
  }

  updateUser(user: User): void {
    this.db.data.users = this.db.data.users.map((u) =>
      u.id === user.id ? user : u
    );

    if (this.authenticatedUser?.id === user.id) {
      this.authenticatedUser = user;
    }

    this.db.write();
  }

  get productRatings() {
    return this.db.data.productRatings;
  }

  setProductRating(rating: ProductRating): boolean {
    this.db.data.productRatings.push(rating);
    this.db.write();

    return true;
  }

  getProductRatingsForProduct(productId: number): ProductRating[] {
    return this.db.data.productRatings.filter(
      (rating) => rating.productId === productId
    );
  }

  getUserById(id: number): User | null {
    return this.db.data.users.find((user) => user.id === id) || null;
  }

  updateProductById(id: number, changes: Partial<Product>) {
    const updated = this.products.map((p) =>
      p.id === id ? { ...p, ...changes } : p
    );
    this.products = updated;
  }
}

const INITIAL_DB_DATA: Db = {
  productRatings: [],
  users: [],
  authenticatedUser: null,
  cart: [],
  products: [
    {
      id: 1,
      name: 'Interstellar',
      price: 10,
      image: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      genre: 'Sci-Fi, Drama, Adventure',
      ageRating: 'PG-13',
      length: '169 min',
      description: 'Tim istrazivaca putuje kroz crvotocinu u svemiru u potrazi za novim domom za covecanstvo.',
      director: 'Christopher Nolan',
      actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
      releaseDate: '7/11/2014',
      showingDate: '7/11, 16:00h',
    },
    {
      id: 2,
      name: 'Inception',
      price: 12,
      image: 'https://m.media-amazon.com/images/M/MV5BMjExMjkwNTQ0Nl5BMl5BanBnXkFtZTcwNTY0OTk1Mw@@._V1_.jpg',
      genre: 'Sci-Fi, Action, Thriller',
      ageRating: 'PG-13',
      length: '148 min',
      description: 'Vest lopov dobija sansu za iskupljenje ako uspe da usadi ideju u neciju podsvest.',
      director: 'Christopher Nolan',
      actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
      releaseDate: '16/7/2010',
      showingDate: '16/7, 20:30h',
    },
    {
      id: 3,
      name: 'The Dark Knight',
      price: 15,
      image: 'https://musicart.xboxlive.com/7/abb02f00-0000-0000-0000-000000000002/504/image.jpg',
      genre: 'Action, Crime, Thriller',
      ageRating: 'PG-13',
      length: '152 min',
      description: 'Betmen se bori protiv Dzokera, kriminalnog genija koji zeli da stvori haos u Gotamu.',
      director: 'Christopher Nolan',
      actors: 'Jonathan Nolan, Christopher Nolan, David S. Goyer',
      releaseDate: '18/7/2008',
      showingDate: '18/7, 20:00h',
    },
    {
      id: 4,
      name: 'Titanic',
      price: 10,
      image: 'https://m.media-amazon.com/images/I/811lT7khIrL.jpg',
      genre: 'Romance, Drama, Historical',
      ageRating: 'PG-13',
      length: '195 min',
      description: 'Mladi par iz razlicitih drustvenih slojeva zaljubljuje se na nesrecnom brodu Titanik.',
      director: 'James Cameron',
      actors: 'Leonardo DiCaprio, Kate Winslet, Billy Zane',
      releaseDate: '19/12/1997',
      showingDate: '19/12, 19:30h',
    },
    {
      id: 5,
      name: 'Avatar',
      price: 14,
      image: 'https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_.jpg',
      genre: 'Sci-Fi, Adventure, Action',
      ageRating: 'PG-13',
      length: '162 min',
      description: 'Paraplegicni marinac odlazi na planetu Pandora i zaljubljuje se u njen narod.',
      director: 'James Cameron',
      actors: 'Sam Worthington, Zoe Saldaña, Sigourney Weaver',
      releaseDate: '18/12/2009',
      showingDate: '18/12, 19:00h',
    },
    {
      id: 6,
      name: 'Gladiator',
      price: 10,
      image: 'https://www.moxiecinema.com/uploads/films/_cover/Gladiator-poster.jpg',
      genre: 'Historical Drama, Action',
      ageRating: 'R',
      length: '155 min',
      description: 'Izdani rimski general trazi osvetu protiv imperatora koji mu je ubio porodicu.',
      director: 'Ridley Scott',
      actors: 'David Franzoni, John Logan, William Nicholson',
      releaseDate: '5/5/2000',
      showingDate: '5/5, 18:00h',
    },
    {
      id: 7,
      name: 'The Matrix',
      price: 13,
      image: 'https://www.rogerebert.com/wp-content/uploads/2024/03/The-Matrix.jpg',
      genre: 'Sci-Fi, Action',
      ageRating: 'R',
      length: '136 min',
      description: 'Haker otkriva da je stvarnost simulacija i pridruzuje se pobuni protiv masina.',
      director: 'Lana Wachowski, Lilly Wachowski',
      actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
      releaseDate: '31/3/1999',
      showingDate: '31/3, 16:45h',
    },
    {
      id: 8,
      name: 'Pulp Fiction',
      price: 11,
      image: 'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      genre: 'Crime, Drama, Dark Comedy',
      ageRating: 'R',
      length: '154 min',
      description: 'Ispletene price o kriminalu, iskupljenju i crnom humoru u klasicnom Tarantinovom filmu.',
      director: 'Quentin Tarantino',
      actors: 'John Travolta, Uma Thurman, Samuel L. Jackson',
      releaseDate: '14/10/1994',
      showingDate: '14/10, 16:30h',
    },
    {
      id: 9,
      name: 'The Godfather',
      price: 12,
      image: 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      genre: 'Crime, Drama, Mafia',
      ageRating: 'R',
      length: '175 min',
      description: 'Ostareli patrijarh mafijaske porodice predaje kontrolu nevoljnom sinu.',
      director: 'Francis Ford Coppola',
      actors: 'Marlon Brando, Al Pacino, James Caan',
      releaseDate: '24/3/1972',
      showingDate: '24/3, 15:00h',
    },
    {
      id: 10,
      name: 'Forrest Gump',
      price: 10,
      image: 'https://musicart.xboxlive.com/7/40025100-0000-0000-0000-000000000002/504/image.jpg',
      genre: 'Drama, Romance, Comedy',
      ageRating: 'PG-13',
      length: '142 min',
      description: 'Covek sa niskim IQ-om prolazi kroz najvaznije istorijske trenutke u SAD.',
      director: 'Robert Zemeckis',
      actors: 'Tom Hanks, Robin Wright, Gary Sinise',
      releaseDate: '6/7/1994',
      showingDate: '6/7, 14:00h',
    },
  ],
};
