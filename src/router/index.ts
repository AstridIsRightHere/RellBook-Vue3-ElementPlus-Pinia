import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import MovieDetail from '../views/MovieDetail.vue'
import BookingPage from '../views/BookingPage.vue'
import OrderConfirm from '../views/OrderConfirm.vue'
import AboutPage from '../views/AboutPage.vue'

// 定义路由规则
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
  {
    path: '/home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/movie/:id',
    component: MovieDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/booking/:id',
    component: BookingPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/order-confirm',
    component: OrderConfirm,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    component: AboutPage,
    meta: { requiresAuth: true },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫，实现权限控制
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('user')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
