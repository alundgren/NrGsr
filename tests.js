function cap(s) {
    return nrGsr.parseStrategyString(nrGsr.createStrategyString(s));
}

QUnit.test("s1 begins the game", function( assert ) {
  var s = function () { return 41; }
  var options = {
    getCorrectNr : function () { return 41; },
    logEnabled : true,
    n : 1000
  }
  var game = nrGsr.simulateGame(s, s, options);
  assert.ok(game.winner === 1, game.log);
});

QUnit.test("function roundtripping works", function( assert ) {
  var f = cap('return { g : g, m : m, r : r };');
  var result = f(1, 2, 3);
  assert.ok(result.g === 1 && result.r === 2 && result.m === 3);
});

QUnit.test("findBest find the winner when always the same", function( assert ) {
  var options = {
    getCorrectNr : function () { return 42; },
    logEnabled : true,
    n : 1000
  }
  var s1 = cap('return 41;');
  var s2 = cap('return 42;');
  var result = nrGsr.findBestStrategy(s1, s2, options);
  assert.ok(result.wins[0] === 0 && result.wins[1] === 0 && result.wins[2] === 1000, result);
});