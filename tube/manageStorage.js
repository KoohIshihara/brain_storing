
function saveStorage() {

  localStorage.clear()

  var presave_branches_array = [];

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
    
    /*
    var count = 0;
    var rend = function(){
      console.log('count:'+count);
      var id = setTimeout(rend, 400); //再帰関数
      //------------

      var param = loaded_params_array[count];
      var branch = new BranchTube(param, true);
      scene.add(branch.getMesh());
      branches_array.push(branch);

      //------------
      count++;
      if(count+1 > loaded_params_array.length){
        clearTimeout(id);
        console.log('load completed');
      }
    }
    rend();
    */
    
  }else{
    console.log('no data');
  }

  //debugger;

  console.log(loaded_params_array);

}

function resetStorage() {
  localStorage.clear()
}

function listArray(){
  console.log(branches_array);
}
