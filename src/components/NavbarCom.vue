<template>
  <el-menu mode="horizontal" :ellipsis="false" :default-active="activeIndex">
    <el-menu-item index="home">
      <router-link to="/">首页</router-link>
    </el-menu-item>
    <el-menu-item index="about" style="margin-left: auto">
      <router-link to="/about">关于</router-link>
    </el-menu-item>
    <el-menu-item index="logout" style="float: right" @click="logout"> 退出登录 </el-menu-item>
    <el-menu-item index="user" style="float: right" @click="dialogVisible = true">
      <span>{{ user.username }}</span>
      <el-avatar :src="avatarSrc" shape="circle"></el-avatar>
    </el-menu-item>

    <el-dialog v-model="dialogVisible" title="头像大图">
      <div style="position: relative">
        <el-watermark :font="font" :content="user.username">
          <el-image :src="avatarSrc" style="width: 100%"></el-image>
        </el-watermark>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRoute } from 'vue-router'
import { reactive } from 'vue'

const dialogVisible = ref(false)

const userStore = useUserStore()
const user = ref(userStore.user)
const avatarSrc = 'https://dummyimage.com/50/000/fff'

const route = useRoute()
const activeIndex = computed(() => {
  if (route.path === '/home') {
    return 'home'
  } else if (route.path === '/about') {
    return 'about'
  }
  return ''
})

const font = reactive({
  color: 'rgba(255, 0, 0, 0.75)',
})

// 退出登录方法
const logout = () => {
  userStore.logout()
  // 跳转到登录页面
  window.location.href = '/login'
}
</script>

<style scoped>
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  color: red;
  opacity: 0.5;
  font-size: 30px;
  z-index: 1;
}

.el-menu-item a {
  text-decoration: none;
}
</style>
