/* global require */
/* eslint-disable  */
import * as THREE from 'three'
var TWEEN = require('@tweenjs/tween.js')

function makeBasics ({ mounter }) {
  var api = {};
  api.scene = new THREE.Scene();
  api.scene.background = new THREE.Color(0x000000);
  api.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  api.renderer = new THREE.WebGLRenderer({ transparent: true });
  api.renderer.setSize(window.innerWidth, window.innerHeight);
  api.renderer.setPixelRatio(2.0);
  mounter.appendChild(api.renderer.domElement);

  api.renderer.domElement.style.marginBottom = '-6px';
  api.camera.position.z = 50;

  window.addEventListener('resize', () => {
    api.renderer.setSize(window.innerWidth, window.innerHeight);
    api.camera.aspect = window.innerWidth / window.innerHeight;
    api.camera.updateProjectionMatrix();
  }, false)
  api.clock = new THREE.Clock;

  api.execStack = {};
  api.animate = function () {
    requestAnimationFrame( api.animate );
    TWEEN.update();
    for (var key in api.execStack) {
      api.execStack[key]({ delta: api.clock.getDelta() })
    }
    api.renderer.render(api.scene, api.camera);
  };

  api.objx = new THREE.Object3D()
  api.scene.add(api.objx)

  var tiltHandler = (event) => {
    api.objx.rotation.x = event.beta / -180 * 1.0
  }

  api.tilt = () => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", tiltHandler, false);
		}
  }

  api.tilt()

  return api
}

function makeTexture (src) {
  var image = new Image()
  var texture = new THREE.Texture();
  texture.image = image;
  image.onload = function() {
    texture.needsUpdate = true;
  };
  image.src = src
  return texture
}

function createBackground ({ scene, img }) {
  var geometry = new THREE.PlaneBufferGeometry(80, 45, 10, 10)
  let map = makeTexture(img)
  var material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, map })

  // var material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, map: new THREE.TextureLoader().load(img) });
  var drawable = new THREE.Mesh(geometry, material);
  scene.add(drawable);
  drawable.position.z = -10;
  drawable.scale.x = 3;
  drawable.scale.y = 3;
  drawable.scale.z = 3;

  drawable.material.opacity = 0;

  let anim = {
    opacity () {
      var varying = { x: 0 };
      var tween = new TWEEN.Tween(varying)
        .to({ x: 100 }, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          material.opacity = varying.x / 100
          // console.log(material.uniforms.opacity.value)
        })
      tween.start()
    },
    scale () {
      var varying = { x: 300 };
      var tween = new TWEEN.Tween(varying)
        .to({ x: 330 }, 10000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          drawable.scale.x = varying.x / 100
          drawable.scale.y = varying.x / 100
          drawable.scale.z = varying.x / 100
          // console.log(material.uniforms.scale.value)
        })
      tween.delay(2000).start()
    }
  }
  return {
    tween () {
      anim.opacity()
      anim.scale()
    },
    update: () => {

    }
  }
}

function createParticles ({ scene, img, pattern, pos }) {
  var geometry = new THREE.PlaneBufferGeometry( 80,  45, 200, 200 );
  // var geometry = new THREE.SphereBufferGeometry( 15, 200, 200 );
  var material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      progress: { value: 0 },
      time: { value: 0 },
      pointSize: { value: 1.75 * window.devicePixelRatio || 1.0 },
      image: { value: new THREE.TextureLoader().load(img) },
      pattern: { value: new THREE.TextureLoader().load(pattern) }
    },
    vertexShader: `
      #include <common>
      varying vec2 vUv;
      uniform sampler2D image;
      uniform float time;
      uniform float pointSize;
      uniform float progress;
      void main () {
        vUv = uv;

        vec3 newPos = position;
        newPos.z += sin(newPos.x * 0.333 + time * 10.0) * 0.7;
        newPos.z += sin(newPos.y * 0.333 + time * 10.0) * 0.7;

        newPos.z += rand(newPos.xy) * (1.0 - progress) * 30.0;

        vec4 mvPosition = modelViewMatrix * vec4( newPos , 1.0 );
        vec4 outputPos = projectionMatrix * mvPosition;

        gl_Position = outputPos;
        gl_PointSize = pointSize;
      }
    `,
    fragmentShader: `
      #include <common>
      varying vec2 vUv;
      uniform sampler2D image;
      uniform sampler2D pattern;
      uniform float time;
      uniform float progress;
      void main () {
        vec2 coord = gl_PointCoord.xy - vec2(0.5);
        if (length(coord) > 0.5) {
          discard;
        } else {
          vec4 logo = texture2D(image, vUv);
          vec2 swifting = vUv;

          swifting.x = swifting.x + time * 0.3;
          swifting.x = fract(swifting.x);
          // swifting.y = swifting.y + time * 0.3;
          // swifting.y = fract(swifting.y);

          vec4 pattern = texture2D(pattern, swifting);
          vec4 white = vec4(1.0);
          gl_FragColor = vec4(vec3((1.0 - logo) * white), logo.a * progress);
        }

      }
    `
  });

  var drawable = new THREE.Points(geometry, material);
  drawable.position.set(pos.x, pos.y, pos.z);
  scene.add( drawable );

  let sizer = () => {
    let aspect = window.innerWidth / window.innerHeight
    if (aspect >= 1.0) {
      aspect = 1.0
    }
    drawable.scale.x = 1.0 * 0.8 * aspect;
    drawable.scale.y = 1.0 * 0.8 * aspect;
    drawable.scale.z = 1.0 * 0.8 * aspect;
  }
  sizer()
  window.addEventListener('resize', sizer, false)

  return {
    animate () {
      material.uniforms.time.value = window.performance.now() * 0.001;

      // cube.rotation.x += 0.1;
      // cube.rotation.y += 0.1;
    },
    tween () {
      var varying = { x: 0 };
      var tween = new TWEEN.Tween(varying)
        .to({ x: 100 }, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          material.uniforms.progress.value = varying.x / 100
          // console.log(material.uniforms.progress.value)
        })
      tween.start()

    }
  }
}

export function init({ mounter }) {
  var logo = require('./img/palms-word.png')
  var pattern = require('./img/palms-blue.jpg')
  var red = require('./img/palms-red.jpg')

  var basic = makeBasics({ mounter });
  var awesomeness = createParticles({
    scene: basic.objx,
    pos: { x: 0, y: 0, z: 0 },
    img: logo,
    pattern: pattern
  });
  var bg = createBackground({
    scene: basic.objx,
    img: red
  })

  basic.execStack.awesomeness = awesomeness.animate;
  basic.execStack.bgFadeIn = bg.update;
  basic.animate();
  awesomeness.tween();
  setTimeout(() => {
    bg.tween();
  }, 1000);

  // $('body').click(() => {
  //   awesomeness.tween();
  // })
}
