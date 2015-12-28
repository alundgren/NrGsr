nrGsr = (function ()  {
  var createStrategyString = function(f) {
    return btoa(f);    
  }
  var parseStrategyString = function (s) {
    var c = atob(s);
    return Function('g', 'r', 'm', c); 
  }
  var  simulateGame = function (strategy1, strategy2, options) {  
    var strats = [{ f : strategy1, m : {}, name : 'player 1', nr : 1 }, { f : strategy2, m : {}, name : 'player 2', nr : 2 }];
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
      game.log = [];
    }
    
    game.nrOfRounds = 1;
    var lastGuess = null;
    var lastResult = 0;
    while(game.nrOfRounds <= options.maxNrOfRounds) {
      var guess;
      var current;
      var other;
      
      current = strats[1-(game.nrOfRounds%2)];
      other = strats[game.nrOfRounds%2];
  
      guess = current.f(lastGuess, lastResult, current.m);
      
      if(guess === correctNr) {
        if(logEnabled) {
          game.log.push(current.name +   ': ' + guess);
          game.log.push('--' + current.name + ' wins--');
        }
        game.winner = current.nr;
        return game;
      } else {
        lastGuess = guess;
        if(guess < correctNr) {
          lastResult = 1;
        } else {
          lastResult = -1;
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
  }
  
  var findBestStrategy = function(strategy1, strategy2, options) {
    var result = {
      nrOfGames : 0,
      nrOfRounds : 0
    }
    var s1 = parseStrategyString(strategy1);
    var s2 = parseStrategyString(strategy2);
    
    result['_wins_' + s1.name] = 0;
    result['_wins_' + s2.name] = 0;
    for(var i=0; i<1000; i++) {
      var r;
      if(i % 2 === 0) {
        r = simulateGame(strategy1, strategy2, options);
      } else {
        r = simulateGame(strategy2, strategy1, options);
      }
      result['_wins_' +  r.winnerName] = result['_wins_' +  r.winnerName] + 1;
      result.nrOfGames = result.nrOfGames + 1;
      result.nrOfRounds = result.nrOfRounds + r.nrOfRounds;
      if(r.invalidStrategyName) {
        result['_invalid_' + r.invalidStrategyName] = true;
      }
    }
    return result;
  };
  
  return {  simulateGame : simulateGame, 
            createStrategyString : createStrategyString, 
            parseStrategyString : parseStrategyString,
            findBestStrategy : findBestStrategy
  };
})();