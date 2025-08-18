import type { FormilyUserQueryParams } from '@b-admin-platform/services';
import type { User } from '@/types/myWebsite/formily';

class FormilyService {
  private users: User[] = [
    {
      id: 1,
      name: '张三',
      age: 25,
      address: '北京市朝阳区',
      status: 1
    },
    {
      id: 2,
      name: '李四',
      age: 30,
      address: '上海市浦东新区',
      status: 0
    },
    {
      id: 3,
      name: '王五',
      age: 28,
      address: '广州市天河区',
      status: 1
    }
  ];

  async getUsers(dto: FormilyUserQueryParams): Promise<{ list: User[]; total: number }> {
    const { status, name, age, address } = dto;
    console.log('%c [ dto ]-31', 'font-size:13px; background:pink; color:#bf2c9f;', dto);

    const filteredUsers = this.users.filter((user) => {
      // 只有当查询条件存在时才进行过滤
      const statusMatch = status === undefined || user.status === Number(status);
      const nameMatch = !name || user.name.includes(name);
      const ageMatch = !age || user.age === Number(age);
      const addressMatch = !address || user.address.includes(address);

      return statusMatch && nameMatch && ageMatch && addressMatch;
    });

    return {
      list: filteredUsers,
      total: filteredUsers.length
    };
  }
}

export const formilyService = new FormilyService();
