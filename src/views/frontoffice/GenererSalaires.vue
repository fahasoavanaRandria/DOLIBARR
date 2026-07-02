<template>
    <SidebarFront>
  <div>
    <h1>Génération de plusieurs salariés</h1>

    <select v-model="filtreGenre">
        <option value="">Tous les genres</option>
        <option value="man">Homme</option>
        <option value="woman">Femme</option>
    </select>
    <input v-model="filtrePoste" placeholder="Poste">
    <input v-model="filtreHeureMin" placeholder="Heure min" type="number">
    <input v-model="filtreHeureMax" placeholder="Heure max" type="number">

    <hr>
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
        <tr v-for="emp in employesFiltres" :key="emp.rowid">
          <td>{{ emp.ref_employee }}</td>
          <td>{{ emp.lastname }}</td>
          <td>{{ emp.gender === 'man' ? 'Homme' : 'Femme' }}</td>
          <td>{{ emp.weeklyhours }}</td>
          <td>{{ emp.job }}</td>
        </tr>
      </tbody>
    </table>

    <!--Formulaire Date + Montant -->
    <hr>
    <h2>Generer le salaire</h2>
    <div>
        <label>Date debut : </label>
        <input type="date" v-model="dateDebut">
    </div>
    <br/>
    <div>
        <label>Date fin : </label>
        <input type="date" v-model="dateFin">
    </div>
    <br/>
    <div>
        <label>Montant : </label>
        <input type="number" v-model="montant">
    </div>
    <br/>
    <button @click="genererSalaires">Generer ({{ employesFiltres.length }} salaries)</button>
    <p v-if="messageGeneration">{{ messageGeneration }}</p>

  </div>
  </SidebarFront>
</template>

<script setup>
import SidebarFront from '../../components/SidebarFront.vue'
import { ref, onMounted, computed } from 'vue'

const employes = ref([])

const filtreGenre = ref('')
const filtrePoste = ref('')
const filtreHeureMin = ref('')
const filtreHeureMax = ref('')

const dateDebut = ref('')
const dateFin = ref('')
const montant = ref('')
const messageGeneration = ref('')

onMounted(async () => {
  const res = await fetch('http://localhost:3000/employes')
  employes.value = await res.json()
})

const employesFiltres = computed(() => {
    return employes.value.filter(emp => {
        const genreOk = filtreGenre.value === '' || emp.gender === filtreGenre.value
        const posteOk = filtrePoste.value === '' || (emp.job && emp.job.toLowerCase().includes(filtrePoste.value.toLowerCase()))
        const heureMinOk = filtreHeureMin.value === '' || emp.weeklyhours >= filtreHeureMin.value
        const heureMaxOk = filtreHeureMax.value === '' || emp.weeklyhours <= filtreHeureMax.value

        return genreOk && posteOk && heureMinOk && heureMaxOk
    })
})

async function genererSalaires() {
  messageGeneration.value = 'Génération en cours...'
  let success = 0
  let erreurs = 0

  for (const emp of employesFiltres.value) {
    try {
      const res = await fetch('http://localhost:3000/creer-salaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref_employe: emp.ref_employee,
          date_debut: dateDebut.value,
          date_fin: dateFin.value,
          montant: montant.value
        })
      })
      const data = await res.json()
      if (data.success) success++
      else erreurs++
    } catch (err) {
      erreurs++
    }
  }

  messageGeneration.value = `Génération terminée : ${success} succès, ${erreurs} erreurs`
}
</script>