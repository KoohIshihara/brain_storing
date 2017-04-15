
// once everything is loaded, we run our Three.js stuff.
function init() {

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // show axes in the screen
  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(4, 20);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  /*
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  */
  scene.add(plane);

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 80;
  camera.lookAt(scene.position);


  var controls = new function () {
    this.planeSize = 1.0;
  };
  var gui = new dat.GUI();
  gui.add(controls, 'planeSize', 0, 4.0);

  // add the output of the renderer to the html element
  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  render();
  function render(){

    plane.geometry.verticesNeedUpdate = true;
    plane.scale.y = controls.planeSize;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  // render the scene
  renderer.render(scene, camera);

}
window.onload = init;
