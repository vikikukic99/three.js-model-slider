import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  MathUtils,
  TextureLoader,
} from 'three';
import { damp } from 'maath/easing';

export default class Tiles extends Group {
  constructor() {
    super();

    this._isDragging = false;
    this._width = 60;
    this._els = [];
    this._imageUrls = [
      'assets/Slika1.png',
      // Include additional image paths if needed
    ];
    this._loader = new TextureLoader();

    this._init();
  }

  _init() {
    const geometry = new PlaneGeometry(1, 1);

    for (let i = 0; i < 5; i++) {
      const texture = this._loader.load(
        this._imageUrls[i % this._imageUrls.length]
      );
      const material = new MeshBasicMaterial({ map: texture });

      const mesh = new Mesh(geometry, material);
      mesh.scale.set(100, 100, 1);

      // Adjusted vertical arrangement
      mesh.position.x = MathUtils.randFloat(-30, 30);
      mesh.position.y = this._width * i * 1.9 + MathUtils.randFloat(60, 80);
      mesh.position.z = MathUtils.randFloat(-20, 20);
      mesh.userData.destinationPosition = mesh.position.clone();
      mesh.userData.initialPosition = mesh.position.clone();
      mesh.userData.dragPosition = mesh.position.clone();
      mesh.userData.dragPosition.y += MathUtils.randFloat(-30, -70);

      this.add(mesh);
      this._els.push(mesh);
    }
  }

  onDrag(e, delta) {
    this._isDragging = e.dragging;
    this._els.forEach((el) => {
      el.userData.destinationPosition.y += delta; // Increased drag effect
    });
  }

  update(delta) {
    this._els.forEach((el) => {
      // Reduced damping coefficient for faster response
      damp(el.position, 'y', el.userData.destinationPosition.y, 0.05, delta);

      // Z position damping remains the same
      const zTarget = this._isDragging
        ? el.userData.dragPosition.x
        : el.userData.initialPosition.z;

      damp(el.position, 'z', zTarget, 0.15, delta);
    });
  }
}
