/* Application Level modules */
var gameApp = angular.module('gameApp', ['GameContr', 'GameService', 'arrowSelector', 'finalResult', 'modalDialog']);

/* gameApp factory*/
gameApp.factory('game', function() {
    var color = ['Red', 'Green', 'Blue', 'Pink', 'Ornage', 'White', 'Yellow', 'Purple'];
    /** 
     *@desc expose the game method to outer world that
     * actully return the @Game object.
     * It takes the color array.
     **/
    return {
        game: function() {
            return new Game(color);
        } 
    }
});