export interface IAttendee {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateAttendeeInput {
  name: string;
  email: string;
  password: string;
}
