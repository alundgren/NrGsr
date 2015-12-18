QUnit.test("s1 begins the game", function( assert ) {
  var s1 = nrGsr.createStrategyString({ f : 'return 41', name : 's1' });
  var s2 = nrGsr.createStrategyString({ f : 'return 41', name : 's2' });
  var options = {
    getCorrectNr : function () { return 41; },
    logEnabled : true,
    n : 1000
  }
  var game = nrGsr.simulateGame(s1, s2, options);
  assert.ok(game.winnerName === 's1', game.log);
});

QUnit.test("duplicate guess result in loss", function( assert ) {
  var s1 = nrGsr.createStrategyString({ f : 'return 41', name : 's1' });
  var s2 = nrGsr.createStrategyString({ f : 'return 41', name : 's2' });
  var options = {
    getCorrectNr : function () { return 42; },
    logEnabled : true,
    n : 1000
  }
  var game = nrGsr.simulateGame(s1, s2, options);
  assert.ok(game.winnerName === 's1' && game.invalidStrategyName === 's2', game.log);
});

QUnit.test("all nrs can be guessed", function( assert ) {
  var f = 'if(g.length === 0) { return 1; } else { return g[g.length-1]+1; }';
  var s1 = nrGsr.createStrategyString({ f : f, name : 's1' });
  var s2 = nrGsr.createStrategyString({ f : f, name : 's2' });
  
  var options = {
    getCorrectNr : function () { return 1000; },
    logEnabled : true,
    n : 1000
  }
  var game = nrGsr.simulateGame(s1, s2, options);
  assert.ok(game.winnerName === 's2' && game.nrOfRounds === 1000, game.log);
});

QUnit.test("strat roundtripping works", function( assert ) {
  var ss = nrGsr.createStrategyString({name: 'test 123', f: 'return g[1]+1;'});
  var s = nrGsr.parseStrategyString(ss);
  assert.ok(s.name === 'test 123' && s.f([1, 2]) === 3)
});

QUnit.test("findBest find the winner when always the same", function( assert ) {
  var options = {
    getCorrectNr : function () { return 42; },
    logEnabled : true,
    n : 1000
  }
  var s1 = nrGsr.createStrategyString({ name : 's1', f : 'return 41;' });
  var s2 = nrGsr.createStrategyString({ name : 's2', f : 'return 42;' });
  var result = nrGsr.findBestStrategy(s1, s2, options);
  assert.ok(result['_wins_s2'] === 1000 && result['_wins_s1'] === 0, result)
});