import {
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  MathUtils,
  TextureLoader,
} from 'three';
import { damp } from 'maath/easing';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



export default class Tiles extends Group {
  constructor() {
    super();

    this._isDragging = false;
    this._width = 60;  
    this._height = 40; 
    this._els = [];
    this._imageUrls = [
      'assets/Pizza-Rucola-Prosciutto.jpeg',
      'assets/Egg-Muffins.jpg',
      'assets/Carrot-Muffins.jpg',
      'assets/eggs-breakfast.jpg',
      'assets/Omelette.jpg',
      'assets/Pizza-breakfast.jpg',
    ];
    this._loader = new TextureLoader();

    this._init();
  }

  _init() {
    
    const geometry = new CircleGeometry(1, 32);  

    for (let i = 0; i < 6; i++) {
      const texture = this._loader.load(this._imageUrls[i % this._imageUrls.length]);
      const material = new MeshBasicMaterial({ map: texture });

      const mesh = new Mesh(geometry, material);
     
      const increasedWidth = 150;   
      const increasedHeight = 100; 
      mesh.scale.set(increasedWidth, increasedHeight, 1);

      
      mesh.position.x = MathUtils.randFloat(-30, 30);
      mesh.position.y = increasedWidth * i * 1.5 + MathUtils.randFloat(60, 80); 
      mesh.position.z = MathUtils.randFloat(-20, 20);
      mesh.userData.destinationPosition = mesh.position.clone();
      mesh.userData.initialPosition = mesh.position.clone();
      mesh.userData.dragPosition = mesh.position.clone();
      mesh.userData.dragPosition.y += MathUtils.randFloat(-30, -70);

      this.add(mesh);
      this._els.push(mesh);
    }
}
_initScene() {
  const tiles = new Tiles();
  this._tiles = tiles;
  this._scene.add(tiles);

  
  const loader = new GLTFLoader();
  loader.load(
    'mashine.glb',  
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0.5, 0.5, 0.5);  
      model.scale.set(10, 10, 10);  
      this._scene.add(model);
    },
    undefined,
    (error) => {
      console.error('An error happened while loading the model:', error);
    }
  );
}




  onDrag(e, delta) {
    this._isDragging = e.dragging;
    this._els.forEach((el) => {
      el.userData.destinationPosition.y += delta; 
    });
  }

  update(delta) {
    this._els.forEach((el) => {
      damp(el.position, 'y', el.userData.destinationPosition.y, 0.05, delta);

      const zTarget = this._isDragging
        ? el.userData.dragPosition.x
        : el.userData.initialPosition.z;

      damp(el.position, 'z', zTarget, 0.15, delta);
    });
  }
}
