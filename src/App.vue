<template>
  <div id="app">
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
#app, .fill{
  width: 100%;
  height: 100%;
}
</style>
