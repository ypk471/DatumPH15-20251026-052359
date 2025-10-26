export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Document {
  id: string;
  userId: string;
  personelName: string;
  name: string;
  startDate: number; // epoch millis
  endDate: number; // epoch millis
}
export interface User {
  id: string; // Using username as ID for simplicity
  username: string;
  password?: string; // Hashed password, should not be sent to client
  isAdmin?: boolean;
}
export interface Feedback {
  id: string;
  userId: string;
  username: string;
  comment: string;
  timestamp: number; // epoch millis
}