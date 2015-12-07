/**
 * My controller.
 * @param {!angular.$http} $http
 * @param {!my.app.GameService} GameService
 * @constructor
 * @export
 * @ngInject
 */
angular.module('GameContr', ['GameService']).controller('GameContr', ['$scope', 'game', 'GameService', function($scope, game, GameService) {
    $scope.game = game.game();
    $scope.selectedRow = 0;
    $scope.board = true;
    $scope.user = false;
    $scope.username1 = '';
    $scope.email1 = '';
    $scope.topScorer = [];

    $scope.modalShown = false;
    $scope.hideModal = function() {
        $scope.modalShown = !$scope.modalShown;
    };

    /** 
     *@desc StartAgain method start the new game.
     * It initialize the new game object and set few scoe variables
     **/

    $scope.StartAgain = function() {
        $scope.game = game.game();
        $scope.selectedRow = 0
        $scope.board = true;
        $scope.user = false;
        $scope.name = "";
        $scope.email = "";
        $scope.result = false;
        $scope.topscore = 0;
        $scope.yourrank = 0;
        $scope.topscore = 0;
        $scope.yourrank = 0;
        $scope.result = false;
    }

    /** 
     *@desc watch function check how many pairs are left .
     * If game.pair == 0 then it display the model window for asking the user info
     * its also check the selected row index value so that control should remain in grid area
     **/
    $scope.$watch('game.pairs', function() {
        /* if the @selectedRow is greater than the grid length then its value set to 0. */
        if ($scope.selectedRow >= $scope.game.grid.length) {
            $scope.selectedRow = 0

        }
        if ($scope.game.pairs == 0) {
            $scope.board = false;
            $scope.user = true;
            $scope.modalShown = true;

        }
    });



}]);