
var branchParams;

function openModal(_branchNum){
  $('.wrap-modal').fadeToggle(400);

  var pos = branches_array[_branchNum].nextPos;
  var points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  var branchNum = branches_array.length;
  var preBranchNum = _branchNum;
  var depthLevel = branches_array[_branchNum].depthLevel + 1;

  branchParams = {
    pos: pos,
    url: null,
    text: null,
    points: points,
    branchNum: branchNum,
    preBranchNum: preBranchNum,
    depthLevel: depthLevel,
    isFirst: false,
  };

  /*記事をリストする処理*/
  $('.list').empty();

  var num = _branchNum;
  while(true){
    nowBranch = branches_array[num];
    var text = branches_array[num].text;
    var divList = $("<div></div>", {
      "class": "list-text",
    });
    divList.text(text);
    $('.list').prepend(divList);

    if(num==0) break;
    num = branches_array[num].preBranchNum;
  }


}

function closeModal(){
  $('.wrap-modal').fadeToggle(400);
  $('.url-input')[0].value = "";
  $('.text-input')[0].value = "";
  branchParams = {};

  $('.list').empty();
}

function createNextBranch(){

  var url = $('.url-input')[0].value;
  var text = $('.text-input')[0].value;

  branchParams.url = url;
  branchParams.text = text;

  var branch = new BranchTube(branchParams);
  branches_array.push(branch);
  scene.add(branches_array[branchParams.branchNum].getMesh());
  closeModal();
}