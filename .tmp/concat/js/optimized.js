function Card(color){
    this.color = color;
    this.state = false;

}

Card.prototype.flip = function(){
    this.state = !this.state
}

createPackCards = function(colors){
    var cards = [];
    colors.forEach(function(color){
        cards.push(new Card(color));
        cards.push(new Card(color));
    
    });
    console.log(cards.length)
    return cards;

}

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
 return array    
}    

function Game(colors){
    this.pairs = 8
    var cards = createPackCards(colors);
    
    this.grid = shuffle(cards)
    this.score = 0;
    
    this.flipCard = function(card) {
        if (card.state) {
          return;
        }
        card.flip();
        if(!this.firstcard || this.secondcard ){
            if(this.secondcard){
            this.firstcard.flip();
            this.secondcard.flip();
            this.firstcard = undefined;
            this.secondcard = undefined;
            this.score--;    
            
            }
            this.firstcard = card;
        
        }
        else{
            if(this.firstcard.color == card.color){
                this.firstcard = undefined;
                this.secondcard = undefined;
                this.score++;
                this.pairs--
                removeCard(this.grid, card.color);
                this.grid = shuffle(cards)
            }
            else{
                this.secondcard = card;   
            }
        }
    }
    
    function removeCard(cards, color){
        var tester = false;
        var firstcard = undefined;
        var secondcard = undefined;
        for (var i = 0 ; i < cards.length ; i++) {
            if(cards[i].color === color){
            if(!firstcard){
                firstcard = i
                }
             else{
                secondcard = i
             }    
            }
        }
        
      
              if( firstcard +1 === secondcard  ) {
                cards.splice(firstcard,2);
            }
            else{
                cards.splice(firstcard,1);
                cards.splice(secondcard-1,1);
            }
       
          
        }
            
    
    


}
angular.module('arrowSelector',[]).directive('arrowSelector',['$document',function($document){
	return{
		restrict:'A',
		link:function(scope,elem,attrs,ctrl){
			var elemFocus = false;             
			$document.bind('keydown',function(e){
				if(!elemFocus){
					if(e.keyCode == 37){
						if(scope.selectedRow == 0){
							return;
						}
						scope.selectedRow--;
						scope.$apply();
						e.preventDefault();
					}
					if(e.keyCode == 38){
						if(scope.selectedRow == 0 || scope.selectedRow < 4 ){
                            
							return;
						}
						scope.selectedRow = scope.selectedRow - 4 ;
						scope.$apply();
						e.preventDefault();
					}
                    if(e.keyCode == 39){
						if(scope.selectedRow == scope.game.grid.length - 1){
							return;
						}
						scope.selectedRow++;
						scope.$apply();
						e.preventDefault();
					}
					if(e.keyCode == 40){
						if(scope.selectedRow + 4 >= scope.game.grid.length){
                            
							return;
						}
						scope.selectedRow = scope.selectedRow + 4;
						scope.$apply();
						e.preventDefault();
					}
                    if(e.keyCode == 13){
                        scope.game.flipCard(scope.game.grid[scope.selectedRow]);
						scope.$apply();
						e.preventDefault();
                                        
					}
				}
			});
		}
	};
}]);
angular.module('finalResult',[]).directive('finalResult', [function() {
    var directive = {};
    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = 'partials/result.html';
    directive.link = function($scope, $element, $attrs) { }
    return directive;
}]);

angular.module('modalDialog',['GameService']).directive('modalDialog',['GameService', function(GameService) {
  return {
    restrict: 'EA',
    scope: {
      show: '='   
    },
    link: function(scope, element, attrs) {
    scope.submitForm = function () {
      scope.$parent.submitForm();
   } 
      scope.submitForm = function(){
        if(scope.username1 !='' && scope.email1 !=''){
            var param = ({name:scope.username1 , email:scope.email1, score:scope.$parent.game.score});
            
            GameService.saveResult(param).then(
                function(data){
                   
                   scope.$parent.yourrank = data.yourranking;
                   scope.$parent.result = true;
                   scope.$parent.modalShown = false;
                   scope.$parent.topScorer = data.topScorer;
                    
                   console.log(scope)    
                },
                function(errorMessage){console.log(errorMessage)
                                      
                }
            )
            
        
        }
    
    }
     
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
        scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl : "partials/modal.html"  
    //template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div><input type='text' ng-model='abc'></div></div>"
  };
}]);


/* Application Controllers */


angular.module('GameContr', ['GameService']).controller('GameContr',['$scope', 'game','GameService', function($scope, game,GameService){
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
    
    $scope.StartAgain = function(){
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
    
     $scope.$watch('game.pairs', function() {
       if($scope.selectedRow >= $scope.game.grid.length){
            $scope.selectedRow = 0
       
       }
        if($scope.game.pairs==0){
           $scope.board = false;
           $scope.user = true;
           $scope.modalShown = true;        
        
        } 
   });
    
   $scope.submitForm = function () {
        console.info($scope);
   }    
    
    
}]);
'use strict';
/* Application Controllers */


angular.module('GameService', []).service('GameService',['$http', '$q', function($http, $q) {

    return ({
        saveResult: saveResult
            // getFriends: getFriends,
            //removeFriend: removeFriend
    });

    function saveResult(data) {console.log(JSON.stringify(data))
        var request = $http({
            method: "post",
            url: "api/addResult",
            data: JSON.stringify(data)
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (!angular.isObject(response.data) ||
            !response.data.message
        ) {
            return ($q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));
    }

    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess(response) {
        return (angular.fromJson(response.data));
    }


}]);

/* Application Controllers */


var gameApp = angular.module('gameApp', ['GameContr','GameService','arrowSelector','finalResult','modalDialog']);

gameApp.factory('game', function() {
  var color = ['Red', 'Green', 'Blue', 'Pink', 'Ornage', 'White',
    'Yellow', 'Purple'];

  return {
      game : function(){
        return new Game(color);
   }
 }
});

