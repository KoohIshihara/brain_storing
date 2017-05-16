var analyzer = {
  contradictory: {},
  convert: {},
};


analyzer.contradictory.keywords = ['But', 'but', 'However', 'however', 'Nevertheless', 'nevertheless', 'Despite', 'despite', 'In spite of', 'in spite of', 'Though', 'though', 'Although', 'although'];
//analyzer.contradictory.keywords = ['しかし', 'だが', 'けれども'];

analyzer.contradictory.search = function(_text, _mesh, _preEuler){
  console.log('contradictory');
  for(var i=0; i<this.keywords.length; i++){
    if(_text.match(this.keywords[i]+' ')){
      //_mesh.rotation.z = Math.PI/4;
      var test = Math.random()-0.5;
      
      var test2 = Math.random()-0.5;
      var palmi;
      if(test2 < 0){
        palmi = 1;
      }else{
        palmi = -1;
      }
      console.log(_preEuler);
      if(test < 0){
        _mesh.rotation.x = Math.PI/5 + _preEuler.x;
      }else{
        _mesh.rotation.z = Math.PI/5 + _preEuler.z;
      }
    }
  }

}
