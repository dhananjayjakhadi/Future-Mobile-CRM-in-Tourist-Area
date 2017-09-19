angular.module('starter', ['ionic', 'starter.controllers'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "templates/login/loginPage.html",
            controller: "loginController"
        })
        .state('login2', {
            url: "/login2",
            templateUrl: "templates/login/loginPage.html",
            controller: "loginController"
        })
        .state('signUp', {
            url: "/signUp",
            templateUrl: "templates/login/signUpPage.html",
            controller: "signUpController"
        })
      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/menu.html",

      })

      .state('app.hotels', {
          cache: false,
          url: "/hotels",
          views: {
              'menuContent': {
                  templateUrl: "templates/hotels.html",
                  controller: "hotelsController"
              }
          }
      })

      .state('app.detailHotels', {
          url: "/detailHotels:name:images:phonenumber:distance",
          views: {
              'menuContent': {
                  templateUrl: "templates/detailsHotel.html",
                  controller: "detailHotelController"
              }
          }
      })
      .state('app.events', {
          cache: false,
          url: "/events",
          views: {
              'menuContent': {
                  templateUrl: "templates/events.html",
                  controller: "eventController"
              }
          }
      })

      .state('app.detailEvent', {
          url: "/detailEvent:eventname:eventDate:eventType:description:venue",
          views: {
              'menuContent': {
                  templateUrl: "templates/eventDetails.html",
                  controller: "detailEventController"
              }
          }
      })
      .state('app.attractions', {
          cache: false,
          url: "/attractions",
          views: {
              'menuContent': {
                  templateUrl: "templates/attractions.html",
                  controller: "attractionsController"
              }
          }
      })
      .state('app.holidays', {
          cache: false,
          url: "/holidays",
          views: {
              'menuContent': {
                  templateUrl: "templates/holidayList.html",
                  controller: "holidayController"
              }
          }
      })
      .state('app.emergency', {
          cache: false,
          url: "/emergency",
          views: {
              'menuContent': {
                  templateUrl: "templates/emergency.html",
                  controller: "emergencyController"
              }
          }
      })
      .state('app.holidayList', {
          url: "/holidayList:name:images:phonenumber:distance:description",
          views: {
              'menuContent': {
                  templateUrl: "templates/holidayListDetails.html",
                  controller: "detailHolidayController"
              }
          }
      })
      .state('app.detailAttractions', {
          url: "/detailAttractions:name:images:phonenumber:distance:description",
          views: {
              'menuContent': {
                  templateUrl: "templates/detailAttractions.html",
                  controller: "detailPlaceController"
              }
          }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});
