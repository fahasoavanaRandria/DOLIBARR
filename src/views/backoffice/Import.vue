<template>
    <SidebarBack>
  <div>
    <h2>Import employes (CSV)</h2>
    <input type="file" accept=".csv" @change="chargerCSVEmployes" />
    <br/>
    <table v-if="employesData.length" border="1">
        <thead>
            <tr>
                <th>ref_employe</th>
                <th>nom</th>
                <th>genre</th>
                <th>identifiant</th>
                <th>heure_travail_semaine</th>
                <th>poste</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="emp in employesData" :key="emp.ref_employe">
                <td>{{ emp.ref_employe }}</td>
                <td>{{ emp.nom }}</td>
                <td>{{ emp.genre }}</td>
                <td>{{ emp.identifiant }}</td>
                <td>{{ emp.heure_travail_semaine }}</td>
                <td>{{ emp.poste }}</td>
            </tr>
        </tbody>
    </table>
    <button @click="importerEmployes" :disabled="!employesData.length">
      Importer
    </button>
    <p v-if="messageEmployes">{{ messageEmployes }}</p>

    <!--IMPORT SALAIRES-->
    <hr/>
    <h2>Import salaires (CSV)</h2>
    <input type="file" accept=".csv" @change="chargerCSVSalaires">
    <br/>
    <table v-if="salairesData.length" border="1">
        <thead>
            <tr>
                <th>ref_salaire</th>
                <th>ref_employe</th>
                <th>date_debut</th>
                <th>date_fin</th>
                <th>montant</th>
                <th>paiement</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="sal  in salairesData" :key="sal.ref_salaire">
                <td>{{ sal.ref_salaire }}</td>
                <td>{{ sal.ref_employe }}</td>
                <td>{{ sal.date_debut }}</td>
                <td>{{ sal.date_fin }}</td>
                <td>{{ sal.montant }}</td>
                <td>{{ sal.paiement }}</td>
            </tr>
        </tbody>
    </table>
    <button @click="importerSalaires" :disabled="!salairesData.length">
        Importer
    </button>
    <p v-if="messageSalaires">{{ messageSalaires }}</p>

    <!--IMPORT IMAGES-->
    <hr/>
    <h2>Import images (ZIP)</h2>
    <input type="file" accept=".zip" @change="chargerZip"/>
    <br/>
    <button @click="importerImages" :disabled="!zipFile">Importer</button>
    <p v-if="messageImages">{{ messageImages }}</p>
    <div v-if="imagesImportees.length">
        <p>Fichiers importes :</p>
        <ul>
            <li v-for="f in imagesImportees">{{ f }}</li>
        </ul>
    </div>
  </div>
  </SidebarBack>
</template>

<script setup>
import SidebarBack from '../../components/SidebarBack.vue'
import { ref } from 'vue'

const DOLAPIKEY = 'qu26pW8rZRy1IVIu3YS4vCouNQ1g38o0'
const API = 'http://localhost/dolibarr-23.0/htdocs/api/index.php'

//import employes
const employesData = ref([])
const messageEmployes = ref('')

function chargerCSVEmployes(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const lines = e.target.result.trim().split('\n')
    const headers = lines[0].split(',')
    employesData.value = lines.slice(1).map(line => {
      const values = line.split(',')
      const obj = {}
      headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim())
      return obj
    })
  }
  reader.readAsText(file)
}

async function importerEmployes() {
  messageEmployes.value = 'Import en cours...'
  let success = 0
  let erreurs = 0

  for (const emp of employesData.value) {
    try {
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DOLAPIKEY': DOLAPIKEY
        },
        body: JSON.stringify({
          login: emp.identifiant,
          lastname: emp.nom,
          password: emp.mdp,
          gender: emp.genre === 'homme' ? 'man' : 'woman',
          weeklyhours: emp.heure_travail_semaine,
          ref_employee: emp.ref_employe,
          job: emp.poste
        })
      })
      if (res.ok) success++
      else erreurs++
    } catch (err) {
      erreurs++
    }
  }

  messageEmployes.value = `Import termine : ${success} succes, ${erreurs} erreurs`
}

// import salaires
const salairesData = ref([])
const messageSalaires = ref('')

function chargerCSVSalaires(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const lines = e.target.result.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    salairesData.value = lines.slice(1).map(line => {
      const values = []
      let current = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      const obj = {}
      headers.forEach((h, i) => obj[h] = values[i] || '')
      return obj
    })
  }
  reader.readAsText(file)
}

async function importerSalaires() {
  messageSalaires.value = 'Import en cours...'
  let success = 0
  let erreurs = 0
  for (const sal of salairesData.value) {
    try {
      const res = await fetch('http://localhost:3000/salaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref_employe: sal.ref_employe,
          date_debut: sal.date_debut,
          date_fin: sal.date_fin,
          montant: sal.montant,
          paiement: sal.paiement
        })
      })
      if (res.ok) success++
      else erreurs++
    } catch (err) {
      erreurs++
    }
  }
  messageSalaires.value = `Import termine : ${success} succes, ${erreurs} erreurs`
}

// import images ZIP
const zipFile = ref(null)
const messageImages = ref('')
const imagesImportees = ref([])

function chargerZip(event) {
    zipFile.value = event.target.files[0]
}

async function importerImages() {
    messageImages.value = 'Import en cours...'
    try {
        const formData = new FormData()
        formData.append('zip', zipFile.value)

        const res = await fetch('http://localhost:3000/import-images', {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        if (data.success) {
            imagesImportees.value = data.fichiers
            messageImages.value = `Import termine : ${data.fichiers.length} fichiers`
        } else {
            messageImages.value = 'Erreur : ' + data.error
        }
    } catch (err) {
        messageImages.value = 'Erreur : ' + err.message
    }
}
</script>