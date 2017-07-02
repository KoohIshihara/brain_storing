var BranchTube = function(_pos, _points, _branchNum, _preBranchNum, _isFirst){
  // コンストラクタ
  this.points = _points;
  this.branchNum = _branchNum;
  this.radius = 0.1;
  

  this.maxHeight = 14;
  //this.text = prompt('Type Texts', 'But I did not think so.');
  //this.maxHeight = this.text.length;

  //(points, segments, radius, radiusSegments, closed, taper)
  var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(_points), 32, 0, 4, false);
  var material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color( 0x999999 );
  material.wireframe = true;
  material.wireframeLinewidth = 0.1;
  this.mesh = new THREE.Mesh(tubeGeometry, material);
  // インスタンスの中にMeshをいれた状態でJSONテキスト化させようとするとエラーになる。

  this.mesh.position.x = _pos.x;
  this.mesh.position.y = _pos.y;
  this.mesh.position.z = _pos.z;
  //this.mesh.rotation.x = _euler.x;
  //this.mesh.rotation.z = _euler.z;
  this.mesh.branchNum = _branchNum;

  if(_isFirst){
    this.preEuler = {x:0,y:0,z:0};
    first = false;
  }else{
    this.preEuler = branches_array[_preBranchNum].mesh.rotation;

    // テキストに応じて角度を設定
    //analyzer.contradictory.search(this.text, this.mesh, this.preEuler);
    //this.mesh.rotation.y += this.preEuler.y;
    //this.mesh.rotation.z += this.preEuler.z;
    
    // 四方向分岐
    var testRan;
    while(true){
      testRan = (Math.random()*2-1.0)*20; // -20~20
      if (testRan>4 || -4>testRan) break; // -20~-4 or 4~20
    }
    var test = Math.random()-0.5;
    if(test < 0){
      this.mesh.rotation.x = Math.PI/testRan + this.preEuler.x; 
    }else{
      this.mesh.rotation.z = Math.PI/testRan + this.preEuler.z;
    }
    
    
  }

  //this.mesh.rotation.y = _euler.y;

  this.nextPos = {x: 0, y: 0, z:0};
  this.testIs = true;

  // テキスト系統
  var textPos = {};
  var r = this.maxHeight;
  var theta = Math.PI/2 - this.mesh.rotation.x;
  var phi = Math.PI/2 - this.mesh.rotation.z;
  textPos.x = this.mesh.position.x + -r*Math.sin(theta)*Math.cos(phi);
  textPos.y = this.mesh.position.y + r*Math.sin(theta)*Math.sin(phi);
  textPos.z = this.mesh.position.z + r*Math.cos(theta);

  /*
  var textScale = {x:1.4, y:1.4, z:1.4};
  var textLeaves = new TextLeaves('One day, hoge is fun', textPos, textScale);
  scene.add(textLeaves.getSprite());
  */

  var textBoardObject = new TextBoardObject({
    fontSize : 6, // [%]
    textColor : {r:0, g:0, b:0, a:1},//文字色
    backgroundColor : { r:1, g:1, b:1, a:0.2 },//背景色（RGBA値を0から１で指定）
    boardWidth : 128,  //マッピング対象平面オブジェクトの横幅
    boardHeight : 16, //マッピング対象平面オブジェクトの縦幅
    fontName :"Times New Roman"
  });

  textBoardObject.addTextLine('this is fun, but he thinks that');
  var sprite = textBoardObject.cleateSpriteObject();

  var textScale = {};
  textScale.x = sprite.scale.x;
  textScale.y = sprite.scale.y;
  textScale.z = sprite.scale.z;
  
  sprite.position.set(textPos.x, textPos.y, textPos.z);
  sprite.scale.set(textScale.x*0.1, textScale.y*0.1, textScale.z*0.1);
  scene.add(sprite);


}

BranchTube.prototype.getMesh = function(){
  return this.mesh;
}

BranchTube.prototype.update = function(){
  
  if (this.points[1].y < this.maxHeight) {
    
    this.points[1].y += 0.4;
    this.radius += 0.002; // これifの処理わけてもいいかもね
    this.mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(this.points), 16, this.radius, 4, false);

    // 2次元用
    //this.nextPos.x = this.mesh.position.x - this.points[1].y*Math.sin(this.mesh.rotation.z);
    //this.nextPos.y = this.mesh.position.y + this.points[1].y*Math.cos(this.mesh.rotation.z);
    
    var r = this.maxHeight;    
    var theta = Math.PI/2 - this.mesh.rotation.x;
    var phi = Math.PI/2 - this.mesh.rotation.z;
    
    this.nextPos.x = this.mesh.position.x + -r*Math.sin(theta)*Math.cos(phi);
    this.nextPos.y = this.mesh.position.y + r*Math.sin(theta)*Math.sin(phi);
    this.nextPos.z = this.mesh.position.z + r*Math.cos(theta);

  }else{
    if(this.testIs){
      this.testIs = false;
      /*
      var axes = new THREE.AxisHelper(20);
      axes.position.x = this.nextPos.x;
      axes.position.y = this.nextPos.y;
      axes.position.z = this.nextPos.z;
      axes.rotation.x = this.mesh.rotation.x;
      axes.rotation.y = this.mesh.rotation.y;
      axes.rotation.z = this.mesh.rotation.z;
      scene.add(axes);
      */
    }
  }

}
