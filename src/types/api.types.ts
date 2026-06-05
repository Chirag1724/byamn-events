export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface RegistrationRow {
  name: string;
  email: string;
  registeredAt: Date;
}
