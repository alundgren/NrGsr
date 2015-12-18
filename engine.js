nrGsr = (function ()  {
  var createStrategyString = function(s) {
    return btoa(JSON.stringify({ name : s.name, f : s.f}));    
  }
  var parseStrategyString = function (s) {
    var c = JSON.parse(atob(s));
    var ff = Function('g', c.f); 
    return {
      name : c.name,
      f : ff
    }
  }
  var  simulateGame = function (strategyString1, strategyString2, options) {  
    var strategy1 = parseStrategyString(strategyString1);
    var strategy2 = parseStrategyString(strategyString2);
    if(strategy1.name === strategy2.name) {
      throw 'duplicate strategy names'
    }
    var strats = [strategy1, strategy2];
    options = options || {}
    options.n = options.n || 1000;
    options.getCorrectNr = options.getCorrectNr || function() {
        var min = 1;
        var max = options.n;
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    var logEnabled = options.logEnabled || false;  
    var correctNr = options.getCorrectNr();  
    var game = {
      
    }
    
    if(logEnabled) {
      game.log = [];
    }
    
    var isIn = function (nr, arrayOfNrs) {
      for(var i=0; i< arrayOfNrs.length; i++) {
        if(arrayOfNrs[i] === nr) {
          return true;
        }      
      }
      return false;
    }
    
    var guesses = [];
    var round = 0;
    while(round < options.n) {
      var guess;
      var current;
      var other;
  
      current = strats[round%2];
      other = strats[1-(round%2)]; 
  
      guess = current.f(guesses.slice());
  
      if(isIn(guess, guesses) || guess < 1 || guess > options.n) {
        if(logEnabled) {
          game.log.push(current.name + ': ' + guess + ' <-- INVALID');
          game.log.push('--' + other.name + ' wins --');
        }
        game.nrOfRounds = round + 1;
        game.winnerName = other.name;
        game.isInvalidGuessWin = true;
        return game;
      } else if(guess === correctNr) {
        if(logEnabled) {
          game.log.push(current.name + ': ' + guess);
          game.log.push('--' + current.name + ' wins--');
        }
        game.nrOfRounds = round + 1;      
        game.winnerName = current.name;
        game.isInvalidGuessWin = false;     
        return game;
      } else {
        guesses.push(guess);
        if(logEnabled) {
          game.log.push(current.name + ': ' + guess);
        }
      }
      round = round + 1;
    }  
    throw 'game engine broke. no winner after all rounds.'
  }
  return {  simulateGame : simulateGame, 
            createStrategyString : createStrategyString, 
            parseStrategyString : parseStrategyString 
  };
})();