<template>
  <SidebarBack>
    <h1>Jours feries</h1>

    <h2>=> Ajouter un jour ferie</h2>
    <input v-model="form.nom" placeholder="Nom" />
    <input type="date" v-model="form.date" />
    <button @click="ajouter">Ajouter</button>
    <p v-if="message">{{ message }}</p>

    <hr>
    <h2>=> Liste des jours feries</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="jf in joursFeries" :key="jf.id">
          <td>
            <span v-if="editId !== jf.id">{{ jf.nom }}</span>
            <input v-else v-model="editForm.nom" />
          </td>
          <td>
            <span v-if="editId !== jf.id">{{ jf.date }}</span>
            <input v-else type="date" v-model="editForm.date" />
          </td>
          <td>
            <span v-if="editId !== jf.id">
              <button @click="editer(jf)">Modifier</button>
              <button @click="supprimer(jf.id)">Supprimer</button>
            </span>
            <span v-else>
              <button @click="sauvegarder(jf.id)">Sauvegarder</button>
              <button @click="editId = null">Annuler</button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </SidebarBack>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SidebarBack from '../../components/SidebarBack.vue'

const joursFeries = ref([])
const message = ref('')
const form = ref({ nom: '', date: '' })
const editId = ref(null)
const editForm = ref({ nom: '', date: '' })

async function charger() {
  const res = await fetch('http://localhost:3000/jours-feries')
  joursFeries.value = await res.json()
}

onMounted(charger)

async function ajouter() {
  const res = await fetch('http://localhost:3000/jours-feries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  const data = await res.json()
  if (data.success) {
    message.value = 'Ajoute avec succes'
    form.value = { nom: '', date: '' }
    charger()
  }
}

function editer(jf) {
  editId.value = jf.id
  editForm.value = { nom: jf.nom, date: jf.date }
}

async function sauvegarder(id) {
  await fetch(`http://localhost:3000/jours-feries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editForm.value)
  })
  editId.value = null
  charger()
}

async function supprimer(id) {
  await fetch(`http://localhost:3000/jours-feries/${id}`, { method: 'DELETE' })
  charger()
}
</script>