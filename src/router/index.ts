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
    redirect: '/home',
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
  console.log('目标路由:', to.path)
  console.log('是否需要认证:', to.meta.requiresAuth)
  console.log('是否已登录:', isAuthenticated)
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('未登录，重定向到登录页面')
    next('/login')
  } else {
    console.log('已登录或不需要认证，继续访问')
    next()
  }
})

export default router
