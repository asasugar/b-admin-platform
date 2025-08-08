import jwt from 'jsonwebtoken';
import type { LoginResponse, UserInfo, UserLoginDTO } from '../../types/myWebsite/user';

const JWT_SECRET = 'your-jwt-secret-key'; // 在实际应用中应该从配置文件中读取

class UserService {
  // 模拟的用户数据，实际应用中应该从数据库获取
  private readonly mockUser: UserInfo = {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    avatar: 'https://example.com/avatar.png',
    email: 'admin@example.com',
    roles: ['admin'],
    permissions: ['*']
  };

  async login(loginDto: UserLoginDTO): Promise<LoginResponse> {
    // 这里应该实现实际的用户验证逻辑
    if (loginDto.username === 'admin' && loginDto.password === 'admin123') {
      const token = this.generateToken(this.mockUser);
      return {
        token,
        userInfo: { ...this.mockUser, token }
      };
    }
    throw new Error('用户名或密码错误');
  }

  async getUserInfo({ userId }: { userId: number }): Promise<UserInfo> {
    // 这里应该实现实际的用户信息获取逻辑
    console.log('%c [ userId ]-33', 'font-size:13px; background:pink; color:#bf2c9f;', userId)

    if (userId === this.mockUser.id) {
      return this.mockUser;
    }
    throw new Error('用户不存在');
  }

  private generateToken(user: UserInfo): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        roles: user.roles
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

export const userService = new UserService();
