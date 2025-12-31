import { createRouter, createWebHistory } from 'vue-router'
import  LoginView  from "../views/auth/LoginView.vue";
import RegsiterView from "../views/auth/RegisterView.vue";
import DashboardView from '@/views/dashboard/DashboardView.vue';
import ProductsView from "@/views/products/ProductsView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { isPublic: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegsiterView,
      meta: { isPublic: true },
    },
    {
      path: '/home',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    }

  ],
})
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user_token')

  if (!to.meta.isPublic && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})


export default router
