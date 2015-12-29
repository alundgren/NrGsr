nrGsr = (function ()  {
  var createStrategyString = function(f) {
    return btoa(f);    
  }
  var parseStrategyString = function (s) {
    var c = atob(s);
    return Function('m', c); 
  }
  
  //TODO: Missing intel. Opponents last guess
  
  var  simulateGame = function (c1, c2, options) {  
    var strats = [c1, c2]; //{ f : <fn>, m : {}, name : 'player 1', nr : 1 }
    options = options || {}
    options.n = options.n || 1000;
    options.maxNrOfRounds = options.maxNrOfRounds || 10000; //NOTE: If both players strategy even does the bare minimum of not guessing already known wrong answers this caps out at n.
    options.getCorrectNr = options.getCorrectNr || function() {
        var min = 1;
        var max = options.n;
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    var logEnabled = options.logEnabled || false;  
    var correctNr = options.getCorrectNr();  
    var game = {
      winner : 0
    }
    
    if(logEnabled) {
      game.log = ['correct nr: ' + correctNr];
    }
    
    game.nrOfRounds = 1;
    var guesses = [[], []];
    while(game.nrOfRounds <= options.maxNrOfRounds) {
      var guess;
      var current;
      var other;
      
      current = strats[1-(game.nrOfRounds%2)];
      other = strats[game.nrOfRounds%2];
      var currentGuesses = guesses[1-(game.nrOfRounds%2)];
      var otherGuesses = guesses[game.nrOfRounds%2];
        
      current.m.yourGuesses = currentGuesses;
      current.m.opponentsGuesses = otherGuesses;
      
      guess = current.f(current.m);
      
      if(guess === correctNr) {
        if(logEnabled) {
          game.log.push(current.name +   ': ' + guess);
          game.log.push('--' + current.name + ' wins--');
        }
        game.winner = current.nr;
        return game;
      } else {
        if(guess < correctNr) {
            currentGuesses.push({ g : guess, r : 1 })
        } else {
            currentGuesses.push({ g : guess, r : -1 })
        }
        
        if(logEnabled) {
          game.log.push(current.name + ': ' + guess);
        }
      }
      game.nrOfRounds = game.nrOfRounds + 1;
    }
    if(logEnabled) {
      game.log.push('-- no winner. max nr of rounds hit --');
    }
    return game;
  }
  
  var findBestStrategy = function(strategy1, strategy2, options) {
    var result = {
      nrOfGames : 0,
      nrOfRounds : 0,
      wins : [0, 0, 0] //draws, p1, p2
    }

    var r;
    var c1;
    var c2;
    for(var i=0; i<10000; i++) {
      c1 = { f : strategy1, m : {}, name : 'player 1', nr : 1 }
      c2 = { f : strategy2, m : {}, name : 'player 2', nr : 2 }
      if(i % 2 === 0) {
        r = simulateGame(c1, c2, options);
      } else {
        r = simulateGame(c2, c1, options);
      }
      result.wins[r.winner] = result.wins[r.winner] + 1;      
      result.nrOfGames = result.nrOfGames + 1;
      result.nrOfRounds = result.nrOfRounds + r.nrOfRounds;
    }
    return result;
  };
  
  return {  simulateGame : simulateGame, 
            createStrategyString : createStrategyString, 
            parseStrategyString : parseStrategyString,
            findBestStrategy : findBestStrategy
  };
})();