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
      <th>Date debut</th>
      <th>Date fin</th>
      <th>Montant total</th>
      <th>Date paiement</th>
      <th>Montant paye</th>
      <th>Reste a payer</th>
      <th>Statut</th>
    </tr>
  </thead>
  <tbody>
    <template v-for="sal in salaires" :key="sal.rowid">
      <tr v-if="!sal.paiements.length">
        <td>{{ sal.datesp?.slice(0, 10) }}</td>
        <td>{{ sal.dateep?.slice(0, 10) }}</td>
        <td>{{ sal.amount }}</td>
        <td>-</td>
        <td>-</td>
        <td>{{ sal.amount }}</td>
        <td>Non paye</td>
      </tr>
      <tr v-for="(p, i) in sal.paiements" :key="p.datep + i">
        <td>{{ i === 0 ? formatDate(sal.datesp) : '' }}</td>
        <td>{{ i === 0 ? formatDate(sal.dateep) : '' }}</td>
        <td>{{ i === 0 ? sal.amount : '' }}</td>
        <td>{{ formatDate(p.datep) }}</td>
        <td>{{ p.amount }}</td>
        <td>{{ (sal.amount - sal.paiements.slice(0, i + 1).reduce((acc, x) => acc + x.amount, 0)).toFixed(2) }}</td>
        <td>{{ i === sal.paiements.length - 1 ? statutLabel(sal) : '' }}</td>
      </tr>
    </template>
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
import { ref, onMounted, computed } from 'vue'
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

function formatDate(d) {
  if (!d) return '-'
  return d.slice(0, 10).split('-').reverse().join('/')
}

function statutLabel(sal) {
  if (sal.amount - sal.total_paye <= 0) return 'Paye'
  if (sal.total_paye > 0) return 'Reglement commence'
  return 'Non paye'
}

</script>