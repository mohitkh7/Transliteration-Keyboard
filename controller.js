var app = angular.module('app', []);
app.controller('transliter', function($scope, $http, $window) {
    const URL = "http://146.148.85.67/processWordJSON";
    var defaultLang = "hindi";
    var cache = {};
    $scope.languageArr = ["hindi", "tamil", "telugu", "bengali", "gujarati", "marathi", "kannada", "malayalam", "punjabi", "nepali"];
    $scope.language = $window.localStorage.getItem('language') || defaultLang;
    $scope.showError = false;

    // fetch the transiltion suggestions for current typing word
    $scope.getSuggestions = function() {
        var arr = $scope.text.split(" ");
        var word = arr.pop();
        $scope.showError = false;
        if (word == "" || word == null){
            // do nothing
            $scope.suggestionArr = [];
        }
        else if (word in cache){
            $scope.suggestionArr = cache[word];
        }
        else{
            $http({
                url: URL,
                method: "GET",
                params: {inString: word, lang:$scope.language}
            })
            .then(function(resp){
                cache[word] = resp["data"]["twords"][0]["options"];
                $scope.updateSuggestions();
            }, function(err){
                $scope.suggestionArr = [];
                $scope.showError = true;
                console.log("Error occured while fetching word suggestions");
            });
        }
    };

    $scope.updateSuggestions = function(){
        var arr = $scope.text.split(" ");
        var word = arr.pop();
        $scope.suggestionArr = cache[word];
    };


    // replace last word in text with transilted word
    $scope.changeWord = function(newWord) {
        var arr = $scope.text.split(" ");
        arr.pop();
        arr.push(newWord + " ");
        $scope.text = arr.join(" ");
        // focus back on text area
        document.getElementById("text").focus();
        // clears suggestions
        $scope.suggestionArr = [];
    };

    $scope.langChange = function() {
        $window.localStorage.setItem('language', $scope.language);
    }

    $scope.clearText = function() {
        $scope.text = "";
    }

    $scope.copyText = function() {
        let copyText = document.getElementById("text");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }
});