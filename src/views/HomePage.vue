<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <Navbar />
    <!-- 轮播图 -->
    <el-carousel autoplay :interval="2000" indicator-position="none">
      <el-carousel-item v-for="(image, index) in carouselImages" :key="index">
        <img :src="image" alt="轮播图" style="width: 100%; height: 100%; object-fit: contain" />
      </el-carousel-item>
    </el-carousel>

    <!-- 飘窗 -->
    <div
      v-if="showFloatingWindow"
      class="floating-window"
      @mouseenter="pauseFloating"
      @mouseleave="resumeFloating"
      :style="{ left: floatingLeft + 'px', top: floatingTop + 'px' }"
    >
      <div class="close-icon" @click="hideFloatingWindow">X</div>
      <div class="scroll-text">
        <div class="scroll-content">{{ floatingText }}</div>
      </div>
    </div>
    <!-- 电影卡片列表 -->
    <div class="movie-cards">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @goToDetail="goToMovieDetail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/NavbarCom.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import MovieCard from '../components/MovieCard.vue'
import moviesData from '../data/movies.json'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const user = userStore.user

// 飘窗相关
const showFloatingWindow = ref(true)
const floatingText = '这是滚动字幕内容，会循环播放...'
let floatingTimer: number | null = null
const floatingLeft = ref(20)
const floatingTop = ref(20)
let directionX = 1
let directionY = 1

const pauseFloating = () => {
  if (floatingTimer) {
    clearInterval(floatingTimer)
  }
}

const resumeFloating = () => {
  floatingTimer = setInterval(() => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const floatingWidth = 200
    const floatingHeight = 100

    floatingLeft.value += directionX
    floatingTop.value += directionY

    if (floatingLeft.value <= 0 || floatingLeft.value + floatingWidth >= windowWidth) {
      directionX = -directionX
    }
    if (floatingTop.value <= 0 || floatingTop.value + floatingHeight >= windowHeight) {
      directionY = -directionY
    }
  }, 10)
}

const hideFloatingWindow = () => {
  showFloatingWindow.value = false
  if (floatingTimer) {
    clearInterval(floatingTimer)
  }
}

// 轮播图图片
const carouselImages = ref([
  'https://dummyimage.com/350x100/000/fff  ',
  'https://dummyimage.com/350x200/000/fff.jpg  ',
  'https://dummyimage.com/350x300/000/fff.jpg  ',
  'https://dummyimage.com/550x500/000/fff.jpg  ',
])

// 电影数据
const movies = ref(moviesData)

// 跳转到电影详情页
const goToMovieDetail = (movieId: number) => {
  router.push({ path: `/movie/${movieId}` })
}

onMounted(() => {
  // 检查是否已经显示过欢迎提示
  const hasShownWelcome = sessionStorage.getItem('hasShownWelcome')

  if (!hasShownWelcome) {
    // 如果没有显示过，显示欢迎提示
    ElMessage({
      message: `欢迎您，${user.username} 用户`,
      type: 'success',
    })
    // 将状态存储到 sessionStorage，确保当前会话不再显示
    sessionStorage.setItem('hasShownWelcome', 'true')
  }

  // 恢复飘窗动画
  resumeFloating()
})

onUnmounted(() => {
  if (floatingTimer) {
    clearInterval(floatingTimer)
  }
})
</script>

<style scoped>
.home-page {
  padding: 0;
  margin: 0;
}

.el-carousel {
  min-height: 30vh;
}

.el-carousel-item {
  height: 100%;
}

.floating-window {
  position: fixed;
  width: 200px;
  height: 100px;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.close-icon {
  z-index: 2;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.scroll-text {
  padding: 10px;
  overflow: hidden;
  position: relative;
  min-height: 40px;
}

.scroll-content {
  position: absolute;
  white-space: nowrap;
  animation: scroll-left 10s linear infinite;
  top: 50%;
  transform: translateY(-50%);
}

@keyframes scroll-left {
  0% {
    transform: translateY(-50%) translateX(100%);
  }
  100% {
    transform: translateY(-50%) translateX(-100%);
  }
}

.movie-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
}
</style>
