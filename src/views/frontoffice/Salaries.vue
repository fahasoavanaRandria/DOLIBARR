<template>
    <SidebarFront>
  <div>
    <h1>Recherche des salaries</h1>

    <input v-model="filtreRef" placeholder="ref_employe" type="number">
    <input v-model="filtreNom" placeholder="nom">
    <select v-model="filtreGenre">
        <option value="">Tous les genres</option>
        <option value="man">Homme</option>
        <option value="woman">Femme</option>
    </select>
    <input v-model="filtreHeures" placeholder="Heures/semaine" type="number">
    <input v-model="filtrePoste" placeholder="Poste">

    <hr>
    <table border="2">
      <thead>
        <tr>
          <th>Ref_employe</th>
          <th>Nom</th>
          <th>Genre</th>
          <th>Identifiant</th>
          <th>Heures_travail_semaine</th>
          <th>Poste</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employesFiltres" :key="emp.rowid">
          <td>{{ emp.ref_employee }}</td>
          <td>{{ emp.lastname }}</td>
          <td>{{ emp.gender === 'man' ? 'Homme' : 'Femme' }}</td>
          <td>{{ emp.login }}</td>
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
import { ref, onMounted, computed } from 'vue'

const employes = ref([])
const filtreRef = ref('')
const filtreNom = ref('')
const filtreGenre = ref('')
const filtreHeures = ref('')
const filtrePoste = ref('')

onMounted(async () => {
  const res = await fetch('http://localhost:3000/employes')
  employes.value = await res.json()
})

const employesFiltres = computed(() => {
    return employes.value.filter(emp => {
        const refOk = filtreRef.value === '' || emp.ref_employee == filtreRef.value
        const nomOk = emp.lastname.toLowerCase().includes(filtreNom.value.toLowerCase())
        const genreOk = filtreGenre.value === '' || emp.gender === filtreGenre.value
        const heuresOk = filtreHeures.value === '' || emp.weeklyhours ==filtreHeures.value
        const posteOk = filtrePoste.value === '' || (emp.job && emp.job.toLowerCase().includes(filtrePoste.value.toLowerCase()))

        return refOk && nomOk && genreOk && heuresOk && posteOk
    })
})



</script>