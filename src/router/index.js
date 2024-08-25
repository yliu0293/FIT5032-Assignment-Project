import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import Layout from '../views/NavBar.vue'
import LoginView from '../views/LoginView.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: HomeView,
      },
      {
        path: 'about',
        name: 'About',
        component: AboutView,
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router