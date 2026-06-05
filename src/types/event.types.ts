export interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  slug: string;
  hostId: string;
  capacity?: number;
  registrationCutoff?: Date;
  isClosed: boolean;
  registrationCount?: number;
  createdAt: Date;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
  registrationCutoff?: string;
}
