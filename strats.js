var testStrats = (function () {
 function randomIntFromInterval(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
  }
  
  var isIn = function(nr, arrayOfNrs) {
    for(var i=0; i< arrayOfNrs.length; i++) {
      if(arrayOfNrs[i] === nr) {
        return true;
      }      
    }
    return false;
  }

  var pickLowestPossible = function(g) {
    for(var i=1;i<=1000;i++) {
      if(!isIn(i, g)) {
        return i;
      }
    }
    throw "fail";
  };

  var pickRandom = function(g) {
    while(true) {
      var i = randomIntFromInterval(1, 1000);
      if(!isIn(i, g)) {
        return i;
      }
      return i;     
    }
  }; 
  
  return {
    pickLowestPossible : pickLowestPossible,
    pickRandom : pickRandom
  }
})();