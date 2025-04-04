<template>
  <div ref="qrcodeRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import QRCode from 'qrcode-generator'
import { useOrderStore } from '@/stores/orderStore'

const qrcodeRef = ref<HTMLDivElement | null>(null)
const orderStore = useOrderStore()

onMounted(() => {
  if (qrcodeRef.value) {
    const orderInfo = orderStore.getOrderInfo
    console.log('订单信息:', orderInfo) // 添加调试信息
    if (orderInfo) {
      const orderData = JSON.stringify(orderInfo)
      const qr = QRCode(0, 'L')
      qr.addData(orderData)
      qr.make()
      qrcodeRef.value.innerHTML = qr.createSvgTag({
        cellColor: '#000',
        margin: 4,
      })
    } else {
      console.log('订单信息为空，无法生成二维码')
    }
  }
})
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
