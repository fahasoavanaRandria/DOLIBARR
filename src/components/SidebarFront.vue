<template>
  <div style="display: flex;">
    <div style="width: 200px; border-right: 1px solid black; padding: 10px; min-height: 100vh;">
      <h3>Frontoffice</h3>
      <hr>
      <ul style="list-style: none; padding: 0;">
        <h4><li><RouterLink to="/salaries">Recherche multi-criteres</RouterLink></li></h4>
        <hr>
        <h4><li><RouterLink to="/paiement">Creation et Paiements</RouterLink></li></h4>
        <hr>
        <h4><li><RouterLink to="/generer-salaires">Genereration salaires</RouterLink></li></h4>
        <hr>
        <h4><li><RouterLink to="/liste-salaries">Liste des salaries</RouterLink></li></h4>
        <hr>
      </ul>
    </div>
    <div style="padding: 20px; flex: 1;">
      <slot />
    </div>
  </div>
</template>