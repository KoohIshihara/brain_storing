// FractalPlaneクラス
var FractalPlane = function(_x, _y) {
  // コンストラクタ
  var planeGeometry = new THREE.PlaneGeometry(10, 0);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.x = _x;
  plane.position.y = _y;
  var baseVertix = [];
  for(var i=0; i<4; i++) {
    baseVertix[i] = {
      x: plane.geometry.vertices[i].x,
      y: plane.geometry.vertices[i].y,
      z: plane.geometry.vertices[i].z,
    }
  }

  this.nowHeight = 0;
  this.maxHeight = 40;
  this.baseVertix = baseVertix; // [0] [1] が上の辺
  this.mesh = plane;
}

FractalPlane.prototype.update = function() {
  if (this.nowHeight < this.maxHeight) {
    this.mesh.geometry.verticesNeedUpdate = true;
    this.nowHeight+=0.1;
    this.mesh.geometry.vertices[0].y = this.baseVertix[0].y + this.nowHeight;
    this.mesh.geometry.vertices[1].y = this.baseVertix[1].y + this.nowHeight;
    this.mesh.rotation.z += 0.1;
  }
}

FractalPlane.prototype.getMesh = function() {
  return this.mesh;
}


var scene;
var camera;
var renderer;

function init() {

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 180;
  camera.lookAt(scene.position);

  // create a render and set the size
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // show axes in the screen
  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  
  var instance = new FractalPlane(20,40);
  scene.add(instance.getMesh());

  //-GUIの設定--------------------------------
  var controls = new function () {
    
    this.scaleX = 1.0;

  };
  var gui = new dat.GUI();
  
  gui.add(controls, 'scaleX', 0, 3.0);
  
  //-------------------------------------

  // add the output of the renderer to the html element
  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  render();
  function render(){

    instance.update();

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  // render the scene
  renderer.render(scene, camera);

}
window.onload = init;


function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);





