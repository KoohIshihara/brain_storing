// FractalPlaneクラス
var FractalPlane = function(_x, _y) {
  // コンストラクタ
  var planeGeometry = new THREE.PlaneGeometry(10, 40);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
  planeMaterial.side = THREE.DoubleSide; // 背面の処理増加するよ。
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
  this.mesh.position.y = 20;
  this.mesh.rotation.z = Math.PI/4;
  this.nextPos = {x: 0, y: 0};

  /*
  var testGeo = new THREE.PlaneGeometry(4, 4);
  var testMat = new THREE.MeshBasicMaterial({color: 0xcc0000});
  this.testMesh = new THREE.Mesh(testGeo, testMat);
  scene.add(this.testMesh);
  */
}

FractalPlane.prototype.update = function() {
  if (this.nowHeight < this.maxHeight) {
    this.mesh.geometry.verticesNeedUpdate = true;
    this.nowHeight+=0.1;
    this.mesh.geometry.vertices[0].y = this.baseVertix[0].y + this.nowHeight;
    this.mesh.geometry.vertices[1].y = this.baseVertix[1].y + this.nowHeight;
    this.nextPos.x = this.mesh.position.x - this.nowHeight*Math.sin(this.mesh.rotation.z);
    this.nextPos.y = this.mesh.position.y + this.nowHeight*Math.cos(this.mesh.rotation.z);
  }
  /*
  this.testMesh.position.x = this.nextPos.x;
  this.testMesh.position.y = this.nextPos.y;
  */
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

  var projector = new THREE.Projector();
  document.addEventListener('mousedown', onDocumentMouseDown, false);

  var raycaster;

  // show axes in the screen
  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  
  var instance = new FractalPlane(0,0);
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

  function onDocumentMouseDown(event) {
    
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);

    raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects([instance.getMesh()]);

    if (intersects.length > 0) {
      console.log(intersects[0]);
    }else{
      console.log('none');
    }
    
  }

}
window.onload = init;


function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);





