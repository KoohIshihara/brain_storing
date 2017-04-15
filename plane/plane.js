
var addFractalPlane = function(scene){
  var planeGeometry = new THREE.PlaneGeometry(80, 80);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  /*
  var baseVertix = [];
  for(var i=0; i<2; i++){
    baseVertix[i] = {
      x: plane.geometry.vertices[i].x,
      y: plane.geometry.vertices[i].y,
      z: plane.geometry.vertices[i].z,
    }
  }
  */
  scene.add(plane);
}


function init() {

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 80;
  camera.lookAt(scene.position);

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // show axes in the screen
  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  var planeGeometry = new THREE.PlaneGeometry(4, 0);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  var baseVertix = [];
  for(var i=0; i<2; i++){
    baseVertix[i] = {
      x: plane.geometry.vertices[i].x,
      y: plane.geometry.vertices[i].y,
      z: plane.geometry.vertices[i].z,
    }
  }
  plane.position.y = 10;
  scene.add(plane);


  var controls = new function () {
    
    this.scaleX = 1.0;
    this.rotationZ = 0;
    this.vertex = 0;

  };
  var gui = new dat.GUI();
  
  gui.add(controls, 'scaleX', 0, 3.0);
  gui.add(controls, 'rotationZ', -0.5, 0.5);
  gui.add(controls, 'vertex', 0, 40);
  

  // add the output of the renderer to the html element
  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  console.log(plane.geometry);
  console.log(baseVertix);
  render();
  function render(){

    plane.scale.x = controls.scaleX;

    plane.rotation.z = controls.rotationZ * (2*Math.PI);

    plane.geometry.verticesNeedUpdate = true;
    plane.geometry.vertices[0].y = baseVertix[0].y + controls.vertex;
    plane.geometry.vertices[1].y = baseVertix[1].y + controls.vertex;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  // render the scene
  renderer.render(scene, camera);

}
window.onload = init;
