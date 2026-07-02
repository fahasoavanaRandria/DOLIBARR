import { createRouter, createWebHistory } from 'vue-router'

import LoginBack from '../views/backoffice/LoginBack.vue'
import Dashboard from '../views/backoffice/Dashboard.vue'
import Reset from '../views/backoffice/Reset.vue'
import Import from '../views/backoffice/Import.vue'
import JoursFeries from '../views/backoffice/JoursFeries.vue'

import Salaries from '../views/frontoffice/Salaries.vue'
import Paiement from '../views/frontoffice/Paiement.vue'
import GenererSalaires from '../views/frontoffice/GenererSalaires.vue'
import ListeSalaries from '../views/frontoffice/ListeSalaries.vue'
import DetailSalarie from '../views/frontoffice/DetailSalarie.vue'


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

  // VERS FRONTOFFICE
  {
    path: '/salaries',
    component: Salaries
  },
  {
    path: '/paiement', 
    component: Paiement
  },
  {
    path: '/generer-salaires',
    component: GenererSalaires
  },
  {
    path: '/liste-salaries',
    component: ListeSalaries
  },
  {
    path: '/salarie/:ref',
    component: DetailSalarie
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
