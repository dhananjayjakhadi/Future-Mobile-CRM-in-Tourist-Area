var app = angular.module('DBStorage', ['lokijs']);

app.constant("MobileConfig", {
    DatabaseName: 'OfflineDb',
    AdapterName: 'DBStorageAdapter',
});

app.factory('DBStorageUtility', ['Loki', '$ionicPlatform', 'MobileConfig', '$rootScope',
    function (Loki, $ionicPlatform, MobileConfig, $rootScope) {
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
        }

        var dbStorage = {
            OfflineStorage: null,
            Adapter: null,
            DbLoaded: false,
            initializeLocalStorage: function () {
                var thisScope = this;
                $ionicPlatform.ready(function () {

                    var offlineDb = new loki(MobileConfig.DatabaseName, { autosave: false });
                    thisScope.OfflineStorage = offlineDb;
                    offlineDb.loadDatabase({}, function () {
                        var testInititalized = offlineDb.getCollection('LoginTable');

                        if (testInititalized === null) {
                            thisScope.createTables();
                            offlineDb.saveDatabase(function () {
                                thisScope.DbLoaded = true;
                                $rootScope.$broadcast('DbCommand', { Command: 'DatabaseLoaded' });
                            });
                        }
                        else {
                            thisScope.DbLoaded = true;
                            $rootScope.$broadcast('DbCommand', { Command: 'DatabaseLoaded' });
                        }
                    });
                });
            },
            initialize: function () {
                return this.initializeLocalStorage();
            },
            createTables: function () {
                var offlineDb = this.OfflineStorage;

                var loginTableColl = offlineDb.addCollection('LoginTable');

                if (loginTableColl === null) {
                    loginTableColl.insert({
                        Id: null, userName: null, firstName: null, lastName: null, mailId: null, 
                        password: null,
                    });
                    loginTableColl.removeDataOnly();
                }
            },
            insertLoginTable: function (loginData) {
                var offlineDb = this.OfflineStorage;

                var loginTableColl = offlineDb.getCollection('LoginTable');

                var loginTableDataExists = loginTableColl.findOne({ 'userName': { '$eq': loginData.UserName } });

                if (loginTableDataExists === null) {
                    var data = {
                        Id: guid(),
                        userName: loginData.UserName,
                        firstName: loginData.FirstName,
                        lastName: loginData.LastName,
                        mailId: loginData.MailId,
                        password: loginData.Password
                    }

                    loginTableColl.insert(data);
                } else {
                    return false;
                }

                offlineDb.saveDatabase(function () {
                    //Stuff to do after the save to local storage.
                });
            },
            checkUserNameExists: function (userName) {
                var offlineDb = this.OfflineStorage;

                var loginTableColl = offlineDb.getCollection('LoginTable');

                var loginTableDataExists = loginTableColl.findOne({ 'userName': { '$eq': userName } });

                if (loginTableDataExists === null) {
                    return true;
                } else {
                    return false;
                }
            },
            validateUserNamePassword: function (userName, password) {
                var offlineDb = this.OfflineStorage;

                var loginTableColl = offlineDb.getCollection('LoginTable');

                var loginTableDataExists = loginTableColl.findOne({ '$and': [{ 'userName': { '$eq': userName } }, 
                    { 'password': { '$eq': password } }]
                });

                if (loginTableDataExists !== null) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return dbStorage;
    }
]);