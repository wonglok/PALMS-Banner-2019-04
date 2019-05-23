<template>
  <div class="fill yo-layers bgcolor">
    <div class="bgdiv fill yo-layer">

    </div>
    <div class="fill yo-layer" ref="canvastarget">

    </div>
    <div class="yo-logo">
      <a href="http://palms.polyu.edu.hk" class="yo-fadein">
        <img src="./img/palms-logo.png" alt="PALMS Team"  ttile="PALMS Team">
      </a>
    </div>
  </div>
</template>

<script>
import * as WGL from './webgl.js'
export default {
  mounted () {
    WGL.init({ mounter: this.$refs['canvastarget'] })
  }
}
</script>

<style scoped>
.yo-layers{
  position: relative;
  overflow: hidden;
}
.yo-layer{
  position: absolute;
  top: 0px;
  left: 0px;
}
.yo-logo{
  position: absolute;
  bottom: 30px;
  right: 30px;
}
.yo-logo img{
  max-width: 160px;
}
@keyframes fadeIn {
  0%{
    opacity: 0;
    transform: scale(1.0);
  }
  30%{
    opacity: 1;
    transform: scale(1.0);
  }
  100%{
    opacity: 1;
    transform: scale(1.06);
  }
}
.bgcolor{
  background-color: black;
}
.bgdiv{
  /* background-image: url('./img/palms-bg.jpg'); */
  background-size: cover;
  background-position: center center;
  animation: fadeIn 10s ease-in-out 0.1s 1 normal both;
}
.yo-fadein{
  animation: fadeIn 10s ease-in-out 0.1s 1 normal both;
}
</style>
