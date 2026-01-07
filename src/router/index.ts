import { createRouter, createWebHistory } from 'vue-router'
import  LoginView  from "../views/auth/LoginView.vue";
import RegsiterView from "../views/auth/RegisterView.vue";
import DashboardView from '@/views/dashboard/DashboardView.vue';
import ProductsView from "@/views/products/ProductsView.vue";
import CategoryView from "@/views/category/CategoryView.vue";
import ClientsView from '@/views/clients/ClientsView.vue';
import AuthCallback from "@/views/auth/AuthCallback.vue";



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
      path: '/pdv',
      name: 'pdv',
      component: () => import('../views/pdv/PdvView.vue'),
      meta: { hideSidebar: true },
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientsView,
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryView,
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallback,
      meta: { isPublic: true },
    },
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
