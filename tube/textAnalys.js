var analyzer = {
  contradictory: {},
  convert: {},
};


analyzer.contradictory.keywords = ['But', 'but', 'However', 'however', 'Nevertheless', 'nevertheless', 'Despite', 'despite', 'In spite of', 'in spite of', 'Though', 'though', 'Although', 'although'];
//analyzer.contradictory.keywords = ['しかし', 'だが', 'けれども'];

analyzer.contradictory.search = function(_text, _mesh){
  alert();
  for(var i=0; i<this.keywords.length; i++){
    if(_text.match(this.keywords[i]+' ')){
      _mesh.rotation.z = Math.PI/4;
    }
  }

}
