<template>
    <SidebarFront>
  <div>
    <h1>Liste des salariés</h1>

    <table border="2">
      <thead>
        <tr>
          <th>Ref_employe</th>
          <th>Nom</th>
          <th>Genre</th>
          <th>Heures_travail_semaine</th>
          <th>Poste</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employes" :key="emp.rowid">
          <td>{{ emp.ref_employee }}</td>
          <td>
            <RouterLink :to="`/salarie/${emp.ref_employee}`">{{ emp.lastname }}</RouterLink>
          </td>
          <td>{{ emp.gender === 'man' ? 'Homme' : 'Femme' }}</td>
          <td>{{ emp.weeklyhours }}</td>
          <td>{{ emp.job }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </SidebarFront>
</template>

<script setup>
import SidebarFront from '../../components/SidebarFront.vue'
import { ref, onMounted } from 'vue'

const employes = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:3000/employes')
  employes.value = await res.json()
})
</script>