<!-- TodoDemo.vue -->
<template>
  <div class="todo-demo">
    <div class="todo-header">
      <h2>待办事项（接口代理演示）</h2>
      <el-button type="primary" @click="handleAdd">添加待办</el-button>
    </div>

    <el-table :data="todos || []" border class="todo-list">
      <el-table-column prop="title" label="待办事项">
        <template #default="{ row }">
          <span :style="{ textDecoration: row.completed ? 'line-through' : 'none' }">
            {{ row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="200">
        <template #default="{ row }">
          <el-button link @click="handleToggle(row)">
            {{ row.completed ? '标记未完成' : '标记完成' }}
          </el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="isModalOpen"
      title="添加待办事项"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
      >
        <el-form-item prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入待办事项内容"
            @keyup.enter="handleOk"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isModalOpen = false">取消</el-button>
          <el-button type="primary" @click="handleOk">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { otherWebsiteApi, type TodoItem } from '@b-admin-platform/services';
import type { FormInstance } from 'element-plus';

const todos = ref<TodoItem[] | null>(null);
const isModalOpen = ref(false);
const formRef = ref<FormInstance>();
const form = ref({
  title: ''
});

const rules = {
  title: [{ required: true, message: '请输入待办事项内容', trigger: 'blur' }]
};

const fetchTodos = async () => {
  const res = await otherWebsiteApi.getTodos();
  if (res.code === 0) {
    todos.value = res.data;
  }
};

onMounted(() => {
  fetchTodos();
});

const handleAdd = () => {
  isModalOpen.value = true;
  form.value.title = '';
};

const handleOk = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await otherWebsiteApi.createTodo(form.value);
      if (res.code === 0) {
        isModalOpen.value = false;
        fetchTodos();
        ElMessage.success('添加成功');
      }
    }
  });
};

const handleDelete = async (id: number) => {
  const res = await otherWebsiteApi.deleteTodo({ id });
  if (res.code === 0) {
    fetchTodos();
    ElMessage.success(res.message || '删除成功');
  }
};

const handleToggle = async (todo: TodoItem) => {
  const res = await otherWebsiteApi.updateTodo({
    id: todo.id,
    completed: !todo.completed
  });
  if (res.code === 0) {
    fetchTodos();
    ElMessage.success(todo.completed ? '已标记为未完成' : '已标记为完成');
  }
};
</script>

<style scoped>
.todo-demo {
  padding: 20px;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.todo-header h2 {
  margin: 0;
}

.todo-list {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>