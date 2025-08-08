import type { CreateTodoDTO, Todo, UpdateTodoDTO } from '../../types/otherWebsite/todo';

class TodoService {
  // 模拟的数据存储
  private todos: Todo[] = [
    {
      id: 1,
      title: '示例待办事项',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 获取所有待办事项
  async getTodos(): Promise<Todo[]> {
    return this.todos;
  }

  // 创建待办事项
  async createTodo(dto: CreateTodoDTO): Promise<Todo> {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: dto.title,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  // 更新待办事项
  async updateTodo(dto: UpdateTodoDTO): Promise<Todo> {
    const todo = this.todos.find(t => t.id === dto.id);
    if (!todo) {
      throw new Error('待办事项不存在');
    }

    Object.assign(todo, {
      ...dto,
      updatedAt: new Date().toISOString()
    });

    return todo;
  }

  // 删除待办事项
  async deleteTodo(id: number): Promise<void> {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('待办事项不存在');
    }
    this.todos.splice(index, 1);
  }
}

export const todoService = new TodoService();
