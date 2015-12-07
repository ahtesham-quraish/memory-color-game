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