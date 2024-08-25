import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as TWEEN from "three/addons/libs/tween.module.js";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";

let simplex = new SimplexNoise();
let tileDim = 400; // Expanded terrain size

class TextTerrain extends THREE.Object3D {
  constructor(anisotropy) {
    super();
    // atlas
    let alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"];
    let textTexture = (() => {
      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      let texSize = 2048;
      c.width = texSize;
      c.height = texSize;
      ctx.clearRect(0, 0, texSize, texSize);
      let dim = 8;
      let dimStep = texSize / dim;
      for (let i = 0; i < alphabet.length; i++) {
        let tileX = i % 8;
        let tileY = Math.floor(i / 8);
        let x = (tileX + 0.5) * dimStep;
        let y = texSize - (tileY + 0.5) * dimStep;
        ctx.fillStyle = `rgba(0, 255, 0, 1)`; // Bright green color
        ctx.shadowColor = `rgba(0, 255, 0, 0.7)`; // Neon green shadow
        ctx.shadowBlur = 10; // Adjust for glow effect
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold ${dimStep * 0.9}px "Courier New"`;
        ctx.fillText(alphabet[i], x, y);
      }
      let tex = new THREE.CanvasTexture(c);
      tex.colorSpace = "srgb";
      tex.anisotropy = anisotropy;
      return tex;
    })();

    let g = new THREE.PlaneGeometry();
    g.setAttribute(
      "letterIdx",
      new THREE.InstancedBufferAttribute(
        new Float32Array(
          Array.from(
            {
              length: tileDim * tileDim
            },
            () => {
              return THREE.MathUtils.randInt(0, alphabet.length - 1);
            }
          )
        ),
        1
      )
    );

    let m = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      alphaTest: 0.01,
      side: THREE.DoubleSide,
      onBeforeCompile: (shader) => {
        shader.vertexShader = `
                  attribute float letterIdx;
                  varying float vLetterIdx;
                  ${shader.vertexShader}
                `.replace(
          `#include <uv_vertex>`,
          `#include <uv_vertex>
                  vLetterIdx = letterIdx;
                  `
        );

        shader.fragmentShader = `
                  varying float vLetterIdx;
                  ${shader.fragmentShader}
                `.replace(
          `#include <map_fragment>`,
          `
                  float letterIdx = floor(vLetterIdx + 0.1);
                  float tileStep = 1. / 8.;
                  float u = mod(letterIdx, 8.);
                  float v = floor(letterIdx / 8.);
                  vec2 iUv = (vec2(u, v) + vMapUv) * tileStep;
                  vec4 sampledDiffuseColor = texture2D( map, iUv );
                  diffuseColor *= sampledDiffuseColor;
                  `
        );
      }
    });
    let io = new THREE.InstancedMesh(g, m, tileDim * tileDim);
    this.instancedMesh = io;

    this.dummy = new THREE.Object3D();

    this.finals = [];

    let tri = new THREE.Triangle();
    let n = new THREE.Vector3();
    let la = new THREE.Vector3();

    function getY(x, z) {
      return simplex.noise(x * 0.01, z * 0.01) * 7.5;
    }

    let setFinals = () => {
      let y0 = getY(this.dummy.position.x, this.dummy.position.z);
      let y1 = getY(this.dummy.position.x, this.dummy.position.z - 1);
      let y2 = getY(this.dummy.position.x + 1, this.dummy.position.z);
      this.dummy.position.y = y0;

      tri.a.set(this.dummy.position.x, y1, this.dummy.position.z - 1);
      tri.b.set(this.dummy.position.x, y0, this.dummy.position.z);
      tri.c.set(this.dummy.position.x + 1, y2, this.dummy.position.z);
      tri.getNormal(n);

      la.copy(this.dummy.position).add(n);
      this.dummy.lookAt(la);
      this.dummy.rotation.z = 0; // align along Z-axis of the terrain
      this.dummy.updateMatrix();

      this.finals.push({
        y: y0,
        pos: this.dummy.position.clone(),
        rot: this.dummy.rotation.clone(),
        dummy: new THREE.Object3D(),
        inAction: false,
        mediators: {
          v: new THREE.Vector3(),
          v2: new THREE.Vector3()
        }
      });
    };

    // make it grid
    for (let z = 0; z < tileDim; z++) {
      for (let x = 0; x < tileDim; x++) {
        this.dummy.position.x = -(tileDim - 1) * 0.5 + x;
        this.dummy.position.z = -(tileDim - 1) * 0.5 + z;
        setFinals(this.dummy.position);
        this.instancedMesh.setMatrixAt(z * tileDim + x, this.dummy.matrix);
      }
    } // make it grid

    this.add(io);

    // actions section
    this.actions = Array.from(
      {
        length: 5000
      },
      () => {
        let action = (delay) => {
          let getFreeLetterIndex = () => {
            let letterIndex = Math.floor(Math.random() * this.finals.length);
            if (!this.finals[letterIndex].inAction) {
              return letterIndex;
            } else {
              return getFreeLetterIndex();
            }
          };

          let freeLetterIndex = getFreeLetterIndex();
          let freeLetter = this.finals[freeLetterIndex];
          let height = 50; // Adjusted height value for higher starting position
          let m = freeLetter.mediators;
          let v = m.v;
          let v2 = m.v2;

          v2.random()
            .multiplyScalar(0.5)
            .addScalar(0.5)
            .multiplyScalar(Math.PI * 3 * Math.sign(Math.random() - 0.5));

          let tween = new TWEEN.Tween({
            val: 0
          })
            .to(
              {
                val: 1
              },
              10000
            )
            .delay(delay)
            .onStart(() => {
              freeLetter.inAction = true;
            })
            .onUpdate((val) => {
              v.lerpVectors(v2, freeLetter.rot, val.val);
              freeLetter.dummy.rotation.set(v.x, v.y, v.z);
              freeLetter.dummy.position.copy(freeLetter.pos);
              freeLetter.dummy.position.y = THREE.MathUtils.lerp(
                height,
                freeLetter.y,
                val.val
              );
              freeLetter.dummy.updateMatrix();
              io.setMatrixAt(freeLetterIndex, freeLetter.dummy.matrix);
            })
            .onComplete(() => {
              freeLetter.inAction = false;
              action(Math.random() * 10000);
            });
          tween.start();
        };
        return action;
      }
    );
    // actions section
  }
}

let scene = new THREE.Scene();
scene.background = new THREE.Color("#000000"); // Set background to black
scene.fog = new THREE.Fog("#000000", 100, 500); // Expanded fog range for larger terrain
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 3, 8).setLength(80); // Increased camera distance for larger terrain
let renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let textTerrain = new TextTerrain(renderer.capabilities.getMaxAnisotropy());
scene.add(textTerrain);
textTerrain.actions.forEach((action) => {
  action((Math.random() * 0.9 + 0.1) * 10000);
}); // actions section

// Add ambient light
let ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft ambient light
scene.add(ambientLight);

// Add directional light
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Add particle system for dynamic lights
let particleCount = 200;
let particleGeometry = new THREE.BufferGeometry();
let particleMaterial = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 0.5,
  transparent: true,
  opacity: 0.8
});

let positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = Math.random() * tileDim - tileDim / 2; // x
  positions[i + 1] = Math.random() * 10 + 5; // y (elevated)
  positions[i + 2] = Math.random() * tileDim - tileDim / 2; // z
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

let particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Pulse effect on particles
let pulseSpeed = 0.005;
function pulseParticles() {
  let time = performance.now() * pulseSpeed;
  particleMaterial.size = 0.5 + Math.sin(time) * 0.1; // Adjust the size for a pulsing effect
}

// Add grid overlay
// let gridHelper = new THREE.GridHelper(tileDim, tileDim, 0x00ff00, 0x00ff00);
// gridHelper.position.y = 0.01; // Slightly above the terrain
// gridHelper.material.opacity = 0.2;
//gridHelper.material.transparent = true;
 //scene.add(gridHelper);

// Dynamic camera movement
let cameraPathRadius = 100;
let cameraSpeed = 0.1;
let cameraSpeedMultiplier = 0.0001; // Initial speed multiplier

function moveCamera() {
  let time = performance.now() * cameraSpeedMultiplier;
  camera.position.x = Math.cos(time) * cameraPathRadius;
  camera.position.z = Math.sin(time) * cameraPathRadius;
  camera.lookAt(0, 0, 0);
}

// Adjust speed dynamically based on events or conditions
function adjustCameraSpeed(newSpeed) {
  cameraSpeedMultiplier = newSpeed;
}

let listener = new THREE.AudioListener();
camera.add(listener);
let sound = new THREE.Audio(listener);

let audioLoader = new THREE.AudioLoader();
audioLoader.load("path/to/sound.mp3", (buffer) => {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

document.addEventListener("mousemove", (event) => {
  let x = (event.clientX / window.innerWidth) * 2 - 1;
  let y = -(event.clientY / window.innerHeight) * 2 + 1;
  camera.position.x += x * 0.1;
  camera.position.y += y * 0.1;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    cameraSpeedMultiplier += 0.0001; // Increase speed
  }
  if (event.key === "ArrowDown") {
    cameraSpeedMultiplier -= 0.0001; // Decrease speed
  }
});


// Clock for animation loop
let clock = new THREE.Clock();
let t = 0;

renderer.setAnimationLoop(() => {
  let dt = clock.getDelta();
  t += dt;
  TWEEN.update();
  controls.update();
  textTerrain.instancedMesh.instanceMatrix.needsUpdate = true;
  pulseParticles();
  moveCamera();
  renderer.render(scene, camera);
});