let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  container,
  rocket,
  rocket_fire,
  HEIGHT,
  WIDTH;

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  //scene.fog = new THREE.Fog(0x03032b, 10, 1500);

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 0;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  container = document.getElementById("canvas");
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", handleWindowResize, false);

  // Create rocket group

  const rocket_topc = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 6, 4, 64),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  scene.add(rocket_topc);
  rocket_topc.position.y = 60;

  const rocket_topa = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 12, 8, 64),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  scene.add(rocket_topa);
  rocket_topa.position.y = 54;

  const rocket_topb = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 18, 20, 64),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  scene.add(rocket_topb);
  rocket_topb.position.y = 40;

  const rocket_mida = new THREE.Mesh(
    new THREE.CylinderGeometry(18, 20, 20, 64),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  scene.add(rocket_mida);
  rocket_mida.position.y = 20;

  const rocket_midb = new THREE.Mesh(
    new THREE.CylinderGeometry(20, 18, 20, 64),
    new THREE.MeshStandardMaterial(
      { color: 0xffffff },
      (metallness = 1),
      (roughness = 0)
    )
  );
  scene.add(rocket_midb);

  const rocket_bota = new THREE.Mesh(
    new THREE.CylinderGeometry(18, 14, 10, 64),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  scene.add(rocket_bota);
  rocket_bota.position.y = -15;

  const rocket_botb = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 12, 6, 64),
    new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.5,
      metalness: 1,
      side: THREE.DoubleSide
    })
  );
  scene.add(rocket_botb);
  rocket_botb.position.y = -20;

  const rocket_botc = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 8, 4, 64),
    new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0,
      metalness: 1,
      side: THREE.DoubleSide
    })
  );
  scene.add(rocket_botc);
  rocket_botc.position.y = -22;

  const rocket_wina = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 12, 23, 64),
    new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.5,
      metalness: 1,
      side: THREE.DoubleSide
    })
  );
  scene.add(rocket_wina);
  rocket_wina.position.set(0, 20, 10);
  rocket_wina.rotation.set(Math.PI / 2, 0, 0);

  const rocket_winb = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 9, 24, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0077ff,
      roughness: 0.6,
      metalness: 1,
      side: THREE.DoubleSide
    })
  );
  scene.add(rocket_winb);
  rocket_winb.position.set(0, 20, 10);
  rocket_winb.rotation.set(Math.PI / 2, 0, 0);

  const rocket_fina = new THREE.Mesh(
    new THREE.BoxBufferGeometry(40, 8, 18),
    new THREE.MeshStandardMaterial({
      color: 0xff0000
    })
  );
  scene.add(rocket_fina);
  rocket_fina.position.set(16, -10, 0);
  rocket_fina.rotation.set(Math.PI / 2, 0.7 * Math.PI, 0);

  const rocket_finb = new THREE.Mesh(
    new THREE.BoxBufferGeometry(40, 8, 18),
    new THREE.MeshStandardMaterial({
      color: 0xff0000
    })
  );
  scene.add(rocket_finb);
  rocket_finb.position.set(-16, -10, 0);
  rocket_finb.rotation.set(-Math.PI / 2, 0.7 * Math.PI, 0);

  var flame_material = new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color("yellow")
      },
      color2: {
        value: new THREE.Color("red")
      }
    },
    vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
  `,
    wireframe: true
  });

  rocket_fire = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 0, 20, 64),
    flame_material
  );
  scene.add(rocket_fire);
  rocket_fire.position.y = -30;

  rocket = new THREE.Group();
  rocket.add(
    rocket_midb,
    rocket_mida,
    rocket_topa,
    rocket_topb,
    rocket_bota,
    rocket_botb,
    rocket_botc,
    rocket_topc,
    rocket_wina,
    rocket_winb,
    rocket_fina,
    rocket_finb,
    rocket_fire
  );
  rocket.position.y = 0;
  scene.add(rocket);
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

const createLights = () => {
  const ambientLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.25);

  const directionalLight = new THREE.DirectionalLight(0xffcb87, 1);
  directionalLight.position.set(-300, 300, 600);

  const pointLight = new THREE.PointLight(0xff4f4f, 2, 1000, 2);
  pointLight.position.set(-200, 100, 50);

  scene.add(ambientLight, directionalLight, pointLight);
};

const targetRocketPosition = 40;
const animationDuration = 2000;

const loop = () => {
  const t = (Date.now() % animationDuration) / animationDuration;

  renderer.render(scene, camera);

  const delta = targetRocketPosition * Math.sin(Math.PI * 2 * t);
  if (rocket) {
    rocket.rotation.y += 0.01;
    rocket.rotation.x += 0.01;
    rocket.rotation.z += 0.01;
    rocket.position.y = delta;
  }
  if (rocket_fire) {
    rocket_fire.scale.set(
      1 + delta / 100,
      1 + Math.abs(delta / 100),
      1 + delta / 100
    );
  }

  requestAnimationFrame(loop);
};

const main = () => {
  createScene();
  createLights();

  renderer.render(scene, camera);
  loop();
};

main();
