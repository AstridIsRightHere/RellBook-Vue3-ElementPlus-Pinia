<template>
  <div class="container">
    <div class="card">
      <h2 class="title">注册</h2>
      <div class="input-group">
        <input v-model="username" placeholder="用户名" class="input-field" />
        <input v-model="password" type="password" placeholder="密码" class="input-field" />
      </div>
      <div class="button-group">
        <button @click="register" class="primary-button">注册</button>
      </div>
      <div class="link">
        <a @click="goToLogin" class="link-text">登录</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')

// 注册方法
const register = () => {
  if (username.value && password.value) {
    const user = { username: username.value, password: password.value }
    userStore.register(user)
    router.push('/login')
  }
}
// 跳转登录页方法
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
@import '@/assets/loginRegister.css';
</style>
