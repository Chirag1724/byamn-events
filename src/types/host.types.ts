export interface IHost {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateHostInput {
  name: string;
  email: string;
  password: string;
}

export interface HostSession {
  hostId: string;
  name: string;
  email: string;
}
