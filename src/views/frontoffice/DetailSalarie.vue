<template>
    <SidebarFront>
  <div v-if="employe">
    <h1>Fiche de :  {{ employe.lastname}} </h1>
    <p>Genre : {{ employe.gender === 'man' ? 'Homme' : 'Femme' }}</p>
    <p>Poste : {{ employe.job }}</p>
    <p>Heures par semaine : {{ employe.weeklyhours }}</p>
    <p>Identifiant : {{ employe.login }}</p>

    <hr>
    <h2>Historique des salaires</h2>
    <table border="2">
      <thead>
        <tr>
          <th>Date début</th>
          <th>Date fin</th>
          <th>Montant</th>
          <th>Payé</th>
          <th>Reste à payer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sal in salaires" :key="sal.rowid">
          <td>{{ sal.datesp?.slice(0, 10) }}</td>
          <td>{{ sal.dateep?.slice(0, 10) }}</td>
          <td>{{ sal.amount }}</td>
          <td>{{ sal.total_paye }}</td>
          <td>{{ sal.amount - sal.total_paye }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
  </SidebarFront>
</template>

<script setup>
import SidebarFront from '../../components/SidebarFront.vue'
import { ref, onMounted, normalizeStyle } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const employe = ref(null)
const salaires = ref([])

onMounted(async () => {
  const res = await fetch(`http://localhost:3000/salarie/${route.params.ref}/salaires`)
  const data = await res.json()
  employe.value = data.employe
  salaires.value = data.salaires
})
</script>