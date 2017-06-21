var LeafSprite = function(_char ,_pos, _scale){

  var self = this;
  this.sprite;

  // 文字列をテクスチャにして返す関数
  var getTexture = function ( _char ) {
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    var ctx = canvas.getContext('2d');
    // the body
    ctx.font= '76px Century Gothic';
    ctx.fillStyle = '#00f';
    ctx.textAlign = 'center';
    ctx.fillText(_char,canvas.width/2,canvas.height/2);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  var material = new THREE.SpriteMaterial({
    map : getTexture(_char),
    color : 0xFF0000,
  });
  var sprite = new THREE.Sprite(material);
  sprite.position.set(_pos.x, _pos.y, _pos.z);
  sprite.scale.set(_scale.x, _scale.y, _scale.z);

  this.sprite = sprite;

}

LeafSprite.prototype.getSprite = function(){
  return this.sprite;
}


var TextLeaves = function(_text ,_pos, _scale){

  var self = this;
  this.text = _text;

  this.text_array = [];

  for(var i=0; i<_text.length; i++){

    // カーニングの設定
    var charPos;
    var between = 0.4 * _scale.x;
    var offsetX = _pos.x - (between*_text.length)/2;
    charPos = {x:offsetX + i*between, y: _pos.y, z: _pos.z};

    var charScale;
    charScale = _scale;
    
    var leafSprite = new LeafSprite(_text[i], charPos, charScale);
    this.text_array.push(leafSprite);
    scene.add(leafSprite.getSprite());
  }

}

TextLeaves.prototype.getSprite = function(){
  //return this.sprite;
  return this.text_array[0];
}


var scene;


// once everything is loaded, we run our Three.js stuff.
function init() {

  scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 20;
  camera.lookAt(scene.position);

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  var pos = {x:0, y:0, z:0};
  var scale = {x:1, y:1, z:1};

  var textLeaves = new TextLeaves('hoge is fun', pos, scale);
  scene.add(textLeaves.getSprite());

  render();
  function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  // render the scene
  renderer.render(scene, camera);

}
window.onload = init;
