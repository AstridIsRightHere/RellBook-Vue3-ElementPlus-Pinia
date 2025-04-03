// 引入 Pinia 的 defineStore 函数，用于定义一个 Pinia store
import { defineStore } from 'pinia'

// 定义一个接口 SelectedSeat，表示选中的座位信息
interface SelectedSeat {
  index: number
  selected: boolean
}

// 定义一个接口 OrderInfo，表示订单信息
interface OrderInfo {
  movieName: string
  ticketPrice: number
  totalPrice: number
  selectedSeats: SelectedSeat[]
}

// 使用 defineStore 定义一个名为 'order' 的 Pinia store
export const useOrderStore = defineStore('order', {
  // 定义 store 的状态
  state: (): { orderInfo: OrderInfo | null } => ({
    // orderInfo 是一个对象，初始值为 null
    // 当用户选择座位并提交订单时，会存储订单信息
    // 如果没有订单信息，则为 null
    orderInfo: null,
  }),
  // 定义 store 的 actions（方法）
  actions: {
    // 保存订单信息的方法
    saveOrderInfo(info: OrderInfo) {
      // 将传入的订单信息存储到 orderInfo 中
      this.orderInfo = info
    },
    // 清空订单信息的方法
    clearOrderInfo() {
      // 将 orderInfo 设置为 null，表示清空订单信息
      this.orderInfo = null
    },
  },
  // 定义 store 的 getters（计算属性）
  getters: {
    // 获取订单信息的 getter
    getOrderInfo: (state): OrderInfo | null => {
      // 返回当前的 orderInfo 状态
      return state.orderInfo
    },
  },
})
