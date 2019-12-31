var app = angular.module('app', []);
app.controller('transliter', function($scope, $http, $window) {
    const URL = "http://146.148.85.67/processWordJSON";
    var defaultLang = "hindi";
    var cache = {};
    $scope.languageArr = ["hindi", "tamil", "telugu", "bengali", "gujarati", "marathi", "kannada", "malayalam", "punjabi", "nepali"];
    $scope.language = $window.localStorage.getItem('language') || defaultLang;
    $scope.showError = false;
    $scope.flag = false;

    // fetch the transiltion suggestions for current typing word
    $scope.getSuggestions = function() {
        var word = $scope.getLastWord();
        // console.log(word);
        var cacheKey = word + "-" + $scope.language;
        $scope.showError = false;

        if (word == "" || word == null){
            // do nothing
            $scope.suggestionArr = [];
        }
        else if (cacheKey in cache){
            $scope.suggestionArr = cache[cacheKey];
        }
        else{
            $http({
                url: URL,
                method: "GET",
                params: {inString: word, lang:$scope.language}
            })
            .then(function(resp){
                cache[cacheKey] = resp["data"]["twords"][0]["options"];
                $scope.updateSuggestions();
            }, function(err){
                $scope.suggestionArr = [];
                $scope.showError = true;
                console.log("Error occured while fetching word suggestions");
            });
        }
    };

    $scope.updateSuggestions = function(){
        $scope.flag = true;
        let word = $scope.getLastWord();
        var cacheKey = word + "-" + $scope.language;
        $scope.suggestionArr = cache[cacheKey];
    };


    // replace last word in text with transilted word
    $scope.changeWord = function(newWord) {
        var word = $scope.getLastWord();
        $scope.text = $scope.text.substring(0, $scope.text.lastIndexOf(word));

        $scope.text += newWord + " ";
        // focus back on text area
        document.getElementById("text").focus();
        // clears suggestions
        $scope.suggestionArr = [];
    };

    // fetch the last word from current text
    $scope.getLastWord = function() {
        let matchArr = $scope.text.match(/\s/g) || [];
        let index = $scope.text.lastIndexOf(matchArr[matchArr.length - 1])
        return $scope.text.substring(index + 1, );
    }

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