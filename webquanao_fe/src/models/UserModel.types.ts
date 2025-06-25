export type User = {
  id: string;
  email: string;
  role: string[];
  userName: string;
};
export type LoginRequest = {
  username: string;
  password: string;
};
