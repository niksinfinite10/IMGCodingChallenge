'use strict';

/**
 * @ngdoc function
 * @name imgcoddingChallangeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the imgcoddingChallangeApp
 */
angular.module('imgcoddingChallangeApp')
.factory('vendingMachine', function() {
	return {
    getValidCoins:function(){
      return {nickel:{value:0.05,weight:5.00,diameter:21.21},
              dime:{value:0.10,weight:2.26,diameter:17.91},
              quarter:{value:0.25,weight:5.67,diameter:24.26}};
    },

    getProducts:function(){
       return [
           {
              "name":"cola",
              "price":1.00,
              "qty":10
           },
           {
              "name":"chips",
              "price":0.50,
              "qty":10
           },
           {
              "name":"candy",
              "price":0.65,
              "qty":10
           }
        ];
    },


		getSlotPrices: function() {
			// todo : read slot prices from file
			return [0.8, 0.9, 1.2, 1, 1.5];
		},
		dispenseProduct: function(product) {
			// todo : send message to machine to dispense product
      let products = this.getProducts;
      for(item in  products){
        if(products[item].name  === product.name){
            products[item].qty =products[item].qty - 1;
            break;
        }else{
          console.log('no ');
        }

      }
        // console.log('-->despence'+product.name,this.getProducts);
			// return (slot !== 1);
      return true;
		},
		dispenseCoin: function(value) {
			// todo : send message to machine to dispense coin
			return true;
		}
	};
})
  .controller('MainCtrl', ['$filter','$timeout','$scope','vendingMachine',function ($timeout,$filter,$scope,vendingMachine) {

    this.coins = [{name:'nickel',value:0.05,weight:5.00,diameter:21.21},
                {name:'dime',value:0.10,weight:2.26,diameter:17.91},
                {name:'quarter',value:0.25,weight:5.67,diameter:24.26},
                {name:'penny',value:0.01,weight:2.50,diameter:19.05},
                {name:'half',value:0.50,weight:30.61,diameter:11.34},
                {name:'dollar',value:1.00,weight:8.10,diameter:26.50}];

    this.validCoins = vendingMachine.getValidCoins();
    this.products = vendingMachine.getProducts();
    this.desp
    $scope.credit = 0;
    this.change = 0;



    this.buyItem = function (item){

      let products = this.products;
      for(item in products){
        if(products[item].qty>0){
          console.log('item is available');
          vendingMachine.dispenseProduct(products[item]);
          console.log('products qty',products[item].qty);
          if($scope.credit >= products[item].price){
            console.log('you can buy it');

          }
          else
            console.log('you cant buy this');

          break ;
        }
        else{
          console.log('item is not available11');
        }
      }

    }

    this.insertCoin = function(coin){
      // console.log('inserted coin',coin.value);
      incrementCredit(coin.value);
    }

    this.returnCoin  = function(){
        // console.log('coin is returning',$scope.credit);
    }

    function incrementCredit(value) {
      $scope.credit += value;
      roundTwoDecimals();
    }

    function hasSufficientCredit(price) {
      if ($scope.credit >= price) return true;
      flashPrice(price); return false;
    }

    function roundTwoDecimals() {
      // Round to two decimal places to avoid floating point weirdness.
      $scope.credit = Math.round($scope.credit * 100) / 100;
    }
    function flashPrice(price) {
      flashStatus($filter('currency')(price, "€"));
    }

    function flashStatus(message) {
      $scope.status = message;
      $timeout(function() { $scope.status = ""; }, 1000);
    }

  }]);
