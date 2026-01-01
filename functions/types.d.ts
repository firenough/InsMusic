export interface Env {
  USERS_KV: KVNamespace;
  HISTORY_KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: number;
}
