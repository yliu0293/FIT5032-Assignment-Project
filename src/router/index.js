import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import NavBar from '../views/NavBar.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AccessDeniedView from '@/views/AccessDeniedView.vue';
import AdminLoginView from '@/views/AdminLoginView.vue';
import AdminView from '@/views/AdminView.vue';
import RatingView from '../views/RatingView.vue';
import FirebaseSigninView from '../views/FirebaseSigninView.vue';
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue';
import LogoutView from '@/views/LogoutView.vue';
import db from '@/firebase/init';
import GetSupportView from '@/views/GetSupportView.vue';
import StayHealthyView from '@/views/StayHealthyView.vue';
import EventView from '@/views/EventView.vue';

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
      {
        path: '/rating',
        name: 'RatingView',
        component: RatingView,
      },
      {
        path: '/Firelogin',
        name: 'FireLogin',
        component: FirebaseSigninView
      },
      {
        path: '/Fireregister',
        name: 'FireRegister',
        component: FirebaseRegisterView
      },
      {
        path: '/logout',
        name: 'Logout',
        component: LogoutView
      },
      {
        path: '/getsupport',
        name: 'GetSupport',
        component: GetSupportView
      },
      {
        path: '/stayhealthy',
        name: 'StayHealthy',
        component: StayHealthyView
      },
      {
        path: '/event',
        name: 'Event',
        component: EventView
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add Firebase auth state tracking
const auth = getAuth();
//const db = getFirestore();

router.beforeEach((to, from, next) => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // User is not logged in
      if (to.name !== 'Home' && to.name !== 'FireLogin' && to.name !== 'FireRegister' && to.name !== 'AdminLogin' && to.name !== 'AccessDenied' && to.name !== 'Logout') {
        return next({ name: 'AccessDenied' });
      }
    } else {
      // User is authenticated, check for admin role if navigating to AdminView
      if (to.name === 'AdminView') {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          if (userRole !== 'admin') {
            return next({ name: 'AccessDenied' });
          }
        } else {
          return next({ name: 'AccessDenied' });
        }
      }
      if (to.name === 'RatingView') {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          if (userRole == 'admin') {
            return next({ name: 'AccessDenied' });
          }
        } else {
          return next({ name: 'AccessDenied' });
        }
      }
    }
    next();
  });
});

export default router;
