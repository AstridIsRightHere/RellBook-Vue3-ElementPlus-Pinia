<template>
  <!-- 顶部导航栏 -->
  <Navbar />
  <div class="about-page">
    <h1>用户信息修改</h1>
    <el-form :model="userInfo" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="userInfo.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="userInfo.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="''"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="saveUserInfo">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/NavbarCom.vue'
import { useUserStore } from '../stores/userStore'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

// 获取用户信息存储实例
const userStore = useUserStore()

// 初始化用户信息
const userInfo = ref({
  username: userStore.user?.username || '',
  password: userStore.user?.password || '',
})

// 头像图片URL
const imageUrl = ref('')

// 处理头像上传成功后的逻辑，虽然上传成功不了就是了
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

// 上传头像前的验证逻辑
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

// 保存用户信息的逻辑
const saveUserInfo = () => {
  userStore.updateUserInfo(userInfo.value)
  ElMessage.success('用户信息更新成功')
}
</script>

<style scoped>
.about-page {
  padding: 20px;
}
h1 {
  margin: 20px 0;
  font-size: 24px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
