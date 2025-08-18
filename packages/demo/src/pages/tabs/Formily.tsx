import {
  type FormilyUserItem,
  type FormilyUserQueryParams,
  formilyApi
} from '@b-admin-platform/services';
import {
  Form,
  FormButtonGroup,
  FormGrid,
  FormItem,
  Input,
  NumberPicker,
  Reset,
  Select,
  Submit
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { Field } from '@formily/react';
import { Card, message, Space, Table } from 'antd';
import { useState } from 'react';

// 创建表单，设置默认值和验证规则
const form = createForm({
  initialValues: {
    status: 1,
    name: '',
    age: '',
    address: ''
  },
  validateFirst: true
});

const statusOptions = [
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 }
];

const FormilyDemo = () => {
  const [tableData, setTableData] = useState<FormilyUserItem[]>([]);
  const [total, setTotal] = useState(0);

  const handleSubmit = async (values: FormilyUserQueryParams) => {
    try {
      const response = await formilyApi.getUsers(values);
      const { list, total } = response.data;
      setTableData(list);
      setTotal(total);
      message.success(`查询成功，共找到 ${total} 条数据`);
    } catch (error) {
      // 错误已经被请求拦截器处理，这里可以添加额外的错误处理逻辑
      console.error('查询失败:', error);
    }
  };

  const handleReset = () => {
    setTableData([]);
    setTotal(0);
  };

  return (
    <Card title='Formily 示例'>
      <Form
        form={form}
        layout='vertical'
        feedbackLayout='terse'
        onAutoSubmit={handleSubmit}
        onAutoSubmitFailed={(errors) => {
          console.error('表单验证失败:', errors);
          message.error('请检查表单填写是否正确');
        }}>
        <FormGrid maxColumns={4} minColumns={2} columnGap={16} rowGap={16}>
          <Field
            name='status'
            title='状态'
            required
            decorator={[FormItem]}
            component={[Select, { numberValue: true }]}
            dataSource={statusOptions}
          />
          <Field
            name='name'
            title='姓名'
            required
            decorator={[FormItem]}
            component={[Input]}
            validator={{
              max: 20,
              message: '姓名不能超过20个字符'
            }}
          />
          <Field
            name='age'
            title='年龄'
            decorator={[FormItem]}
            component={[NumberPicker]}
            validator={{
              minimum: 0,
              maximum: 150,
              message: '年龄必须在0-150岁之间'
            }}
          />
          <Field
            name='address'
            title='地址'
            decorator={[FormItem]}
            component={[Input]}
            validator={{
              max: 100,
              message: '地址不能超过100个字符'
            }}
          />
          <FormButtonGroup.FormItem>
            <Space>
              <Submit loading={form.submitting}>查询</Submit>
              <Reset onClick={handleReset}>重置</Reset>
            </Space>
          </FormButtonGroup.FormItem>
        </FormGrid>

        {/* 查询结果表格 */}
        <div style={{ marginTop: 16 }}>
          <Table<FormilyUserItem>
            dataSource={tableData}
            rowKey='id'
            pagination={{
              total,
              pageSize: 10,
              showTotal: (total: number) => `共 ${total} 条`
            }}
            columns={[
              { title: 'ID', dataIndex: 'id', width: 80 },
              { title: '姓名', dataIndex: 'name', width: 120 },
              { title: '年龄', dataIndex: 'age', width: 80 },
              { title: '地址', dataIndex: 'address', width: 200 },
              {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (value: number) => {
                  const option = statusOptions.find((opt) => opt.value === value);
                  return option ? option.label : value;
                }
              }
            ]}
          />
        </div>
      </Form>
    </Card>
  );
};

export default FormilyDemo;
