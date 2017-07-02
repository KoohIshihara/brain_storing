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
    ctx.fillStyle = '#4a4a4a';
    ctx.textAlign = 'center';
    ctx.fillText(_char,canvas.width/2,canvas.height/2);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  var material = new THREE.SpriteMaterial({
    map : getTexture(_char),
    color : 0xFFFFFF,
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

