export interface TodoQueryParams {
  title?: string;
}
export interface TodoDeleteParams {
  id: number;
}
export interface TodoUpdateParams {
  id: number;
  completed?: boolean;
}
export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}