<template>
  <div style="display: flex;">
    <div style="width: 200px; border-right: 1px solid black; padding: 10px; min-height: 100vh;">
      <h3>Backoffice</h3>
      <ul style="list-style: none; padding: 0;">
        <hr>
        <li><RouterLink to="/backoffice/dashboard">Dashboard</RouterLink></li>
        <hr>
        <li><RouterLink to="/backoffice/import">Import</RouterLink></li>
        <hr>
        <li><RouterLink to="/backoffice/reset">Reinitialisation</RouterLink></li>
        <hr>
        <li><RouterLink to="/backoffice/jours-feries">Jours feries</RouterLink></li>
        <hr>
        <li><a href="#" @click.prevent="deconnexion">Deconnexion</a></li>
        <hr>
      </ul>
    </div>
    <div style="padding: 20px; flex: 1;">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function deconnexion() {
  sessionStorage.removeItem('backoffice_auth')
  router.push('/backoffice/login')
}
</script>