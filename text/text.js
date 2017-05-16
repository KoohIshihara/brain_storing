
// once everything is loaded, we run our Three.js stuff.
function init() {

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x999999));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 20;
  camera.lookAt(scene.position);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  var getTexture = function () {

    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    var ctx = canvas.getContext('2d');
    // the body
    ctx.font= '80px Century Gothic';
    ctx.fillStyle = '#999';
    //ctx.textAlign = 'center';
    ctx.fillText('tes',0,canvas.height/2);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;

  };

  createSprites();

  function createSprites() {
    var material = new THREE.SpriteMaterial({
      map : getTexture(),
      color : 0xFF0000,
    });
    var sprite = new THREE.Sprite(material);
    sprite.position.set(0, 0, 0);
    //sprite.scale.set(4, 4, 4);
    scene.add(sprite);
  }

  render();
  function render(){

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  // render the scene
  renderer.render(scene, camera);

}
window.onload = init;
