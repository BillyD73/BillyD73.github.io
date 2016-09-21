/*Adam Fielding's angular controller for the github repo page */
angular.module('app')
    .controller('MainController', ['$scope', 'github', '$location', function($scope, github, $location) {

        repos = [];
        pageNumber = 1;
        repoLocation = "https://api.github.com/orgs/WASdev/repos";





        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.2/modernizr.js"></script>

        //paste this code under the head tag or in a separate js file.
        	// Wait for window load
        	$(window).load(function() {
        		// Animate loader off screen
        		$(".se-pre-con").fadeOut("slow");;
        	});





        //set the filter to the variable in the Url
        var path = $location.path();
        $scope.myFilter = path.slice(1);

       //set the url path to the filter
        $scope.click = function(filter) {
            $location.path(filter);
        };

        // set the filter to the path of the url
        $scope.$on('$locationChangeSuccess', function(event) {
            var path = $location.path();
            $scope.myFilter = path.slice(1);
            console.log($scope.myFilter);
        });

        //sorting function and variables
        $scope.sortType = '-repositoryData.pushed_at'
        $scope.reverseSort = false

        $scope.changeSortType = function(sortType) {
            $scope.sortType = sortType;
        }

        $scope.changeOrder = function() {
            $scope.reverseSort = !$scope.reverseSort;
        }

        //code for filtering based on tags in the repository

        //array holding the unique filters generated from the tags and the prefixes
        $scope.arrayOfFilters = [];
        //arrays used to hold the filters until they are pushed into the data array by index
        arrayOfPrefixes = [];
        arrayOfTags = [];

        //array holding the repo data and each repos filters
        $scope.arrayOfFiltersAndData = [];
        //array holding the arrayOfFiltersAndData
        $scope.masterArrayOfFiltersAndData = [];

        // code for filtering based on prefix in the repository name
        generateFilters = function() {
          console.log(Date.now());
            angular.forEach(repos, function(repo, index) {
                //get the prefix
                var firstPeriodLocation = repo.name.indexOf(".");
                var prefix = repo.name.substr(0, firstPeriodLocation);

                //change the prefixes to more user readable names
                switch (prefix) {
                    case "sample":
                        prefix = "samples";
                        break;
                    case "ci":
                        prefix = "continuous integration";
                        break;
                    case "lib":
                        prefix = "libraries";
                        break;
                    case "tool":
                        prefix = "tools";
                        break;
                    }

                    if (repo.name.indexOf("docker") > -1)
                    {
                      prefix="docker";
                    }

            //Add all prefixes to array of prefixes, to then later be pushed to arrayOfFiltersAndData
            arrayOfPrefixes.push(prefix);
            //if the prefix is unique, add to array of prefixes
            if ($scope.arrayOfFilters.indexOf(prefix) == -1)
                $scope.arrayOfFilters.push(prefix);
            });
        }

        //code for filtering based on tags in the repository
        generateTags = function() {
            angular.forEach(repos, function(repo, index) {
                //split the descriptions into individual words
                if (repo.description==undefined){
                  repo.description == null;
                }
                if ((repo.description!==null) && (repo.description!==undefined)){
                var arrayOfWords = repo.description.split(' ');}

                angular.forEach(arrayOfWords, function(word, wordIndex) {
                    //check each word to see if it begins with a hash
                    if (word.indexOf("#") > -1) {
                        //push to array containing all the tags
                        arrayOfTags[index] = word;

                        //push the tag to the array of filters, only if unique
                        if ($scope.arrayOfFilters.indexOf(word) == -1) {
                            $scope.arrayOfFilters.push(word);
                        }
                    }
                });
                arrayOfWords = [];
            });
        }


        //code for creating the arrayOfFilteresAndData Object, used by the directives
        pushToArray = function() {
            angular.forEach(arrayOfPrefixes, function(prefix, index) {
                var tags = [];
                //add prefix to tags
                tags.push(prefix);
                //if tag is not null, add to tags
                if (arrayOfTags[index] != null) {
                    tags.push(arrayOfTags[index])
                }
                arrayOfFilteresAndData = {tags: tags, repositoryData: repos[index]};

                //add to master array
                $scope.masterArrayOfFiltersAndData.push(arrayOfFilteresAndData);
            });
        }

        //getting the data
        getAllGitHubData = function() {
            url = repoLocation + "?per_page=100&page=" + pageNumber;
            if (location.search == "?test")
            //if (location.search && location.search == "?test") not nuLL +
            {
              url = "https://raw.githubusercontent.com/BillyD73/billyd73.github.io/master/test.json";
            }
            if (location.search == "?official")
            {
              url = "https://raw.githubusercontent.com/BillyD73/billyd73.github.io/master/official.json";
            }
            github.getGitHubData(url, function(response) {
                repos = repos.concat(response.data);
                if (location.search == null){
                //if ((url!= "https://raw.githubusercontent.com/BillyD73/billyd73.github.io/master/test.json") || (url1= "https://raw.githubusercontent.com/BillyD73/billyd73.github.io/master/official.json"))
                //{
                if (response.headers('link').indexOf("next") >= 0){
                    pageNumber = pageNumber + 1;
                    getAllGitHubData();
                }
               else {
                  //  pushToArray();
                    generateFilters();
                    generateTags();
                    pushToArray();
                    //console.log(repos.length);

                }
            //}
          }
            else {
            //  pushToArray();
              generateFilters();
              generateTags();
              pushToArray();
            }
          });
        }

        getAllGitHubData();




}]);
