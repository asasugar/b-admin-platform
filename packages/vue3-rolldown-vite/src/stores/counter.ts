import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0
  }),

  actions: {
    increment() {
      this.counter++
    },
    decrement() {
      this.counter--
    },
    reset() {
      this.counter = 0
    }
  }
})