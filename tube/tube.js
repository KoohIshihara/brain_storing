var branches_array = [];


var scene;
var camera;
var webGLRenderer;

function init() {

  var clock = new THREE.Clock();

  var stats = initStats();

  scene = new THREE.Scene();

  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0xFFFFFF));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMap.enabled = true;

  camera.position.z = 200;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var trackballControls = new THREE.TrackballControls(camera);
  trackballControls.rotateSpeed = 2.0;
  trackballControls.zoomSpeed = 2.0;
  trackballControls.panSpeed = 2.0;
  trackballControls.staticMoving = true;
  trackballControls.target.set(0,20,0);


  var projector = new THREE.Projector();
  document.addEventListener('mousedown', onDocumentMouseDown, false);

  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

  // branches_arrayはグローバルに宣言
  var pos = {x: 0, y: 0, z: 0};
  var points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  var euler = {x:0,y:0,z:0};
  var branch = new BranchTube(pos, points, branches_array.length, 0, true);
  branches_array.push(branch);
  scene.add(branch.getMesh());

  render();

  function render() {
    stats.update();
    var delta = clock.getDelta();

    for(var i=0; i<branches_array.length; i++){
      branches_array[i].update();
    }

    trackballControls.update(delta);
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
      var preBranchNum = mesh.branchNum;
      var branch = new BranchTube(pos, points, branchNum, preBranchNum, false);
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


