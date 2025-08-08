export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDTO {
  title: string;
}

export interface UpdateTodoDTO {
  id: number;
  title?: string;
  completed?: boolean;
}
