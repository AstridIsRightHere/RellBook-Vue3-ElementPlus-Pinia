<template>
  <div class="booking-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/movie/' + movieId }">{{ movie.title }}</el-breadcrumb-item>
      <el-breadcrumb-item>订票</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 银幕 -->
    <div class="screen">
      <h2>{{ movie.title }}</h2>
    </div>

    <!-- 选座盒子 -->
    <div class="seating-chart">
      <div
        v-for="(seat, index) in seats"
        :key="index"
        class="seat"
        :class="{ selected: seat.selected }"
        @click="toggleSeat(index)"
      >
        座位{{ index + 1 }}
      </div>
    </div>

    <!-- 座位计数和确认购买按钮 -->
    <div class="purchase-info">
      <p>已选座位数: {{ selectedSeatsCount }}</p>
      <el-button @click="confirmPurchase">确认购买</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import moviesData from '@/data/movies.json'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/stores/orderStore'

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()

// 获取当前电影信息
const movieId = route.params.id as string
const movie = computed(() => {
  return moviesData[movieId as keyof typeof moviesData] || null
})

// 座位初始化
const seats = ref<{ selected: boolean }[]>([])
onMounted(() => {
  for (let i = 0; i < 56; i++) {
    seats.value.push({ selected: false })
  }
})

// 计算已选座位数
const selectedSeatsCount = computed(() => {
  return seats.value.filter((seat) => seat.selected).length
})

// 切换座位选中状态
const toggleSeat = (index: number) => {
  seats.value[index].selected = !seats.value[index].selected
}

// 确认购买逻辑
const confirmPurchase = () => {
  if (selectedSeatsCount.value === 0) {
    // 如果没有选择座位，提示用户
    ElMessage({
      type: 'warning',
      message: '请至少选择一个座位',
    })
    return
  }

  const ticketPrice = 40
  const totalPrice = selectedSeatsCount.value * ticketPrice

  ElMessageBox.confirm(`总价: ${totalPrice}元`, '确认购买', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const orderInfo = {
        movieName: movie.value.title,
        ticketPrice: ticketPrice,
        totalPrice: totalPrice,
        selectedSeats: seats.value
          .map((seat, index) => ({ index, selected: seat.selected }))
          .filter((seat) => seat.selected),
      }
      // 保存到 Pinia Store
      orderStore.saveOrderInfo(orderInfo)
      // 跳转到订单确认页面
      router.push({ path: `/booking/${movieId}/order-confirm` })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消购买',
      })
    })
}
</script>

<style scoped>
.booking-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.screen {
  text-align: center;
  margin: 20px 0;
  background-color: #2c3e50; /* 更改背景颜色 */
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.seating-chart {
  max-width: 100vw;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  margin-bottom: 20px;
}

.seat {
  width: 8vw;
  height: 8vw;

  background-color: #bdc3c7; /* 更改背景颜色 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 3px;
}

.seat.selected {
  background-color: #e74c3c; /* 更改选中颜色 */
}

/* 优化列间隔 */
.seating-chart > div:nth-child(8n + 2),
.seating-chart > div:nth-child(8n + 6) {
  margin-right: 55px;
}

.purchase-info {
  text-align: center;
}

/* 媒体查询 */
@media (max-width: 1200px) {
  .seat {
    width: 9vw;
    height: 9vw;
  }
}

@media (max-width: 992px) {
  .seat {
    width: 10vw;
    height: 10vw;
  }
}

@media (max-width: 768px) {
  .seat {
    width: 11vw;
    height: 11vw;
  }
}

@media (max-width: 576px) {
  .seat {
    width: 12vw;
    height: 12vw;
  }
}
</style>
