import { otherWebsiteApi } from '@b-admin-platform/services';
import { Button, Form, Input, List, Modal, message, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoDemo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();


  const fetchTodos = async () => {
    const res = await otherWebsiteApi.getTodos();
    if (res.code === 0) {
      setTodos(res.data);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const res = await otherWebsiteApi.createTodo(values);
    if (res.code === 0) {
      setIsModalOpen(false);
      form.resetFields();
      fetchTodos();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await otherWebsiteApi.deleteTodo({ id });
    if (res.code === 0) {
      fetchTodos();
      messageApi.open({
        type: 'success',
        content: res.message || '删除成功',
      });
    }
  };

  const handleToggle = async (todo: Todo) => {
    const res = await otherWebsiteApi.updateTodo({
      id: todo.id,
      completed: !todo.completed
    });
    if (res.code === 0) {
      fetchTodos();
    }
  };

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}>
        <Title level={2}>待办事项（接口代理演示）</Title>
        <Button type='primary' onClick={handleAdd}>
          添加待办
        </Button>
      </div>

      <List
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button type='link' onClick={() => handleToggle(todo)}>
                {todo.completed ? '标记未完成' : '标记完成'}
              </Button>,
              <Button type='link' danger onClick={() => handleDelete(todo.id)}>
                删除
              </Button>
            ]}>
            <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </div>
          </List.Item>
        )}
      />

      <Modal
        title='添加待办事项'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}>
        <Form form={form}>
          <Form.Item name='title' rules={[{ required: true, message: '请输入待办事项内容' }]}>
            <Input placeholder='请输入待办事项内容' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoDemo;
