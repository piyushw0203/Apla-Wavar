// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import io from 'socket.io-client';


// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
document.getElementById('game-container').appendChild(renderer.domElement);

// Load buildings using GLTFLoader
const loader = new GLTFLoader();
const buildings = []; // Array to store building meshes

// Load building models and add them to the scene
async function loadBuildings() {
    try {
        const gltf = await loader.loadAsync('untitled.glb');
        const buildingMesh = gltf.scene.children[0];
        buildingMesh.position.set(0, 0, -10); // Set building position
        buildingMesh.userData.propertyId = 1; // Assign a unique ID to each building
        buildings.push(buildingMesh);
        scene.add(buildingMesh);
    } catch (error) {
        console.error('An error occurred while loading the building model:', error);
    }
    // Add more buildings as needed
}

loadBuildings();

// Functions for property interactions
function redirectToMarketplace() {
    const propertyId = document.getElementById('property-id').textContent;
    window.location.href = `https://example.com/marketplace?property=${propertyId}`;
}

function buyProperty() {
    const propertyId = document.getElementById('property-id').textContent;
    console.log(`Player wants to buy property with ID: ${propertyId}`);
}

function sellProperty() {
    const propertyId = document.getElementById('property-id').textContent;
    console.log(`Player wants to sell property with ID: ${propertyId}`);
}

// Player movement
const player = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
player.position.set(0, 1, 0);
scene.add(player);

window.redirectToMarketplace = redirectToMarketplace;
window.buyProperty = buyProperty;
window.sellProperty = sellProperty;

// Socket.io setup (client side)
const socket = io('http://localhost:3000'); // Replace with your server's URL
socket.on('connect', () => {
    console.log('Connected to server');
    socket.on('playerMove', handlePlayerMovement);
});

// Handle player movement
function handlePlayerMovement(data) {
    // Update other players' positions
    // Update the positions of their avatars in the scene
    if (data.id !== socket.id) {
        const otherPlayer = scene.getObjectByName(data.id);
        if (otherPlayer) {
            otherPlayer.position.copy(data.position);
        }
    }
}

// Keydown event listener for player's movement
window.addEventListener('keydown', (event) => {
    const moveDistance = 0.1;
    const newPosition = player.position.clone();

    switch (event.key) {
        case 'ArrowUp':
            newPosition.z -= moveDistance;
            break;
        case 'ArrowDown':
            newPosition.z += moveDistance;
            break;
        case 'ArrowLeft':
            newPosition.x -= moveDistance;
            break;
        case 'ArrowRight':
            newPosition.x += moveDistance;
            break;
    }

    // Send updated position to the server
    socket.emit('playerMove', { id: socket.id, position: newPosition });

    // Update player position locally
    player.position.copy(newPosition);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Responsive Design
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function render() {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
