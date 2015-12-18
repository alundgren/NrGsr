//Random nr 1 -> 1000
//Cannot guess a number that has already been guessed
function simulateGame(strategy1, strategy2, options) {
  //todo: dont alter s1 and s2 inputs
  if((typeof strategy1.f) === 'string') {
    strategy1.f = Function("g", strategy1.f)
  }
  if((typeof strategy2.f) === 'string') {
    strategy2.f = Function("g", strategy2.f)
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

QUnit.test("s1 begins the game", function( assert ) {
  var return42 = function () { 
    return 42; 
  };
  var options = {
    getCorrectNr : return42,
    logEnabled : true,
    n : 1000
  }
  var game = simulateGame({ f : return42, name : 's1' }, { f : return42, name : 's2' }, options);
  assert.ok(game.winnerName === 's1', game.log);
});

QUnit.test("duplicate guess result in loss", function( assert ) {
  var returnNumber = function (nr) { 
    return function () { return nr }; 
  };
  var options = {
    getCorrectNr : returnNumber(42),
    logEnabled : true,
    n : 1000
  }
  var game = simulateGame({ f : returnNumber(41), name : 's1' }, { f : returnNumber(41), name : 's2' }, options);
  assert.ok(game.winnerName === 's1' && game.isInvalidGuessWin === true, game.log);
});

QUnit.test("all nrs can be guessed", function( assert ) {
  var i = 1;
  
  var g = function () { 
    return i++;
  };
  var options = {
    getCorrectNr : function () { return 1000; },
    logEnabled : true,
    n : 1000
  }
  var game = simulateGame({ f : g, name : 's1' }, { f : g, name : 's2' }, options);
  assert.ok(game.winnerName === 's2' && game.isInvalidGuessWin === false && game.nrOfRounds === 1000, game.log);
});

QUnit.test("function string parsing works", function( assert ) {
  var options = {
    getCorrectNr : function () { return 4; },
    logEnabled : true,
    n : 1000
  }
  //btoa
  //atob
  var game = simulateGame({ f : 'return g.length+1', name : 's1' }, { f : 'return g.length+1', name : 's2' }, options);
  assert.ok(game.winnerName === 's2' && game.isInvalidGuessWin === false, game.log);    
});