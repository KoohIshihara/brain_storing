var BranchTube = function(_pos, _points, _branchNum){
  console.log(_pos);
  // コンストラクタ
  this.points = _points;
  this.branchNum = _branchNum;
  this.radius = 0.0;
  this.maxHeight = 20;
  //(points, segments, radius, radiusSegments, closed, taper)
  var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(_points), 64, 1, 8, false);
  var material = new THREE.MeshBasicMaterial();
  material.wireframe = true;
  this.mesh = new THREE.Mesh(tubeGeometry, material);
  this.mesh.position.x = _pos.x;
  this.mesh.position.y = _pos.y;
  this.mesh.branchNum = _branchNum;

  var testRadius = 
  this.mesh.rotation.z = Math.PI/4;
  this.nextPos = {x: 0, y: 0};
}

BranchTube.prototype.getMesh = function(){
  return this.mesh;
}

BranchTube.prototype.update = function(){
  if (this.points[1].y < this.maxHeight) {
    this.points[1].y += 0.1;
    this.radius += 0.002; // これifの処理わけてもいいかもね
    this.mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(this.points), 64, this.radius, 8, false);
    this.nextPos.x = this.mesh.position.x - this.points[1].y*Math.sin(this.mesh.rotation.z);
    this.nextPos.y = this.mesh.position.y + this.points[1].y*Math.cos(this.mesh.rotation.z);
  }
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

  camera.position.z = 300;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var projector = new THREE.Projector();
  document.addEventListener('mousedown', onDocumentMouseDown, false);

  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

  var branches_array = [];
  var pos = {x: 0, y: 0};
  var points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  var branch = new BranchTube(pos, points, branches_array.length);
  branches_array.push(branch);
  scene.add(branch.getMesh());

  render();

  function render() {
    stats.update();

    //branch.update();

    for(var i=0; i<branches_array.length; i++){
      branches_array[i].update();
    }

    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }

  function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    
    var objects_array = [];
    for(var i=0; i < branches_array.length; i++) {
      objects_array.push(branches_array[i].getMesh());
    }
    var intersects = raycaster.intersectObjects(objects_array);

    if (intersects.length > 0) {
      var mesh = intersects[0].object;
      var pos = branches_array[mesh.branchNum].nextPos;
      var points = [];
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(0, 0, 0));
      var branchNum = branches_array.length;
      console.log(pos);
      var branch = new BranchTube(pos, points, branchNum);
      branches_array.push(branch);
      scene.add(branches_array[branchNum].getMesh());
    }else{
      console.log('none');
    }
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


