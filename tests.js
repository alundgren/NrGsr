function randomIntFromInterval(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
}
  
function isIn(nr, arrayOfNrs) {
  for(var i=0; i< arrayOfNrs.length; i++) {
    if(arrayOfNrs[i] === nr) {
      return true;
    }      
  }
  return false;
}
//Random nr 1 -> 1000
//Cannot guess a number that has already been guessed
function simulateGame(strategy1, strategy2) {
  var guesses = [];
  var correctNr = randomIntFromInterval(1, 1000);
  var round = 1;
    
  var strats = [strategy1, strategy2];

  var game = {
    result : 0,
    log : []
  }
  
  while(round <= 1001) {
    var guess;
    var current;
    var other;

    current = strats[round%2];
    other = strats[1-(round%2)]; 

    guess = current.f(guesses.slice());

    if(isIn(guess, guesses) || guess < 1 || guess > 1000) {
      game.log.push(current.n + ': ' + guess + ' <-- INVALID');
      game.log.push('--' + other.n + ' wins --');
      //game.result = -stratNr;
      return game;
    } else if(guess === correctNr) {
      //game.result = stratNr;
      game.log.push('--' + strats[round%2].n + ' wins--');
      return game;
    } else {
      guesses.push(guess);
      game.log.push(current.n + ': ' + guess);
    }
    round = round + 1;
  }  
  game.log.push('--draw--');
  return game; //draw
}

function pickLowestPossible(g) {
  for(var i=1;i<=1000;i++) {
    if(!isIn(i, g)) {
      return i;
    }
  }
  throw "fail";
}

function pickRandom(g) {
  while(true) {
    var i = randomIntFromInterval(1, 1000);
    if(!isIn(i, g)) {
      return i;
    }
    return i;     
  }
}

QUnit.test( "hello test", function( assert ) {
  var game = simulateGame({ f : pickLowestPossible, n : 'pickLowestPossible' }, { f : pickRandom, n : 'pickRandom' });
  for(var i=0;i<game.log.length;i++) {
    console.log(game.log[i]);
  }
  assert.ok( 1 == "1", "Passed!" );
});