var allowStep = false;
var zoomSpeed = {};
var lookSpeed = {};

var zoomPoint = {x:4, y:30, z:0};
var zoomPoint2 = {x:4, y:-30, z:0};

var cameraPoints_array = [];
var lookPoints_array = [];
var allowOpenModal_array = [];

var points_index = 0;

var nowLookPos = {x:0, y:20, z:0};


/*
cameraPoints_array.push(zoomPoint);
cameraPoints_array.push(zoomPoint2);
*/

function loadBranches_array(){
  /*
  createBranch(0, 10, 'message');
  createBranch(1, -10, 'message');
  createBranch(1, 10, 'message');
  createBranch(0, -10, 'message');
  createBranch(4, 10, 'message');
  createBranch(4, -10, 'message');
  createBranch(6, 10, 'message');
  createBranch(7, 0, 'message');
  */

  createBranch(0, 4, 'Concept');
  createBranch(1, 0, 'My Question');
  createBranch(2, 10, 'How');
  createBranch(3, 10, 'Collage Contents');
  createBranch(3, -10, 'Forked Media');
  createBranch(2, -10, 'Why');
  createBranch(6, 10, 'Social Background');
  createBranch(6, -10, 'Personal Background');

  createBranch(0, -4, 'Logic');
  createBranch(9, 0, 'Past');
  createBranch(9, 20, 'Now');
  createBranch(11, 0, 'Caluculation');
  createBranch(11, 20, 'Characteristic');


  for(var i=0; i<branches_array.length; i++){
    cameraPoints_array.push(branches_array[i].cameraPos);
    lookPoints_array.push(branches_array[i].nextPos);

    // 特定のメッセージの時だけモーダルを出さない。
    allowOpenModal_array[i] = true;
    var text = branches_array[i].text;
    if(text=='Concept' || text=='How' || text=='Why' || text=='Logic'){
      allowOpenModal_array[i] = false;
    }
  }
}

var isFirstModal = true;

function stepNext() {

  closeModal();
  
  var gap = {};
  gap.x = Math.abs(cameraPoints_array[points_index].x - camera.position.x);
  gap.y = Math.abs(cameraPoints_array[points_index].y - camera.position.y);
  gap.z = Math.abs(cameraPoints_array[points_index].z - camera.position.z);

  var lookGap = {};
  lookGap.x = Math.abs(lookPoints_array[points_index].x - nowLookPos.x);
  lookGap.y = Math.abs(lookPoints_array[points_index].y - nowLookPos.y);
  lookGap.z = Math.abs(lookPoints_array[points_index].z - nowLookPos.z);

  zoomSpeed.x = gap.x/60;
  zoomSpeed.y = gap.y/60;
  zoomSpeed.z = gap.z/60;

  lookSpeed.x = lookGap.x/60;
  lookSpeed.y = lookGap.y/60;
  lookSpeed.z = lookGap.z/60;

  allowStep = true; // updateで呼び出してる。

}


function zoomToPoint() {

  var gap = {};
  gap.x = cameraPoints_array[points_index].x - camera.position.x;
  gap.y = cameraPoints_array[points_index].y - camera.position.y;
  gap.z = cameraPoints_array[points_index].z - camera.position.z;

  var margin = 0.5;
  var arrive = {
    x:false,
    y:false,
    z:false,
  }

  if(gap.x > margin){
    camera.position.x+=zoomSpeed.x;
  }else if(gap.x < -margin){
    camera.position.x-=zoomSpeed.x;
  }else{
    arrive.x = true;
  }

  if(gap.y > margin){
    camera.position.y+=zoomSpeed.y;
  }else if(gap.y < -margin){
    camera.position.y-=zoomSpeed.y;
  }else{
    arrive.y = true;
  }

  if(gap.z > margin){
    camera.position.z+=zoomSpeed.z;
  }else if(gap.z < -margin){
    camera.position.z-=zoomSpeed.z;
  }else{
    arrive.z = true;
  }


  var lookGap = {};
  lookGap.x = lookPoints_array[points_index].x - nowLookPos.x;
  lookGap.y = lookPoints_array[points_index].y - nowLookPos.y;
  lookGap.z = lookPoints_array[points_index].z - nowLookPos.z;

  var lookArrive = {
    x:false,
    y:false,
    z:false,
  }

  if(lookGap.x > margin){
    nowLookPos.x+=lookSpeed.x;
  }else if(lookGap.x < -margin){
    nowLookPos.x-=lookSpeed.x;
  }else{
    lookArrive.x = true;
  }

  if(lookGap.y > margin){
    nowLookPos.y+=lookSpeed.y;
  }else if(lookGap.y < -margin){
    nowLookPos.y-=lookSpeed.y;
  }else{
    lookArrive.y = true;
  }

  if(lookGap.z > margin){
    nowLookPos.z+=lookSpeed.z;
  }else if(lookGap.z < -margin){
    nowLookPos.z-=lookSpeed.z;
  }else{
    lookArrive.z = true;
  }

  camera.lookAt(new THREE.Vector3(nowLookPos.x, nowLookPos.y, nowLookPos.z));

  if(arrive.x&&arrive.y&&arrive.z){
    allowStep = false;
    
    //var look = lookPoints_array[points_index];
    //camera.lookAt(new THREE.Vector3(look.x, look.y, look.z));

    if(allowOpenModal_array[points_index]) openModal(0);

    points_index++;
  }
  
}


function createBranch(_preBranchNum, _rotationRad, _text) {

  var pos = branches_array[_preBranchNum].nextPos;
  var points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  var branchNum = branches_array.length;
  var preBranchNum = _preBranchNum;
  var depthLevel = branches_array[_preBranchNum].depthLevel + 1;

  var paramerter = {
    pos: pos,
    points: points,
    branchNum: branchNum,
    preBranchNum: preBranchNum,
    rotationRad: _rotationRad,
    text: _text,
    depthLevel: depthLevel,
    isFirst: false,
  };

  var branch = new BranchTube(paramerter);
  branches_array.push(branch);
  scene.add(branches_array[branchNum].getMesh());
  console.log(branch);
}
