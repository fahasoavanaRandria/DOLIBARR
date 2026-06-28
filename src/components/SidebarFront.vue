<template>
  <div style="display: flex;">
    <div style="width: 200px; border-right: 1px solid black; padding: 10px; min-height: 100vh;">
      <h3>Frontoffice</h3>
      <hr>
      <ul style="list-style: none; padding: 0;">
        <li><RouterLink to="/salaries">Liste des salaries</RouterLink></li>
        <hr>
        <li><RouterLink to="/paiement">Salaires et paiements</RouterLink></li>
        <hr>
      </ul>
    </div>
    <div style="padding: 20px; flex: 1;">
      <slot />
    </div>
  </div>
</template>