<template>
  <div id="palms-app">
    <Scene></Scene>
  </div>
</template>

<script>
export default {
  components: {
    Scene: require('./compos/Scene.vue').default
  }
}
</script>

<style>
body,html{
  width: 100%;
  height: 100%;
  margin: 0px;
}
</style>
<style scoped>
#palms-app, .fill{
  width: 100%;
  height: 100%;
  min-width: 100vw;
  min-height: 100vh;
}
</style>
