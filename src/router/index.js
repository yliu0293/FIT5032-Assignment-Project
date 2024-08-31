import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import NavBar from '../views/NavBar.vue'
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import store from '../store/store'
import AccessDeniedView from '../Views/AccessDeniedView.vue'
import AdminLoginView from '../Views/AdminLoginView.vue'
import AdminView from '../Views/AdminView.vue'


const routes = [
  {
    path: '/',
    component: NavBar,
    children: [
      {
        path: '/',
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
      {
        path: 'register',
        name: 'Register',
        component: RegisterView,
      },
      {
        path: '/access-denied',
        name: 'AccessDenied',
        component: AccessDeniedView,
      },
      {
        path: '/admin-login',
        name: 'AdminLogin',
        component: AdminLoginView,
      },
      {
        path: '/admin-view',
        name: 'AdminView',
        component: AdminView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (!store.state.isAuthenticated && to.name !== 'Home' && to.name !== 'Login' && to.name !== 'Register' && to.name !== 'AdminLogin' && to.name !== 'AccessDenied') {
    return next({ name: 'AccessDenied' });
  } else {
    next();
  }
});

export default router