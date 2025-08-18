export interface FormilyUserQueryParams {
  status?: number;
  name?: string;
  age?: string;
  address?: string;
}

export interface FormilyUserItem {
  id: number;
  name: string;
  age: number;
  address: string;
  status: number;
}

export interface FormilyUserQueryResponse {
  list: FormilyUserItem[];
  total: number;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}