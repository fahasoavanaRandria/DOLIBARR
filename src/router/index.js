import { createRouter, createWebHistory } from 'vue-router'

import LoginBack from '../views/backoffice/LoginBack.vue'
import Dashboard from '../views/backoffice/Dashboard.vue'
import Reset from '../views/backoffice/Reset.vue'
import Import from '../views/backoffice/Import.vue'
import JoursFeries from '../views/backoffice/JoursFeries.vue'

import Salaries from '../views/frontoffice/Salaries.vue'
import Paiement from '../views/frontoffice/Paiement.vue'


const routes = [
  {
    path: '/backoffice/login',
    component: LoginBack
  },
  {
    path: '/backoffice/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/backoffice/reset',
    component: Reset,
    meta: { requiresAuth: true }
  },
  {
    path: '/backoffice/import',
    component: Import,
    meta: { requiresAuth: true }
  },
  {
    path: '/backoffice/jours-feries',
    component: JoursFeries,
    meta: { requiresAuth: true}
  },
  {
    path: '/salaries',
    component: Salaries
  },
  {
    path: '/paiement', 
    component: Paiement
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if(to.meta.requiresAuth && !sessionStorage.getItem('backoffice_auth')) {
    next('backoffice/login')
  }
})



export default router
