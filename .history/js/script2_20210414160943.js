let camera, scene, renderer;
let mesh;

init();
animate();

const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');

downloadBtn.onclick = function() {
    const content = JSON.stringify(shapeGroup);

    var eleLink = document.createElement('a');
    eleLink.download = 'model.json';
    eleLink.style.display = 'none';

    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);

    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}
generateBtn.onclick = function() {
    generateModel();
}

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    scene = new THREE.Scene();

    const texture = new THREE.TextureLoader().load('textures/crate.gif');

    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshBasicMaterial({
        map: texture
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);
}