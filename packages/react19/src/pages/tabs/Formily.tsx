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
import { createSchemaField } from '@formily/react';
import { Card, Space, Table } from 'antd';
import { useState } from 'react';
import { useMessage } from '@/contexts/MessageContext';

// 创建 SchemaField 组件
const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    Input,
    NumberPicker,
    Select
  }
});

// 表单 Schema 定义
const schema = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 4,
        minColumns: 2,
        columnGap: 16,
        rowGap: 16
      },
      properties: {
        status: {
          type: 'number',
          title: '状态',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            numberValue: true
          },
          enum: [
            { label: '正常', value: 1 },
            { label: '禁用', value: 0 }
          ]
        },
        name: {
          type: 'string',
          title: '姓名',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入姓名'
          },
          'x-validator': {
            max: 20,
            message: '姓名不能超过20个字符'
          }
        },
        age: {
          type: 'number',
          title: '年龄',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-component-props': {
            placeholder: '请输入年龄'
          },
          'x-validator': {
            minimum: 0,
            maximum: 150,
            message: '年龄必须在0-150岁之间'
          }
        },
        address: {
          type: 'string',
          title: '地址',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入地址'
          },
          'x-validator': {
            max: 100,
            message: '地址不能超过100个字符'
          }
        }
      }
    }
  }
};

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
  const messageApi = useMessage();
  const handleSubmit = async (values: FormilyUserQueryParams) => {
    try {
      const res = await formilyApi.getUsers(values);
      if (res.code !== 0) {
        messageApi.open({
          type: 'error',
          content: res.message,
        });
        return;
      }
      const { list, total } = res.data || { list: [], total: 0 };
      setTableData(list);
      setTotal(total);
      messageApi.open({
        type: 'success',
        content: `查询成功，共找到 ${total} 条数据`,
      });
    } catch (error) {
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
          messageApi.open({
            type: 'error',
            content: '请检查表单填写是否正确'
          });
        }}>
        <SchemaField schema={schema} />
        <FormButtonGroup.FormItem>
          <Space>
            <Submit loading={form.submitting}>查询</Submit>
            <Reset onClick={handleReset}>重置</Reset>
          </Space>
        </FormButtonGroup.FormItem>

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
