<template>
    <div>
        <h1>Login</h1>
        <p v-if="erreur">Code incorrect</p>
        <input type="password" v-model="code">
        <br>
        <button @click="connexion">Connexion</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const CODE_SECRET = 'admin123'
const code = ref('admin123')
const erreur = ref(false)
const router = useRouter()

function connexion() {
    if (code.value === CODE_SECRET) {
        sessionStorage.setItem('backoffice_auth', 'true')
        router.push('/backoffice/dashboard')
    } else {
        erreur.value = true
    }
}
</script>