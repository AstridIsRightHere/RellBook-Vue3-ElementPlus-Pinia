<template>
  <div>
    <h1>订单确认</h1>
    <!-- 使用 v-if 确保 orderInfo 不为 null -->
    <div v-if="orderInfo">
      <p>电影名称: {{ orderInfo.movieName }}</p>
      <p>票价: {{ orderInfo.ticketPrice }} 元</p>
      <p>总价: {{ orderInfo.totalPrice }} 元</p>
      <p>
        已选座位:
        <span v-for="seat in orderInfo.selectedSeats" :key="seat.index"
          >座位{{ seat.index + 1 }}</span
        >
      </p>
    </div>
    <div v-else>
      <p>没有订单信息</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '@/stores/orderStore'
import { onUnmounted, computed } from 'vue'

const orderStore = useOrderStore()

onUnmounted(() => {
  // 使用完后清除状态
  orderStore.clearOrderInfo()
})

const orderInfo = computed(() => orderStore.getOrderInfo)
</script>
