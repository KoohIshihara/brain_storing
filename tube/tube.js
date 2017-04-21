var BranchTube = function(_points){
  // コンストラクタ
  this.points = _points;
  this.radius = 0.0;
  //(points, segments, radius, radiusSegments, closed, taper)
  var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(_points), 64, 1, 8, false);
  var material = new THREE.MeshBasicMaterial();
  material.wireframe = true;
  this.mesh = new THREE.Mesh(tubeGeometry, material);
}

BranchTube.prototype.getMesh = function(){
  return this.mesh;
}

BranchTube.prototype.update = function(){
  this.points[1].y += 0.1;
  this.radius += 0.004;
  this.mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(this.points), 64, this.radius, 8, false);
  this.mesh.rotation.y += 0.001;
  this.mesh.rotation.z += 0.001;
}

var scene;
var camera;
var webGLRenderer;

function init() {

  var stats = initStats();

  scene = new THREE.Scene();

  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0x777777));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMap.enabled = true;

  camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

  points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));

  var instance = new BranchTube(points);
  scene.add(instance.getMesh());
  console.log(instance.getMesh());

  render();

  function render() {
    stats.update();

    instance.update();

    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }

  function initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(stats.domElement);

    return stats;
  }
}
window.onload = init;


function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);


