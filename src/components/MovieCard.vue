<template>
  <div class="movie-card">
    <h3>
      {{ movie.title }}
      <span @click="goToDetail(movie.id)">>></span>
    </h3>
    <img :src="moviePoster" alt="电影海报" />
    <p>
      {{
        movie.description.length > 50 ? movie.description.slice(0, 50) + '...' : movie.description
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{
  movie: {
    title: string
    id: number
    poster: string
    description: string
  }
}>()

// 显式解构 props 中的 movie
const { movie } = props

// 动态计算图片路径
const moviePoster = computed(() => {
  return new URL(`/src/assets/card/${movie.poster}.jpg`, import.meta.url).href
})

const router = useRouter()
const goToDetail = (movieId: number) => {
  router.push({ path: `/movie/${movieId}` })
  console.log(movieId)
}
</script>

<style scoped>
.movie-card {
  width: 200px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.movie-card img {
  width: 100%;
  height: auto;
}
</style>
