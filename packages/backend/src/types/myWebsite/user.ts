export interface UserLoginDTO {
  username: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  roles: string[];
  permissions: string[];
  token?: string;
}

export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
}

// 用于请求头中的认证信息
export interface AuthHeader {
  authorization?: string;
}
