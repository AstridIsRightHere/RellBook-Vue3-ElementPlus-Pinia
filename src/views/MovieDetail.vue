<template>
  <div class="movie-detail">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ movie.title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 电影详情 -->
    <div class="movie-info">
      <!-- 左侧：电影封面 -->
      <div class="movie-cover">
        <img :src="moviePoster" alt="电影海报" />
      </div>

      <!-- 中间：电影详情介绍 -->
      <div class="movie-description">
        <h2>{{ movie.title }}</h2>
        <p><strong>主演：</strong>{{ movie.actors }}</p>
        <p><strong>导演：</strong>{{ movie.director }}</p>
        <p><strong>编剧：</strong>{{ movie.screenwriters }}</p>
        <p><strong>类型：</strong>{{ movie.genres }}</p>
        <p><strong>官方网站：</strong><a :href="movie.officialSite" target="_blank">{{ movie.officialSite }}</a></p>
        <p><strong>国家/地区：</strong>{{ movie.countries }}</p>
        <p><strong>语言：</strong>{{ movie.languages }}</p>
        <p><strong>上映日期：</strong>{{ movie.releaseDates }}</p>
        <p><strong>片长：</strong>{{ movie.runtime }}</p>
        <p><strong>别名：</strong>{{ movie.aliases }}</p>
        <p><strong>IMDb：</strong><a :href="`https://www.imdb.com/title/${movie.imdb}`" target="_blank">{{ movie.imdb }}</a></p>
        <p><strong>评分：</strong>{{ movie.rating }}</p>
        <p><strong>简介：</strong>{{ movie.description }}</p>
        <p><strong>获奖情况：</strong>
          <ul>
            <li v-for="award in movie.awards" :key="award">{{ award }}</li>
          </ul>
        </p>
      </div>

      <!-- 右侧：购票和广告 -->
      <div class="movie-ticket">
        <button @click="navigateToBookingPage" class="ticket-button">购票</button>
        <div class="advertisement" @mouseenter="handleAdHover(true)" @mouseleave="handleAdHover(false)">
          <img src="https://dummyimage.com/200x200/000/fff" alt="广告" />
        </div>
      </div>
    </div>

    <!-- 评价功能 -->
    <div class="movie-evaluation">
      <div class="evaluation-buttons">
        <el-button :type="isInterested ? 'primary' : ''" @click="toggleInterest">想看</el-button>
        <el-button :type="isWatched ? 'primary' : ''" @click="toggleWatched">看过</el-button>
        <el-button @click="showWriteShortReviewDialog = true">写短评</el-button>
        <el-button @click="showWriteReviewDialog = true">写影评</el-button>
        <el-rate v-model="userRating" :max="5"></el-rate>
        <el-dropdown @command="handleShare">
          <el-button>分享</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="share">复制链接</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 写短评对话框 -->
      <el-dialog v-model="showWriteShortReviewDialog" title="写短评">
        <el-input v-model="currentShortReview" type="textarea" placeholder="请输入短评内容" autosize></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showWriteShortReviewDialog = false">取消</el-button>
            <el-button type="primary" @click="submitShortReview">提交</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 写影评对话框 -->
      <el-dialog v-model="showWriteReviewDialog" title="写影评">
        <el-form :model="reviewForm">
          <el-form-item label="影评标题" :label-width="formLabelWidth">
            <el-input v-model="reviewForm.title" placeholder="请输入影评标题" autocomplete="off" autosize/>
          </el-form-item>
          <el-form-item label="影评内容" :label-width="formLabelWidth">
            <el-input
              v-model="reviewForm.content"
              placeholder="请输入影评内容"
              autocomplete="off"
              autosize
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="评分" :label-width="formLabelWidth">
            <el-rate v-model="reviewForm.rating" show-text />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showWriteReviewDialog = false">取消</el-button>
            <el-button type="primary" @click="submitReview">提交</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 短评列表 -->
      <div class="review-list">
        <h3>短评列表</h3>
        <el-card v-for="(shortReview, index) in shortReviews" :key="index">
          <div class="review-header">
            <span>{{ shortReview.user }}</span>
            <span>{{ shortReview.time }}</span>
          </div>
          <div class="review-content">
            {{ shortReview.content }}
          </div>
          <!-- 根据用户是否匹配显示删除按钮 -->
          <el-button v-if="shortReview.user === user?.username" @click="removeShortReview(index)">删除</el-button>
        </el-card>
      </div>

      <!-- 影评列表 -->
      <div class="review-list">
        <h3>影评列表</h3>
        <el-card v-for="(review, index) in reviews" :key="index">
          <div class="review-header">
            <span>{{ review.user }}</span>
            <span>{{ review.time }}</span>
          </div>
          <div class="review-title">
            <h4>{{ review.title }}</h4>
          </div>
          <div class="review-content">
            {{ review.content }}
          </div>
          <div class="review-rating">
            <el-rate v-model="review.rating" disabled show-text />
          </div>
          <!-- 根据用户是否匹配显示删除按钮 -->
          <el-button v-if="review.user === user?.username" @click="removeReview(index)">删除</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import moviesData from '../data/movies.json';
import { useUserStore } from '../stores/userStore'
const userStore = useUserStore()
const user = userStore.user

const router = useRouter();
const route = useRoute();

// 获取当前电影信息
const movieId = route.params.id as string;
const movie = computed(() => {
  return moviesData[movieId];
});

// 动态计算电影海报路径
const moviePoster = computed(() => {
  return new URL(`/src/assets/card/${movie.value.poster}.jpg`, import.meta.url).href;
});

// 跳转到电影选座页面
const navigateToBookingPage = () => {
  router.push({ path: `/booking/${movieId}` });
};

// 广告交互状态
const isAdHovered = ref(false);
const handleAdHover = (isHover: boolean) => {
  isAdHovered.value = isHover;
};

// 用户评价状态
const isInterested = ref(false); // 是否想看
const isWatched = ref(false); // 是否看过
const userRating = ref(0); // 用户评分

// 短评相关
const showWriteShortReviewDialog = ref(false); // 写短评对话框显示状态
const currentShortReview = ref(''); // 当前输入的短评内容
const shortReviews = ref<{ user: string; time: string; content: string }[]>([]); // 短评列表

// 影评相关
const showWriteReviewDialog = ref(false); // 写影评对话框显示状态
const reviewForm = reactive({ // 影评表单数据
  title: '',
  content: '',
  rating: 0,
});
const formLabelWidth = '80px'; // 表单标签宽度
const reviews = ref<{ user: string; time: string; title: string; content: string; rating: number }[]>([]); // 影评列表

// 从本地存储加载评价数据
const loadEvaluationData = () => {
  const storedShortReviews = sessionStorage.getItem(`shortReviews_${movieId}`);
  const storedReviews = sessionStorage.getItem(`reviews_${movieId}`);
  const storedIsInterested = sessionStorage.getItem(`isInterested_${movieId}`);
  const storedIsWatched = sessionStorage.getItem(`isWatched_${movieId}`);
  const storedUserRating = sessionStorage.getItem(`userRating_${movieId}`);
  if (storedShortReviews) shortReviews.value = JSON.parse(storedShortReviews);
  if (storedReviews) reviews.value = JSON.parse(storedReviews);
  if (storedIsInterested) isInterested.value = JSON.parse(storedIsInterested);
  if (storedIsWatched) isWatched.value = JSON.parse(storedIsWatched);
  if (storedUserRating) userRating.value = Number(storedUserRating);
};

// 保存评价数据到本地存储
const saveEvaluationData = () => {
  sessionStorage.setItem(`shortReviews_${movieId}`, JSON.stringify(shortReviews.value));
  sessionStorage.setItem(`reviews_${movieId}`, JSON.stringify(reviews.value));
  sessionStorage.setItem(`isInterested_${movieId}`, JSON.stringify(isInterested.value));
  sessionStorage.setItem(`isWatched_${movieId}`, JSON.stringify(isWatched.value));
  sessionStorage.setItem(`userRating_${movieId}`, JSON.stringify(userRating.value));
};

// 切换"想看"状态
const toggleInterest = () => {
  isInterested.value = !isInterested.value;
  saveEvaluationData();
  ElMessage.success(isInterested.value ? '已标记为想看' : '已取消想看标记');
};

// 切换"看过"状态
const toggleWatched = () => {
  isWatched.value = !isWatched.value;
  saveEvaluationData();
  ElMessage.success(isWatched.value ? '已标记为看过' : '已取消看过标记');
};

// 提交短评
const submitShortReview = () => {
  if (!currentShortReview.value.trim()) {
    ElMessage.warning('请输入短评内容');
    return;
  }

  shortReviews.value.push({
    user: `${user?.username || '匿名用户'}`, // 使用模板字符串并处理可能的 undefined
    time: new Date().toLocaleString(),
    content: currentShortReview.value,
  });

  currentShortReview.value = '';
  showWriteShortReviewDialog.value = false;
  saveEvaluationData();
  ElMessage.success('短评提交成功');
};

// 提交影评
const submitReview = () => {
  if (!reviewForm.title.trim() || !reviewForm.content.trim() || reviewForm.rating === 0) {
    ElMessage.warning('请填写完整的影评信息');
    return;
  }

  reviews.value.push({
    user: `${user?.username || '匿名用户'}`, // 使用模板字符串并处理可能的 undefined
    time: new Date().toLocaleString(),
    title: reviewForm.title,
    content: reviewForm.content,
    rating: reviewForm.rating,
  });

  // 重置表单
  reviewForm.title = '';
  reviewForm.content = '';
  reviewForm.rating = 0;

  showWriteReviewDialog.value = false;
  saveEvaluationData();
  ElMessage.success('影评提交成功');
};

// 删除短评
const removeShortReview = (index: number) => {
  shortReviews.value.splice(index, 1);
  saveEvaluationData();
  ElMessage.success('短评删除成功');
};

// 删除影评
const removeReview = (index: number) => {
  ElMessageBox.confirm(
    '确定要删除这条影评吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    reviews.value.splice(index, 1);
    saveEvaluationData();
    ElMessage({
      type: 'success',
      message: '影评删除成功',
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除',
    })
  });
};

// 分享功能
const handleShare = (command: string) => {
  if (command === 'share') {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      ElMessage.success('链接已复制到剪贴板');
    }).catch(() => {
      ElMessage.error('复制链接失败');
    });
  }
};

// 生命周期钩子
onMounted(() => {
  loadEvaluationData();
});
</script>

<style scoped>
/* 基础样式 */
.movie-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.movie-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: space-between;
  align-items: center;
}

.movie-cover {
  width: 250px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
}

.movie-cover img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.movie-description {
  flex: 1;
  min-width: 300px;
  overflow-wrap: break-word;
}

.movie-description p {
  margin-bottom: 10px;
  line-height: 1.6;
}

.movie-description ul {
  padding-left: 20px;
}

.movie-description li {
  margin-bottom: 5px;
}

.movie-ticket {
  width: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 100px;
}

.ticket-button {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ticket-button:hover {
  background-color: #66b1ff;
}

.advertisement {
  width: 100%;
  margin-top: 20px;
  transition: transform 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.advertisement:hover {
  transform: scale(1.05);
}

.movie-evaluation {
  margin-top: 40px;
}

.evaluation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.evaluation-buttons .el-button {
  flex: 1;
  min-width: 100px;
}

.review-list {
  margin-top: 30px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}

.review-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.review-content {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #444;
}

.review-rating {
  margin-bottom: 10px;
}

.el-card {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.el-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 媒体查询 - 平板设备 */
@media (max-width: 992px) {
  .movie-info {
    flex-direction: column;
  }

  .movie-cover {
    width: 200px;
    margin-bottom: 20px;
    align-self: center;
  }

  .movie-description {
    width: 100%;
  }

  .movie-ticket {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ticket-button {
    width: auto;
    flex: 1;
  }

  .advertisement {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}

/* 媒体查询 - 移动设备 */
@media (max-width: 576px) {
  .movie-cover {
    width: 150px;
  }

  .movie-description {
    font-size: 14px;
  }

  .evaluation-buttons {
    flex-direction: column;
  }

  .evaluation-buttons .el-button {
    width: 100%;
  }

  .review-list {
    padding: 0 10px;
  }

  .el-card {
    padding: 10px;
  }
}

/* 按钮样式 */
.el-button {
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 14px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}

.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

/* 面包屑导航 */
.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
}

.el-breadcrumb__inner {
  color: #409eff;
  font-weight: bold;
}

/* 广告图片 */
.advertisement img {
  width: 100%;
  height: auto;
  display: block;
}

/* 短评和影评卡片 */
.review-list h3 {
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
}

.el-card__body {
  display: flex;
  flex-direction: column;
}

.review-content {
  flex: 1;
}
</style>
