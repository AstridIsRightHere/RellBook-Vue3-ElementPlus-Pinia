clickable Avatar: undefined 1.登录页：
<template>
  <div class="container">
    <div class="card">
      <h2 class="title">登录</h2>
      <div class="input-group">
        <input v-model="username" placeholder="用户名" class="input-field" />
        <input v-model="password" type="password" placeholder="密码" class="input-field" />
      </div>
      <div class="button-group">
        <button @click="login" class="primary-button">登录</button>
        <button @click="cancel" class="cancel-button">取消</button>
      </div>
      <div class="link">
        <a @click="goToRegister" class="link-text">注册</a>
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

// 登录方法
const login = () => {
  if (username.value && password.value) {
    const user = { username: username.value, password: password.value }
    userStore.login(user)
    console.log('sessionStorage 用户信息:', sessionStorage.getItem('user')) // 调试信息
    router.push('/home')
  }
}

// 取消方法
const cancel = () => {
  username.value = ''
  password.value = ''
}

// 跳转注册页方法
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
@import '@/assets/loginRegister.css';
</style>
