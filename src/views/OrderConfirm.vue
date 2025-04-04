<template>
  <div class="order-confirm">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/movie/' + movieId }">{{ movie.title }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/booking/' + movieId }">订票</el-breadcrumb-item>
      <el-breadcrumb-item>订单确认</el-breadcrumb-item>
    </el-breadcrumb>

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
      <p>备注: {{ orderInfo.remark || '无' }}</p>
      <p>联系电话: {{ orderInfo.phone || '无' }}</p>
      <el-button @click="showQRCodeDialog = true">确认订单</el-button>
    </div>
    <div v-else>
      <p>没有订单信息</p>
    </div>

    <!-- 展示二维码的对话框 -->
    <el-dialog
      v-model="showQRCodeDialog"
      title="订单二维码"
      width="500"
      :before-close="handleClose"
    >
      <QRCode />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelOrder">取消</el-button>
          <el-button type="primary" @click="confirmOrder"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useRouter, useRoute } from 'vue-router'
import QRCode from '@/components/QRCode.vue'
import moviesData from '@/data/movies.json'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()
const showQRCodeDialog = ref(false)

// 获取当前电影信息
const movieId = route.params.id as string
const movie = computed(() => {
  return moviesData[movieId as keyof typeof moviesData] || null
})

const orderInfo = computed(() => orderStore.getOrderInfo)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭此对话框吗？')
    .then(() => {
      done()
    })
    .catch(() => {
      // 捕获错误
    })
}

const cancelOrder = () => {
  showQRCodeDialog.value = false
  ElMessage({
    type: 'info',
    message: '支付已取消',
  })
}

const confirmOrder = () => {
  ElMessage({
    type: 'success',
    message: '支付已成功',
  })
  // 模拟异步等待 3 秒钟
  setTimeout(() => {
    showQRCodeDialog.value = false
    orderStore.clearOrderInfo()
    router.push('/home')
  }, 3000)
}
</script>

<style scoped>
.order-confirm {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin: 20px 0;
  font-size: 24px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

p {
  margin-bottom: 15px;
  font-size: 16px;
  color: #666;
}

p span {
  color: #333;
  font-weight: 500;
}

.selected-seats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.selected-seats span {
  background-color: #409eff;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}
</style>
