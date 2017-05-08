var BranchTube = function(_pos, _points, _euler, _branchNum){
  // コンストラクタ
  this.points = _points;
  this.branchNum = _branchNum;
  this.radius = 0.0;
  

  //this.maxHeight = 14;
  var text = prompt("Type Texts");
  this.maxHeight = text.length;


  //(points, segments, radius, radiusSegments, closed, taper)
  var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(_points), 32, 1, 8, false);
  var material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color( 0x999999 );
  material.wireframe = true;
  material.wireframeLinewidth = 0.1;
  this.mesh = new THREE.Mesh(tubeGeometry, material);
  this.mesh.position.x = _pos.x;
  this.mesh.position.y = _pos.y;
  this.mesh.position.z = _pos.z;
  //this.mesh.rotation.x = _euler.x;
  //this.mesh.rotation.z = _euler.z;
  this.mesh.branchNum = _branchNum;

  //console.log(_euler.x);
  //console.log(_euler.z);
  //console.log(this.mesh.rotation.x);

  // 四方向のみの分岐
  
  var testRan;
  while(true){
    testRan = (Math.random()*2-1.0)*20;
    if (testRan>4 || -4>testRan) break;
  }
  var test = Math.random()-0.5;

  if(test < 0){
    this.mesh.rotation.x += Math.PI/testRan; 
    //console.log('x '+testRan);
  }else{
    this.mesh.rotation.z += Math.PI/testRan;
    //console.log('z '+testRan);
  }
  //console.log('z '+this.mesh.rotation.z/Math.PI);
  

  /*
  var testRan;
  while(true){
    testRan = (Math.random()*2-1.0)*20;
    if (testRan>4 || -4>testRan) break;
  }
  var test = Math.random()-0.5;

  var testRan = (Math.random()*((20+1)-4)) + 4; // 4~20
  if(test<0){
    this.mesh.rotation.x = Math.PI/testRan;
  }else{
    this.mesh.rotation.x = -Math.PI/testRan;
  }

  var test3 = Math.random()-0.5;
  if(test3<0){
    this.mesh.rotation.z = Math.PI/testRan;
  }else{
    this.mesh.rotation.z = -Math.PI/testRan;
  }
  */

  /*
  var test2 = Math.random()-0.5;
  if(test2<0){
    this.mesh.rotation.y = Math.PI/testRan;
  }else{
    this.mesh.rotation.y = -Math.PI/testRan;
  }
  */

  
  
  //this.mesh.rotation.x = Math.PI/6;
  //this.mesh.rotation.z = Math.PI/6;

  this.nextPos = {x: 0, y: 0, z:0};
  this.testIs = true;
}

BranchTube.prototype.getMesh = function(){
  return this.mesh;
}

BranchTube.prototype.update = function(){
  if (this.points[1].y < this.maxHeight) {
    this.points[1].y += 0.4;
    this.radius += 0.008; // これifの処理わけてもいいかもね
    this.mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(this.points), 32, this.radius, 8, false);
    
    //this.nextPos.x = this.mesh.position.x - this.points[1].y*Math.sin(this.mesh.rotation.z);
    //this.nextPos.y = this.mesh.position.y + this.points[1].y*Math.cos(this.mesh.rotation.z);
    
    var r = this.maxHeight;
    var theta = Math.PI/2 - this.mesh.rotation.x;
    var phi = Math.PI/2 - this.mesh.rotation.z;
    
    this.nextPos.x = this.mesh.position.x + -r*Math.sin(theta)*Math.cos(phi); // Good
    this.nextPos.y = this.mesh.position.y + r*Math.sin(theta)*Math.sin(phi); // Good
    this.nextPos.z = this.mesh.position.z + r*Math.cos(theta); // theta
    

    /*
    var angle = this.mesh.rotation.x;
    var angle2 = this.mesh.rotation.z;
    this.nextPos.x = Math.cos(angle) * Math.cos(angle2) * r;
    this.nextPos.y = Math.cos(angle) * Math.sin(angle2) * r;
    this.nextPos.z = Math.sin(angle) * r;
    */
  }else{
    if(this.testIs){
      //console.log(this.points[1].y);
      this.testIs = false;
      //console.log(this.nextPos);
      //console.log(this.mesh);
      /*
      var axes = new THREE.AxisHelper(20);
      axes.position.x = this.nextPos.x;
      axes.position.y = this.nextPos.y;
      axes.position.z = this.nextPos.z;      
      scene.add(axes);
      */
    }
  }
  /*
  if(this.mesh.rotation.y < 2.0*Math.PI){
    this.mesh.rotation.y += 0.1;
  }
  */
}

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

  var branches_array = [];
  var pos = {x: 0, y: 0, z: 0};
  var points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  var euler = THREE.Euler;
  var branch = new BranchTube(pos, points, euler, branches_array.length);
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
      console.log(mesh.rotation);
      var euler = mesh.rotation;
      var branch = new BranchTube(pos, points, euler, branchNum);
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


