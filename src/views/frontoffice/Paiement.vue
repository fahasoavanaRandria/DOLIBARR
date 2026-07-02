<template>
    <SidebarFront>
  <div>
    <h1>Créer un salaire</h1>
    <p v-if="message">{{ message }}</p>

    <div>
      <label>Employé</label><br/>
      <select v-model="form.ref_employe">
        <option value="">Choisir un employé</option>
        <option v-for="emp in employes" :key="emp.rowid" :value="emp.ref_employee">
          {{ emp.lastname }}
        </option>
      </select>
    </div>
    <br/>
    <div>
      <label>Date début</label><br/>
      <input type="date" v-model="form.date_debut" />
    </div>
    <br/>
    <div>
      <label>Date fin</label><br/>
      <input type="date" v-model="form.date_fin" />
    </div>
    <br/>
    <div>
      <label>Montant</label><br/>
      <input type="number" v-model="form.montant" />
    </div>
    <br/>
    <button @click="creerSalaire">Créer</button>

    <hr/>
    <!--Liste des salaires-->

    <h2>Paiement des salaires</h2>
    <table border="2">
        <thead>
            <tr>
                <th>Employe</th>
                <th>Date debut</th>
                <th>Date fin</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Action</th>
            </tr>
        </thead> 
        <tbody>
                <tr v-for="sal in salaires" :key="sal.rowid">
                    <td style="cursor:pointer; text-decoration:underline" @click="voirDetail(sal)">
                {{ sal.lastname }}
                </td>
                <td>{{ sal.datesp?.slice(0, 10) }}</td>
                <td>{{ sal.dateep?.slice(0, 10) }}</td>
                <td>{{ sal.amount }}</td>
                <td>{{ statutLabel(sal) }}</td>
                <td>
                    <button v-if="sal.paye == 0 && sal.total_paye < sal.amount" @click="ouvrirPaiement(sal)">Payer</button>
                </td>
            </tr>
        </tbody>
    </table>

    <!--DETAILS SALAIRE-->
    <div v-if="detailSalaire">
        <h2>Detail - {{ detailSalaire.lastname }}</h2>
        <p>Total a payer : {{ detailSalaire.amount }}</p>
        <p>Deja paye : {{ detailSalaire.total_paye }}</p>
        <p>Reste a payer : {{ detailSalaire.reste }}</p>
    </div>

    <!--PAIEMENT-->
    <div v-if="salaireSelectionne">
    <h2>Payer le salaire de {{ salaireSelectionne.lastname }}</h2>
    <p>Montant total : {{ salaireSelectionne.amount }}</p>
    <label>Date paiement</label><br/>
    <input type="date" v-model="datePaiement" /><br/><br/>
    <label>Montant</label><br/>
    <input type="number" v-model="montantPaiement" /><br/><br/>
    <button @click="payerSalaire">Valider</button>
    <p v-if="messagePaiement">{{ messagePaiement }}</p>
    </div>  
    </div>
    </SidebarFront>
</template>

<script setup>
import SidebarFront from '../../components/SidebarFront.vue'
import { ref, onMounted } from 'vue'

const employes = ref([])
const message = ref('')
const form = ref({
  ref_employe: '',
  date_debut: '',
  date_fin: '',
  montant: ''
})
const salaires = ref([])
const salaireSelectionne = ref(null)
const montantPaiement = ref('')
const datePaiement = ref('')
const messagePaiement = ref('')

onMounted(async () => {
  const res = await fetch('http://localhost:3000/employes')
  employes.value = await res.json()
  chargerSalaires()
})

async function creerSalaire() {
  const res = await fetch('http://localhost:3000/creer-salaire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  const data = await res.json()
  if (data.success) {
    message.value = 'Salaire créé avec succès'
    form.value = { ref_employe: '', date_debut: '', date_fin: '', montant: '' }
  } else {
    message.value = 'Erreur : ' + data.error
  }
}

async function chargerSalaires() {
    const res = await fetch('http://localhost:3000/salaires-liste')
    salaires.value = await res.json()
}

function ouvrirPaiement(sal) {
    salaireSelectionne.value = sal
    montantPaiement.value = ''
    datePaiement.value = ''
    messagePaiement.value = ''
}

async function payerSalaire() {
  const res = await fetch('http://localhost:3000/payer-salaire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fk_salary: salaireSelectionne.value.rowid,
      ref_employee: salaireSelectionne.value.ref_employee,
      montant: montantPaiement.value,
      date_paiement: datePaiement.value
    })
  })
  const data = await res.json()
  if (data.success) {
    messagePaiement.value = 'Paiement enregistre'
    await chargerSalaires()
    salaireSelectionne.value = null
  } else {
    messagePaiement.value = 'Erreur : ' + data.error
  }
}

// details salaire
const detailSalaire = ref(null)

async function voirDetail(sal) {
  const res = await fetch(`http://localhost:3000/detail-salaire/${sal.rowid}`)
  const data = await res.json()
  detailSalaire.value = {
    ...sal,
    total_paye: data.total_paye,
    reste: sal.amount - data.total_paye
  }
}

function statutLabel(sal) {
  if (sal.paye == 1) return 'Paye'
  if (sal.total_paye > 0) return 'Reglement commence'
  return 'Non paye'
}

</script>