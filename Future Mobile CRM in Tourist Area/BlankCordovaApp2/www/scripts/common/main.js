var app = angular.module('starter.controllers');

app.run(function (DBStorageUtility, $ionicPlatform) {
    $ionicPlatform.ready(function () {
        DBStorageUtility.initialize();
    });
});