import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})

export class ModelComponent implements OnInit, AfterViewInit {
  
  @ViewChild('canvas') private canvasRef: ElementRef;


  //* Stage Properties

  @Input() public fieldOfView: number = 75;

  @Input('nearClipping') public nearClippingPane: number = 50;

  @Input('farClipping') public farClippingPane: number = 10000;

  //? Scene properties
  private camera: THREE.PerspectiveCamera;

  private controls: OrbitControls;

  private ambientLight: THREE.AmbientLight;

  private light1: THREE.PointLight;

  private light2: THREE.PointLight;

  private light3: THREE.PointLight;

  private light4: THREE.PointLight;

  private model: any;

  private directionalLight: THREE.DirectionalLight;

  //? Helper Properties (Private Properties);

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loaderGLTF = new GLTFLoader();
  // private dracoLoader  = new DRACOLoader();
  
  

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  /**
   *Animate the model
   *
   * @private
   * @memberof ModelComponent
   */
  private animateModel() {
    if (this.model) {
      this.model.rotation.z += 0.005;
    }
  }

  /**
   *create controls
   *
   * @private
   * @memberof ModelComponent
   */
  private createControls = () => {
    
    const renderer = new CSS2DRenderer();
    console.log(this.canvasRef.nativeElement.offsetWidth);
    console.log(this.canvasRef.nativeElement.offsetHeight);
    renderer.setSize(this.canvasRef.nativeElement.offsetWidth, this.canvasRef.nativeElement.offsetHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    document.body.appendChild(renderer.domElement);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.autoRotate = false;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.update();
  };

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */
  private createScene() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/examples/js/libs/draco/");
    dracoLoader.setDecoderConfig({type: 'js'}); 
    this.loaderGLTF.setDRACOLoader( dracoLoader );

    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff)
    this.loaderGLTF.load('assets/robot/scene.gltf', (gltf: GLTF) => {
      this.model = gltf.scene.children[0];
      console.log(this.model);
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      this.scene.add(this.model);
    },function ( xhr ) {

      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      console.log("QLOOOO");
  
    });
    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    )
    
    this.camera.position.x = 50;
    this.camera.position.y = 10;
    this.camera.position.z = 500;
    let hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
    this.scene.add(hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(0, 1, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
    this.light1 = new THREE.PointLight(0xffffff, 20);
    this.light1.position.set(0, 200, 400);
    this.scene.add(this.light1);
    this.light2 = new THREE.PointLight(0xffffff, 20);
    this.light2.position.set(500, 100, 0);
    // this.scene.add(this.light2);
    // this.light3 = new THREE.PointLight(0xffffff, 20);
    // this.light3.position.set(0, 100, -500);
    // this.scene.add(this.light3);
    // this.light4 = new THREE.PointLight(0xffffff, 30);
    // this.light4.position.set(-500, 300, 500);
    // this.scene.add(this.light4);
  }

  private getAspectRatio() {
    /* console.log(this.canvasRef.nativeElement.offsetWidth);
    console.log(this.canvasRef.nativeElement.offsetHeight); */

    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
 * Start the rendering loop
 *
 * @private
 * @memberof CubeComponent
 */
  private startRenderingLoop() {
      //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    let component: ModelComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();
  }


}
