

import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
import CasualFlapMapImageUrl from "./floor.png";


let camera, scene, renderer, controls;
let controller;
let occluderMaterial;
let navigationArea;

init();
setupGeometry();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setAnimationLoop(render);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    ambient.position.set(0.5, 1, 0.25);
    scene.add(ambient);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    document.body.appendChild(ARButton.createButton(renderer));

    controller = renderer.xr.getController(0);
   
    scene.add(controller);

    // check for supported features
    // navigator.xr.isSessionSupported()
}

function render(time) {
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function setupGeometry() {
    // create occluder material
    occluderMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    

    //occluderMaterial.colorWrite = false;

    // create room map
    navigationArea = new THREE.Group();
    navigationArea.add(createWallElement(new THREE.Vector3( 4.8, 0.5, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 5, 30)));
    navigationArea.add(createWallElement(new THREE.Vector3( -4.8, 0.5, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 5, 30)));
    navigationArea.add(createWallElement(new THREE.Vector3(0, -0.5, 0.25), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.1, 26)));
    
    // set starting point to start-room center
    navigationArea.position.set(0, 0, -15);
    

    // create floor

    const floorGeometry = new THREE.PlaneGeometry(10.2, 30);
    const floorTexture = new THREE.TextureLoader().load(CasualFlapMapImageUrl);
    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
    const floorPlaneMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorPlaneMesh.rotateX(THREE.MathUtils.degToRad(270));

    floorPlaneMesh.position.set(0, -2, 0);
    floorPlaneMesh.renderOrder = 3;
    navigationArea.add(floorPlaneMesh);

    scene.add(navigationArea);

    const geometry = new THREE.SphereGeometry( 0.3 );
    const material = new THREE.MeshBasicMaterial( { color: 'skyblue' } );
    const sphere = new THREE.Mesh( geometry, material );

    sphere.position.x = 0;
    sphere.position.y = -0.5;
    sphere.position.z = -1.5;
    scene.add( sphere );

    const geometry1 = new THREE.SphereGeometry( 0.3 );
    const material1 = new THREE.MeshBasicMaterial( { color: 'orange' } );
    const sphere1 = new THREE.Mesh( geometry1, material1 );

    sphere1.position.x = 0;
    sphere1.position.y = -0.5;
    sphere1.position.z = -27.5;
    scene.add( sphere1 );

    
    const loader = new FontLoader();

    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	const geometry = new TextGeometry( 'Hello', {
		font: font,
		size: 1,
		height: 1,
        
		
	} );
    geometry.position.x=0;
    geometry.position.y=1;
    geometry.position.z=1;
    

    });

   

   

}

function createWallElement(position, rotation, scale) {
    const occluderGeometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
    const occluderMesh = new THREE.Mesh(occluderGeometry, occluderMaterial);
    occluderMesh.position.set(position.x, position.y, position.z);
    occluderMesh.renderOrder = 2;


    return occluderMesh;
}




