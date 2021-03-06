var branches_array = [];

var scene;
var camera;
var trackballControls;
var webGLRenderer;

function init() {

  var clock = new THREE.Clock();

  var stats = initStats();

  scene = new THREE.Scene();

  //var axes = new THREE.AxisHelper(20);
  //scene.add(axes);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0x000000));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMap.enabled = true;

  camera.position.y = -10;
  camera.position.z = 10;
  camera.lookAt(new THREE.Vector3(nowLookPos.x, nowLookPos.y, nowLookPos.z));

  /*
  trackballControls = new THREE.TrackballControls(camera);
  trackballControls.rotateSpeed = 2.0;
  trackballControls.zoomSpeed = 2.0;
  trackballControls.panSpeed = 2.0;
  trackballControls.staticMoving = true;
  trackballControls.target.set(0,20,0);
  */

  var projector = new THREE.Projector();
  //document.addEventListener('mousedown', onDocumentMouseDown, false);
  //var canvas = document.getElementById('WebGL-output');
  //canvas.addEventListener('click', launchRay, false);

  document.addEventListener('mousedown', stepNext, false);

  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

  // branches_arrayはグローバルに宣言
  var pos = {x: 0, y: 0, z: 0};
  var points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  var euler = {x:0,y:0,z:0};

  var paramerter = {
    pos: pos,
    //url: 'http://www.huffingtonpost.jp/2017/06/14/conspiracy-law_n_17100976.html',
    text: 'Article Franken',
    points: points,
    branchNum: branches_array.length,
    preBranchNum: 0,
    depthLevel: 1,
    isFirst: true,
  };

  //var branch = new BranchTube(pos, points, branches_array.length, 0, true);
  var branch = new BranchTube(paramerter);
  branches_array.push(branch);
  scene.add(branch.getMesh());

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  loadBranches_array();

  render();

  function render() {

    stats.update();
    var delta = clock.getDelta();

    if(allowStep) zoomToPoint();

    for(var i=0; i<branches_array.length; i++){
      branches_array[i].update();
    }

    //trackballControls.update(delta);
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }

  /*
  function launchRay(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if(intersects.length > 0){
      var mesh = intersects[0].object;
      console.log(mesh);
      openModal(mesh.branchNum); // openModalはmodal.jsに記述
    }
  }
  */

  
  function launchRay(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if(intersects.length > 0){
      
      var mesh = intersects[0].object;
      var pos = branches_array[mesh.branchNum].nextPos;
      var points = [];
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(0, 0, 0));
      var branchNum = branches_array.length;
      var preBranchNum = mesh.branchNum;
      var depthLevel = branches_array[mesh.branchNum].depthLevel + 1;

      var paramerter = {
        pos: pos,
        points: points,
        branchNum: branchNum,
        preBranchNum: preBranchNum,
        rotationRad: 0,
        depthLevel: depthLevel,
        isFirst: false,
      };
      var branch = new BranchTube(paramerter);
      branches_array.push(branch);
      scene.add(branches_array[branchNum].getMesh());
      console.log(mesh);
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


/*
$('.wrap-modal').mouseover(function() {
  trackballControls.enabled = false;
});

$('.wrap-modal').mouseout(function() {
  trackballControls.enabled = true;
});
*/




