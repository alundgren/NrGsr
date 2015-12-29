var app = angular.module('app', ['ui.bootstrap', 'ngAnimate']);
app.directive('preventDefault', function ($window) {
    return function (scope, element, attrs) {
        element.bind('click', function (event) {
            event.preventDefault();
        });
    };
});
app.controller('ctr', function ($scope, $window) {
    $scope.strats = [
        { title:'Strategy 1', active : true },
        { title:'Strategy 2' }
    ];
    $scope.tabNr = 1;

    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    
    if(localStorage.code1) {
        $scope.strats[0].content = localStorage.code1; 
    } else {
        $scope.strats[0].content = 'if(!m.lastGuess) { m.lastGuess = 1; } else { m.lastGuess = m.lastGuess + 1; } return m.lastGuess;';
    }
    if(localStorage.code2) {
        $scope.strats[1].content = localStorage.code2;
    } else {
        $scope.strats[1].content = 'if(!m.lastGuess) { m.lastGuess = 1000; } else { m.lastGuess = m.lastGuess - 1; } return m.lastGuess;';
    }        
    
    editor.setValue($scope.strats[$scope.tabNr-1].content);
    
    //TODO: Make the editor work with the tabs so the fake tabs hack isnt needed
    //TODO: Autosave
    
    $scope.onSelectTab = function(tabNr) {
        var previousTabNr = $scope.tabNr; 
        $scope.tabNr = tabNr;
        
        if(previousTabNr <= 2){
            $scope.strats[previousTabNr-1].content = editor.getValue()
            if(previousTabNr === 1) {
                localStorage.code1 = $scope.strats[0].content
            } else {
                localStorage.code2 = $scope.strats[1].content
            }
        }
        
        if(tabNr === 1 || tabNr === 2) {
            editor.setValue($scope.strats[$scope.tabNr-1].content)
        }
    }
    
    $scope.fight = function () {
        $scope.simResult = null;
        var s1 = nrGsr.parseStrategyString(nrGsr.createStrategyString($scope.strats[0].content));
        var s2 = nrGsr.parseStrategyString(nrGsr.createStrategyString($scope.strats[1].content));
        var r = nrGsr.findBestStrategy(s1, s2);
        
        $scope.simResult = {
            log :[]
        }
        $scope.simResult.log.push('Strategy 1 wins: ' + Math.round(100 * r.wins[1] / r.nrOfGames, 1).toFixed(1) + '%');
        $scope.simResult.log.push('Strategy 2 wins: ' + Math.round(100 * r.wins[2] / r.nrOfGames, 1).toFixed(1) + '%');
        if(r.wins[0] > 0) {
            $scope.simResult.log.push('Note! There were ' + Math.round(100 * r.wins[0] / r.nrOfGames, 1).toFixed(1) + '% draws meaning even after many rounds no winner was found.');
        }
    }
    
    $scope.simulateGame = function () {
        $scope.playResult = null;
        var s1 = nrGsr.parseStrategyString(nrGsr.createStrategyString($scope.strats[0].content));
        var s2 = nrGsr.parseStrategyString(nrGsr.createStrategyString($scope.strats[1].content));            
        var c1 = { f : s1, m : {}, name : 'player 1', nr : 1 }
        var c2 = { f : s2, m : {}, name : 'player 2', nr : 2 }
        if(Math.random() < 0.5) {
            var tmp = c2;
            c2 = c1;
            c1 = tmp;
        }
        var r = nrGsr.simulateGame(c1, c2, { logEnabled : true});
        $scope.playResult = {
            log :r.log
        }
    }
});