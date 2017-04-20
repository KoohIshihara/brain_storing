var BranchTube = function(_points){
  // コンストラクタ
  /*
  var points = [];
  for (var i = 0; i < 4; i++) {
    var randomX = -20 + Math.round(Math.random() * 50);
    var randomY = -15 + Math.round(Math.random() * 40);
    var randomZ = -20 + Math.round(Math.random() * 40);
    points.push(new THREE.Vector3(randomX, randomY, randomZ));
  }
  */

  var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(_points), 64, 1, 8, false);
  var meshMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});
  var wireFrameMat = new THREE.MeshBasicMaterial();
  wireFrameMat.wireframe = true;
  this.mesh = THREE.SceneUtils.createMultiMaterialObject(tubeGeometry, [meshMaterial, wireFrameMat]);
}

BranchTube.prototype.getMesh = function(){
  return this.mesh;
}


function init() {

  var stats = initStats();

  var scene = new THREE.Scene();

  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  var webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMap.enabled = true;

  camera.position.z = 50;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

  points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 20, 0));

  var instance = new BranchTube(points);
  scene.add(instance.getMesh());

  render();

  function render() {
    stats.update();

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