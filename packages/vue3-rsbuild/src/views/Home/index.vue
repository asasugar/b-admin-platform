<template>
  <div class="home">
    <el-tabs v-model="activeKey">
      <el-tab-pane label="项目介绍" name="1">
        <IntroDemo />
      </el-tab-pane>
      <el-tab-pane label="待办事项演示" name="2">
        <TodoDemo />
      </el-tab-pane>
      <el-tab-pane label="Pinia 演示" name="4">
        <PiniaDemo />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import IntroDemo from './components/IntroDemo.vue';
  import PiniaDemo from './components/PiniaDemo.vue';
  import TodoDemo from './components/TodoDemo.vue';

  const activeKey = ref('1');
</script>

<style scoped>
  .home {
    padding: 20px;
  }
</style>
