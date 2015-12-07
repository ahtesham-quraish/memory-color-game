'use strict';
/* Application Service */


angular.module('GameService', []).service('GameService', ['$http', '$q', function($http, $q) {

    /** 
     *@desc Expose the public methods. that will be used to hit the server.
     **/
    return ({
        saveResult: saveResult,
        test : test
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
    function test() {
        var request = $http({
            method: "get",
            url: "index.php/test"
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