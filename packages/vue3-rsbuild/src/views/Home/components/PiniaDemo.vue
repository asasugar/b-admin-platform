<!-- PiniaDemo.vue -->
<template>
  <div class="pinia-demo">
    <h2>Pinia 状态管理演示</h2>
    <div class="counter-container">
      <p>当前计数: {{ counter }}</p>
      <div class="button-group">
        <el-button type="primary" @click="increment">增加</el-button>
        <el-button @click="decrement">减少</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();
const { counter } = storeToRefs(store);
const { increment, decrement, reset } = store;
</script>

<style scoped>
.pinia-demo
{
  padding:
  20px
}

.counter-container
{
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.button-group
{
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
</style>
