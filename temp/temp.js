
// once everything is loaded, we run our Three.js stuff.
function init() {

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 80;
  camera.lookAt(scene.position);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);





  render();
  function render(){

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  // render the scene
  renderer.render(scene, camera);

}
window.onload = init;
