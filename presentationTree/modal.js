
var branchParams;

var img_src_array = [
'./img/1.jpg',
'./img/1.jpg',
'./img/1.jpg',
];

img_src_array_index = 0;

function openModal(_branchNum){

  $('.window-modal').attr('src', img_src_array[img_src_array_index]);
  img_src_array_index++;
  $('.wrap-modal').fadeToggle(600);
}

function closeModal(){

  if($('.wrap-modal').css('display') == 'block'){
    $('.wrap-modal').fadeToggle(600);
  }
  
}