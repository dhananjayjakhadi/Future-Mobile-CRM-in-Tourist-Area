var app = angular.module('WebModule', ['restangular']);

app.config(['RestangularProvider', 'errorLoggerProvider', function (RestangularProvider,
    errorLoggerProvider) {
    RestangularProvider.setRestangularFields({
        id: '_id'
    });

    RestangularProvider.setErrorInterceptor(function (response, deferred, responseHandler) {
        //Can be used for extra processing of error messages 
        //all of the restangular messages will be caught in this place.
        if (response.status == 401) {
            window.localStorage.removeItem('token');
        }
    });
}]);

app.run(['Restangular',
    function (Restangular) {

        Restangular.setErrorInterceptor(
            function (response) {
                return true; // do not stop the promise chain
            }
        );
    }]);
app.factory('QuestionnaireUtility', ['$q', '$http', 'Restangular',
function ($q, $http, Restangular) {
    var questionnaireHelperService = {
        _pool: {},
        refreshCustomerDetails: function () {
            var pool = this._pool;
            // During URL validating, if success then Web API returns application and customer details.
            // Thus handling those details.
            //Restangular.setDefaultHeaders({ 'HSEQToken': window.localStorage.getItem('token') })
            var suiteDetails = Restangular.all('user').one('GetCustomer');
            var def = $q.defer();
            var customerApplicationDetailPromise = suiteDetails.get().then(function (successDetailsResponse) {
                pool = successDetailsResponse;
                def.resolve(successDetailsResponse);
                alert();
            }, function (errorDetailsResponse) {
                def.reject(errorDetailsResponse);
            });
            return def;
        },
        // Purpose is to validate the URL formed based on the details entered in the ToggleURL screen and
        // also store the details sent during validation process.
        loadSuiteDetails: function (cKey) {
            var pool = this._pool;
            // During URL validating, if success then Web API returns application and customer details.
            // Thus handling those details.
            Restangular.setDefaultHeaders({ 'HSEQToken': window.localStorage.getItem('token') })
            var suiteDetails = Restangular.all('suite').one('details/' + cKey);
            var def = $q.defer();
            var customerApplicationDetailPromise = suiteDetails.get().then(function (successDetailsResponse) {
                pool = successDetailsResponse;
                def.resolve(successDetailsResponse);
            }, function (errorDetailsResponse) {
                def.reject(errorDetailsResponse);
            });
            return def;
        },
        loadUserDetails: function () {
            var pool = this._pool;
            Restangular.setDefaultHeaders({ 'HSEQToken': window.localStorage.getItem('token') })
            var userDetails = Restangular.all('user').one('details/true');
            var def = $q.defer();
            var loadUserDetailsPromise = userDetails.get().then(function (successUserDetailResponse) {
                pool = successUserDetailResponse;
                def.resolve(successUserDetailResponse);
            }, function (errorUserDetailResponse) {
                def.reject(errorUserDetailResponse);
            });
            return def;
        },
        validateUser: function (userName, userPassword) {
            //Only method not called from Restangular uses basic $http service to connect to web api.
            //And hence error needs to be handled seperately will not be caught in 
            //the errorHandler in the run method defined above.

            var pool = this._pool;
            var url = Restangular.configuration.baseUrl + "/login";
            var def = $q.defer();

            var validatePromise = $http({
                method: 'POST', url: url, headers: {
                    'Authorization': 'Basic ' + btoa(userName + ":" + userPassword)
                }
            });

            validatePromise.then(function (successPayload) {
                pool = successPayload.headers('HSEQToken');
                def.resolve(successPayload);
            }, function (errorPayload) {
                def.reject(errorPayload);
            });
            return def;
        },
        loadAllActionPlanWizardForProblem: function () {
            return this._loadAllActionPlanWizard('problem');
        },
        loadAllActionPlanWizardForActionPlan: function () {
            return this._loadAllActionPlanWizard('actionplan');
        },
        loadAllWizardForCase: function (moduleName) {
            var token = window.localStorage.getItem('token');
            var pool = this._pool;
            //By defination $resource returns a promise which can then be furthur resolved.
            Restangular.setDefaultHeaders({ 'HSEQToken': token })
            var resourceCase = Restangular.all('case').one(moduleName);
            var def = $q.defer();

            resourceCase.get().
                then(function (successJsonResponse) {
                    def.resolve(successJsonResponse);
                }, function (errorResponse) {
                    //If the promise is un-successfull the $q.reject method will be used.
                    def.reject(errorResponse);
                });
            return def;
        },
        _loadAllActionPlanWizard: function (appArea) {
            var token = window.localStorage.getItem('token');
            var pool = this._pool;
            //By defination $resource returns a promise which can then be furthur resolved.
            Restangular.setDefaultHeaders({ 'HSEQToken': token })
            var resourceActionPlanWizard = Restangular.all('registration').one(appArea);
            var def = $q.defer();

            resourceActionPlanWizard.get().
                then(function (successJsonResponse) {
                    def.resolve(successJsonResponse);
                }, function (errorResponse) {
                    //If the promise is un-successfull the $q.reject method will be used.
                    def.reject(errorResponse);
                });
            return def;
        },
        loadAllQuestionnaires: function (moduleName) {
            var token = window.localStorage.getItem('token');
            var pool = this._pool;
            //By defination $resource returns a promise which can then be furthur resolved.
            Restangular.setDefaultHeaders({ 'HSEQToken': token })
            var resourceQuestionnaire = Restangular.all('questionnaire').one(moduleName);

            var def = $q.defer();
            var loadAllQuestionnairesPromise = resourceQuestionnaire.getList().then(function (successJsonResponse) {
                pool = successJsonResponse;
                def.resolve(successJsonResponse);
                return successJsonResponse;
            }, function (errorResponse) {
                //If the promise is un-successfull the $q.reject method will be used.
                def.reject(errorResponse);
            });
            return def;
        },
        postPersonQuestionnaire: function (pq) {
            var token = window.localStorage.getItem('token');
            //By defination $resource returns a promise which can then be furthur resolved.
            Restangular.setDefaultHeaders({ 'HSEQToken': token })

            var resourceQuestionnaire = Restangular.all('questionnaire/apv');
            var postPromise = resourceQuestionnaire.post(pq);
            return postPromise;
        },
        postPersonActionPlanWizard: function (pApw) {
            var token = window.localStorage.getItem('token');
            //By defination $resource returns a promise which can then be furthur resolved.
            Restangular.setDefaultHeaders({ 'HSEQToken': token })
            //Post with problem or action plan sending the entire request and then based on the 
            //typecode perform a save that is decide whether problem/actionplan
            var resourceApw = Restangular.all('registration/problem');
            var postPromise = resourceApw.post(pApw);
            return postPromise;
        },
        postPersonAskadeWizard: function (pAkEntity) {
            var token = window.localStorage.getItem('token');
            Restangular.setDefaultHeaders({ 'HSEQToken': token })
            //Posting a person askade wizard.
            var postAk = Restangular.all('case/askade');
            var postPromise = postAk.post(pAkEntity);
            return postPromise;
        },
        postPersonClaimWizard: function (pClaimEntity) {
            var token = window.localStorage.getItem('token');
            Restangular.setDefaultHeaders({ 'HSEQToken': token })
            //Posting a person claim wizard.
            var postClaim = Restangular.all('case/claim');
            var postPromise = postClaim.post(pClaimEntity);
            return postPromise;
        },
        // This method interacts makes a call to Web API to know if a user token is valid or not
        // This method is called before making an actual request to Web API.
        validateToken: function () {
            var def = $q.defer();

            try {
                Restangular.setDefaultHeaders({
                    'HSEQToken': window.localStorage.getItem('token')
                });

                var validateHSEQToken = Restangular.all('user').one('validatetoken');
                validateHSEQToken.get().then(function (validToken) {
                    def.resolve(true);
                }, function (inValidToken) {
                    def.reject(false);
                }, function (errNew) {
                    console.log(errNew);
                });
            } catch (e) {
                console.log(e);
                def.reject(false);
            }
            return def.promise;
        },
        reset: function () {
            this._pool = {};
        },
    };
    return questionnaireHelperService;
}]);