export type Session = {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: string;
  access_token: string;
};

export type Geo = {
  lat: string;
  lng: string;
};

export type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
};

export type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

export type ErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export type Post = {
  id: string;
  title: string;
  body: string;
};

export type UserFormData = {
  name?: string;
  email: string;
  password: string;
};
