var presave_branches_array = [];

function saveStorage() {

  localStorage.clear()

  for(var i=0; i<branches_array.length; i++){
    var param = branches_array[i].popParamerter();
    presave_branches_array.push(param);
  }

  console.log(presave_branches_array);

  var params_array_str = JSON.stringify(presave_branches_array);
  localStorage.setItem('params_array_str', params_array_str);

}

function loadStorage() {

  var params_array_str = localStorage.getItem('params_array_str');
  var loaded_params_array = JSON.parse(params_array_str);

  if(loaded_params_array) {
    
    // sceneのメッシュを全て削除
    for(var i=0; i<branches_array.length; i++){
      scene.remove(branches_array[i].mesh);
      scene.remove(branches_array[i].sprite);
    }
    
    branches_array = []; // branch_arrayをリセット
    // paramをロードしてインスタンスを生成
    for(var i=0; i<loaded_params_array.length; i++){
      var param = loaded_params_array[i];
      var branch = new BranchTube(param, true);
      scene.add(branch.getMesh());
      branches_array.push(branch);
    }
    
  }else{
    console.log('no data');
  }

  //debugger;

  console.log(loaded_params_array);

}

function resetStorage() {
  localStorage.clear()
}