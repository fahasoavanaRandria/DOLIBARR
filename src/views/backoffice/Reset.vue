<template>
    <SidebarBack>
  <div>
    <h1>Reinitialisation des donnees</h1>
    <p v-if="message">{{ message }}</p>
    <button @click="reset">Reinitialiser</button>
  </div>
  </SidebarBack>
</template>

<script setup>
import SidebarBack from '../../components/SidebarBack.vue'
import { ref } from 'vue'

const message = ref('')

async function reset() {
  message.value = 'En cours...'
  try {
    const res = await fetch('http://localhost:3000/reset', { method: 'POST' })
    const data = await res.json()
    message.value = data.message
  } catch (err) {
    message.value = 'Erreur : ' + err.message
  }
}
</script>