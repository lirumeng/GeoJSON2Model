let camera, scene, renderer;
let mesh;
let shapeGroup = new THREE.Group();
const defaultView = {
    cp: {
        x: -24.789708296982663,
        y: 450,
        z: 70.91742526787289,
    },
    ct: {
        x: -24.789708953442272,
        y: 0.14296975330672362,
        z: 70.91697539132453,
    },
}

const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');

const Projection = d3.geo.mercator();

function changeCoordinate(pointValue) {
    let x = pointValue[0] * 10 - 7920
    let y = pointValue[1] * 10 - 1618
    return [x, y]
}

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

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;

    scene = new THREE.Scene();

    // const texture = new THREE.TextureLoader().load('textures/crate.gif');

    // const geometry = new THREE.BoxGeometry(20, 20, 20);
    // const material = new THREE.MeshBasicMaterial({
    //     map: texture
    // });

    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.minDistance = 50;
    controls.maxDistance = defaultView.cp.y;
    controls.enableDamping = false;
    controls.enableKeys = false;
    controls.target = new THREE.Vector3(defaultView.ct.x, defaultView.ct.y, defaultView.ct.z);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.005;
    // mesh.rotation.y += 0.01;

    renderer.render(scene, camera);
}


function drawRegion(arr) {
    let shape = new THREE.Shape()
    let extrudeSettings = {
        depth: 6,
        bevelEnabled: true,
        bevelSegments: 0,
        steps: 2,
        bevelSize: 0,
        bevelThickness: 0
    };

    shape.moveTo(arr[0][0], arr[0][1])

    arr.forEach(item => {
        shape.lineTo(item[0], item[1]);
    });

    let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);

    let material1 = new THREE.MeshLambertMaterial({
        emissive: 0x172626,
        transparent: true,
        // opacity: 0
    })

    let material2 = new THREE.MeshLambertMaterial({
        emissive: 0xffffff,
        transparent: true,
        // opacity: 0.2
    })

    let materialArr = [material1, material2]

    let mesh = new THREE.Mesh(geometry, materialArr);

    return mesh
}

function drawBorder(arr) {
    const position = new THREE.Float32BufferAttribute(arr.map(item => [item[0], item[1], 0]).flat(), 3)
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', position)

    let lineMaterial = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
    });
    let line = new THREE.Line(geometry, lineMaterial);

    return line
}

function generateModel() {
    fetch('shanghai.json')
        .then((res) => res.json())
        .then((res) => {
            let jsonData = res && res.features || [];

            shapeGroup.name = '地图';
            shapeGroup.rotateX(Math.PI);

            jsonData.forEach((regin) => {
                let reginGroup = new THREE.Group()

                reginGroup.name = regin.properties.name
                regin.geometry.coordinates.forEach((geo) => {
                    let geoPointArr = geo[0].map((item) => {
                        // console.log(item, Projection(item), changeCoordinate(Projection(item)))
                        return changeCoordinate(Projection(item))
                    })

                    let regionMesh = drawRegion(geoPointArr)
                    let borderMesh = drawBorder(geoPointArr)

                    reginGroup.add(regionMesh)
                    reginGroup.add(borderMesh)
                })

                shapeGroup.add(reginGroup)
            })

            // shapeGroup.visible = true;
            scene.add(shapeGroup);

            console.log(shapeGroup)
            console.log(scene)
        })
}