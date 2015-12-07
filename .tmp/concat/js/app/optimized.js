/** 
 *@desc Constructor method for card object
 * it initialize the two properties @color and @state.
 **/
function Card(color) {
    this.color = color;
    this.state = false;

}
/** 
 *@desc This method flip the state of card.
 **/
Card.prototype.flip = function() {
    this.state = !this.state
}

/** 
 *@desc Create the array of cards object.
 * Each color has two objects and retrun the @cards array.
 **/
createPackCards = function(colors) {
    var cards = [];
    colors.forEach(function(color) {
        cards.push(new Card(color));
        cards.push(new Card(color));

    });
    return cards;

}

/** 
 *@desc Shuffle the array of @cards. 
 **/

function shuffle(array) {
    var i = 0,
        j = 0,
        temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

/** 
 *@desc This @Game class basically takes the @colors array.
 * Call the @createPackCards method to create the cards deck.
 * Then call the @shuffle method to shuffle the @cards.
 **/
function Game(colors) {
    this.pairs = 8;
    var cards = createPackCards(colors);
    this.grid = shuffle(cards)
    this.score = 0;
    this.color = 'nothing';

    this.flipCard = function(card) {
            if (card.state) {
                return;
            }
            card.flip();
            if (!this.firstcard || this.secondcard) {
                if (this.secondcard) {
                    /* if the user pick the two cards with diff color then both cards are faced down*/
                    /*  and score is decreamented */
                    this.firstcard.flip();
                    this.secondcard.flip();
                    this.firstcard = undefined;
                    this.secondcard = undefined;
                    this.score--;

                }
                this.firstcard = card;

            } else {
                /* if the user first and second pick is same then score is increamented and pair is decreamented */
                /* matching cards are removed from the grid and grid is shuffled again*/
                if (this.firstcard.color == card.color) {
                    wait(500);
                    this.firstcard = undefined;
                    this.secondcard = undefined;
                    this.score++;
                    this.pairs--
                        this.color = card.color;
                    removeCard(this.grid, card.color)
                    return;



                } else {
                    this.secondcard = card;
                }
            }

        }
        /** 
         *@desc This method takes the @cards array and $color value to be removed .
         **/
    function removeCard(cards, color) {

        var tester = false;
        var firstcard = undefined;
        var secondcard = undefined;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].color === color) {
                if (!firstcard) {
                    firstcard = i
                } else {
                    secondcard = i
                }
            }

        }

        /* if cards those are being removed are adjacency then if is run otherwise else part is run*/
        if (firstcard + 1 === secondcard) {
            cards.splice(firstcard, 2);
        } else {
            cards.splice(firstcard, 1);
            cards.splice(secondcard - 1, 1);
        }


    }

    function wait(ms) {
        var d = new Date();
        var d2 = null;
        do {
            d2 = new Date();
        }
        while (d2 - d < ms);
    }




}
 /** 
  *@desc This custom directive is used to control the game play.
  * @selectedRow vairable is set to zero index and then change accordingly the  key move events
  **/
 angular.module('arrowSelector', []).directive('arrowSelector', ['$document', function($document) {
     return {
         restrict: 'A',
         link: function(scope, elem, attrs, ctrl) {
             var elemFocus = false;
             $document.bind('keydown', function(e) {
                 if (!elemFocus) {
                     if (e.keyCode == 37) {
                         if (scope.selectedRow == 0) {
                             return;
                         }
                         scope.selectedRow--;
                         scope.$apply();
                         e.preventDefault();
                     }
                     if (e.keyCode == 38) {
                         if (scope.selectedRow == 0 || scope.selectedRow < 4) {

                             return;
                         }
                         scope.selectedRow = scope.selectedRow - 4;
                         scope.$apply();
                         e.preventDefault();
                     }
                     if (e.keyCode == 39) {
                         if (scope.selectedRow == scope.game.grid.length - 1) {
                             return;
                         }
                         scope.selectedRow++;
                         scope.$apply();
                         e.preventDefault();
                     }
                     if (e.keyCode == 40) {
                         if (scope.selectedRow + 4 >= scope.game.grid.length) {

                             return;
                         }
                         scope.selectedRow = scope.selectedRow + 4;
                         scope.$apply();
                         e.preventDefault();
                     }
                     if (e.keyCode == 13) {
                         scope.game.flipCard(scope.game.grid[scope.selectedRow])
                         scope.$apply();
                         e.preventDefault();

                     }
                 }
             });
         }
     };
 }]);

 /** 
  *@desc t.
  * This custom directive is used to display the final result card. 
  **/
 angular.module('finalResult', []).directive('finalResult', [function() {
     var directive = {};
     directive.restrict = 'E'; /* restrict this directive to elements */
     directive.templateUrl = 'partials/result.html';
     directive.link = function($scope, $element, $attrs) {}
     return directive;
 }]);

 /** 
  *@desc It will display the model for user info form that requires
  * the user name and its email. so after submit the form gameService is used to send
  * the post ajax request to server. The server responds with json object that contain the top five scoror list and 
  * user postion in overall game.
  * 
  **/

 angular.module('modalDialog', ['GameService']).directive('modalDialog', ['GameService', function(GameService) {
     return {
         restrict: 'EA',
         scope: {
             show: '='
         },
         link: function(scope, element, attrs) {
             scope.submitForm = function() {
                 scope.$parent.submitForm();
             }

             /** 
              *@desc Check the username and its email then makes the json object.
              * Then it calls the game service method to @saveResult to save the user info
              * on the server and on success its display the final result. 
              **/
             scope.submitForm = function() {
                     if (scope.username1 != '' && scope.email1 != '') {
                         var param = ({
                             name: scope.username1,
                             email: scope.email1,
                             score: scope.$parent.game.score
                         });

                         scope.$parent.modalShown = false;
                         /* @GameService to hit the server for saving the user data*/
                         GameService.saveResult(param).then(
                             function(data) {
                                 /* you ranking variable @youranking is set to value that returned from server*/
                                 scope.$parent.yourrank = data.yourranking;
                                 scope.$parent.topScorer = data.topScorer;
                                 scope.$parent.result = true;
                             },
                             function(errorMessage) {
                                 console.log(errorMessage)

                             }
                         )


                     }

                 }
                 /* display and hide the model window according to the user command. */
             scope.dialogStyle = {};
             if (attrs.width)
                 scope.dialogStyle.width = attrs.width;
             if (attrs.height)
                 scope.dialogStyle.height = attrs.height;
             scope.hideModal = function() {
                 scope.show = false;
             };
         },
         templateUrl: "partials/modal.html"

     };
 }]);
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
'use strict';
/* Application Service */


angular.module('GameService', []).service('GameService', ['$http', '$q', function($http, $q) {

    /** 
     *@desc Expose the public methods. that will be used to hit the server.
     **/
    return ({
        saveResult: saveResult
    });

    function saveResult(data) {
        console.log(JSON.stringify(data))
        var request = $http({
            method: "post",
            url: "index.php/addresult",
            data: JSON.stringify(data)
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        /** The API response from the server should be returned in a
         * nomralized format. However, if the request was not handled by the
         * server (or what not handles properly - ex. server error), then we
         *  may have to normalize it on our end, as best we can.
         **/
        if (!angular.isObject(response.data) ||
            !response.data.message
        ) {
            return ($q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));
    }

    /** I transform the successful response, unwrapping the application data
     * from the API response payload.
     **/
    function handleSuccess(response) {
        return (angular.fromJson(response.data));
    }


}]);
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