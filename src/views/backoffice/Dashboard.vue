<template>
    <SidebarBack>
    <div>
        <h1>Dashboard</h1>

        <h2>Montant de salaire par genre</h2>
        <table border="1">
            <thead>
                <tr>
                    <th>Genre</th>
                    <th>Total salaire</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in salaireParGenre" :key="row.gender">
                    <td>{{ row.gender === 'man' ? 'Homme' : 'Femme' }}</td>
                    <td>{{row.total}}</td>
                </tr>
            </tbody>
        </table>

        <hr>
        <h2>Montant de salaire par mois</h2>
        <table border="1">
            <thead>
                <tr>
                    <th>Mois</th>
                    <th>Total salaire</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in salaireParMois" :key="row.mois">
                    <td>{{ row.mois }}</td>
                    <td>{{ row.total }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    </SidebarBack>
</template>

<script setup>
import SidebarBack from '../../components/SidebarBack.vue'
import { ref, onMounted } from 'vue'

//SALAIRE PAR GENRE
const salaireParGenre = ref([])

onMounted(async () => {
    const res = await fetch('http://localhost:3000/stats/salaire-par-genre')
    salaireParGenre.value = await res.json()
})

//SALAIRE PAR MOIS
const salaireParMois = ref([])

onMounted(async () => {
    const res2 = await fetch('http://localhost:3000/stats/salaire-par-mois')
    salaireParMois.value = await res2.json()
})
</script>