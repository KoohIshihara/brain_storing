var analyzer = {
  contradictory: {},
};


analyzer.contradictory.keywords = ['But', 'but', 'However', 'however', 'Nevertheless', 'nevertheless', 'Despite', 'despite', 'In spite of', 'in spite of', 'Though', 'though', 'Although', 'although'];

analyzer.contradictory.search = function(_text, _mesh){
  
  for(var i=0; i<this.keywords.length; i++){
    if(_text.match(this.keywords[i]+' ')){
      _mesh.rotation.z = Math.PI/4;
    }
  }

}