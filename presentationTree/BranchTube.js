var parm

var BranchTube = function(_paramerter, _isLoaded){

  if(_isLoaded == true){
    
    this.load(_paramerter);

  }else{
    parm = _paramerter;
    // コンストラクタ
    this.pos = _paramerter.pos;
    this.points = _paramerter.points;
    this.branchNum = _paramerter.branchNum;
    this.preBranchNum = _paramerter.preBranchNum;
    this.depthLevel = _paramerter.depthLevel;
    this.isFirst = _paramerter.isFirst;

    this.nextPos = {x: 0, y: 0, z:0}; //updateで値が変化

    this.cameraPos = {x: 0, y: 0, z:0};

    this.url = _paramerter.url || 'no url';
    this.text = _paramerter.text || 'no text';

    this.radius = 0.001;
    this.maxRadius = 8;
    /*
    this.maxHeight = this.text.length/4;
    if(this.maxHeight<14) this.maxHeight = 14;
    */
    this.rotationRad = _paramerter.rotationRad || 0;

    this.maxHeight = 18;

    this.createMesh();
    this.createSprite();

  }// isLoaded else

}

BranchTube.prototype.getMesh = function(){
  return this.mesh;
}

BranchTube.prototype.createMesh = function(){
  //(points, segments, radius, radiusSegments, closed, taper)
  var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(this.points), 8, this.radius, 4, false);
  var material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color( 0xffffff );
  //material.color = new THREE.Color("hsl("+ this.depthLevel*10 +", 50%, 70%)");
  material.wireframe = true;
  material.wireframeLinewidth = 0.1;
  this.mesh = new THREE.Mesh(tubeGeometry, material);
  // インスタンスの中にMeshをいれた状態でJSONテキスト化させようとするとエラーになる。
  this.mesh.position.x = this.pos.x;
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z;
  //this.mesh.rotation.x = _euler.x;
  //this.mesh.rotation.z = _euler.z;
  this.mesh.branchNum = this.branchNum;

  if(this.isFirst){
    this.preEuler = {x:0,y:0,z:0};

    // save用
    this.meshRotation = new THREE.Euler();

  }else{
    this.preEuler = branches_array[this.preBranchNum].mesh.rotation;
    
    // 四方向分岐
    /*
    var testRan;
    while(true){
      testRan = (Math.random()*2-1.0)*16; // -16~16
      if (testRan>4 || -4>testRan) break; // -20~-4 or 4~20
    }
    var test = Math.random()-0.5;
    if(test < 0){
      this.mesh.rotation.x = Math.PI/testRan + this.preEuler.x;
    }else{
      this.mesh.rotation.z = Math.PI/testRan + this.preEuler.z;
    }
    */

    if(this.rotationRad != 0){
      this.mesh.rotation.z = Math.PI/this.rotationRad + this.preEuler.z;
    }else{
      this.mesh.rotation.z = 0;
    }    

    // save用
    this.meshRotation = this.mesh.rotation;
  }

  var r = this.maxHeight;
  var theta = Math.PI/2 - this.mesh.rotation.x;
  var phi = Math.PI/2 - this.mesh.rotation.z;
  
  this.nextPos.x = this.mesh.position.x + -r*Math.sin(theta)*Math.cos(phi);
  this.nextPos.y = this.mesh.position.y + r*Math.sin(theta)*Math.sin(phi);
  this.nextPos.z = this.mesh.position.z + r*Math.cos(theta);

  this.cameraPos.x = this.mesh.position.x + -r/2*Math.sin(theta)*Math.cos(phi);
  this.cameraPos.y = this.mesh.position.y + r/2*Math.sin(theta)*Math.sin(phi);
  this.cameraPos.z = this.mesh.position.z + r/2*Math.cos(theta);  

}

BranchTube.prototype.createSprite = function(){
  // テキスト系統
  var textPos = {};
  var r = this.maxHeight;
  var theta = Math.PI/2 - this.mesh.rotation.x;
  var phi = Math.PI/2 - this.mesh.rotation.z;
  textPos.x = this.mesh.position.x + -r*Math.sin(theta)*Math.cos(phi);
  textPos.y = this.mesh.position.y + r*Math.sin(theta)*Math.sin(phi);
  textPos.z = this.mesh.position.z + r*Math.cos(theta);
  textPos.z += 0.1;

  /*
  function floatFormat( number, n ) {
    var _pow = Math.pow(10, n);
    return Math.round(number*_pow) / _pow;
  }
  var color = this.mesh.material.color;
  var textColor = {
    r: floatFormat(color.r, 1),
    g: floatFormat(color.g, 1),
    b: floatFormat(color.b, 1),
  }
  console.log(textColor);
  */

  var color = this.mesh.material.color;
  var textBoardObject = new TextBoardObject({
    fontSize : 6, // [%]
    textColor : {r: 0.4, g: 0, b: 0, a: 1},//これはつかってない！
    backgroundColor : { r:1, g:1, b:1, a:0.01 },//背景色（RGBA値を0から１で指定）
    boardWidth : 128,  //マッピング対象平面オブジェクトの横幅
    boardHeight : 16, //マッピング対象平面オブジェクトの縦幅
    fontName : "Times New Roman", //'ＭＳ Ｐゴシック',
    strColor: color.getHexString(),
  });

  textBoardObject.addTextLine(this.text);
  
  var sprite = textBoardObject.cleateSpriteObject();

  var textScale = {};
  textScale.x = sprite.scale.x;
  textScale.y = sprite.scale.y;
  textScale.z = sprite.scale.z;
  
  sprite.position.set(textPos.x, textPos.y, textPos.z);
  sprite.scale.set(textScale.x*0.12 ,textScale.y*0.12 , textScale.z*0.12);
  sprite.branchNum = this.branchNum;
  scene.add(sprite);
  this.sprite = sprite;
}

BranchTube.prototype.update = function(){
 
  if (this.points[1].y < this.maxHeight) {
    
    this.points[1].y += 0.4;
    this.mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(this.points), 8, this.radius, 4, false);

  }

  if (this.radius < this.maxRadius) {
//    this.radius += 0.002;
  }
  
}


BranchTube.prototype.popParamerter = function(){

  // meshとspriteはJSON化できない。
  var paramerter = {
    pos: this.pos,
    nextPos: this.nextPos,
    points: this.points,
    branchNum: this.branchNum,
    preBranchNum: this.preBranchNum,
    depthLevel: this.depthLevel,
    isFirst: this.isFirst,
    radius: this.radius,
    maxRadius: this.maxRadius,
    maxHeight: this.maxHeight,
    text: this.text,
    url: this.url,
    //-
    meshRotation: this.meshRotation,
    nextPos: this.nextPos,
    //mesh: this.mesh,   
    //sprite: this.sprite,
  }; 

  return paramerter;
  //presave_branches_array.push(paramerter);

}

var test = 0;
BranchTube.prototype.load = function(_paramerter){
  
  // コンストラクタ
  this.pos = _paramerter.pos;
  this.nextPos = _paramerter.nextPos;
  this.points = _paramerter.points;
  this.branchNum = branches_array.length;//_paramerter.branchNum;
  this.preBranchNum = _paramerter.preBranchNum;
  this.depthLevel = _paramerter.depthLevel;
  this.isFirst = _paramerter.isFirst;
  this.radius = _paramerter.radius;
  this.maxRadius = _paramerter.maxRadius;
  this.maxHeight = _paramerter.maxHeight;
  this.text = _paramerter.text || 'no text'; 
  this.url = _paramerter.url || 'no url';

  this.meshRotation = _paramerter.meshRotation;

  console.log(this.meshRotation);

  this.points_three = [];
  for(var i=0; i<this.points.length; i++){
    var point = new THREE.Vector3(this.points[i].x, this.points[i].y, this.points[i].z);
    this.points_three.push(point);
  }
  //(points, segments, radius, radiusSegments, closed, taper)
  var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(this.points_three), 8, this.radius, 4, false);
  var material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color("hsl("+ this.depthLevel*10 +", 50%, 70%)");
  material.wireframe = true;
  material.wireframeLinewidth = 0.1;
  //material.opacity = 0.4;
  this.mesh = new THREE.Mesh(tubeGeometry, material);

  this.mesh.position.x = this.pos.x;
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z;
  this.mesh.branchNum = branches_array.length; //this.branchNum;
  
  if(this.isFirst){
    this.preEuler = {x:0,y:0,z:0};
    // save用
    this.meshRotation = new THREE.Euler();
  }else{
    this.preEuler = branches_array[this.preBranchNum].mesh.rotation;
    this.mesh.rotation.x = this.meshRotation._x;
    this.mesh.rotation.y = this.meshRotation._y;
    this.mesh.rotation.z = this.meshRotation._z;
  }

  this.createSprite();
  //console.log(this.mesh);

}






