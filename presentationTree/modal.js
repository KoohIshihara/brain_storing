
var branchParams;
/*
var img_src_array = [
'./img/1.jpg',
'./img/1.jpg',
'./img/1.jpg',
];
*/
img_src_array_index = 1;

function openModal(_branchNum){

  $('.window-modal').attr('src', './img/'+ img_src_array_index +'.jpg');
  img_src_array_index++;
  $('.wrap-modal').fadeToggle(600);
}

function closeModal(){

  if($('.wrap-modal').css('display') == 'block'){
    $('.wrap-modal').fadeToggle(600);
  }

}