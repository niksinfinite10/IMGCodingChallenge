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
	let products = [
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

	 let availableCoins = [{"name":0.25,"qty":10},{"name":0.10,"qty":10},{"name":0.05,"qty":10}];

	return {
    getAvailableCoins:function(){
			let result = [];
			for(let coin in availableCoins){
				if(availableCoins[coin].qty>0)
						result.push(availableCoins[coin].name*100);
			}
			return result;
    },

    getProducts:function(){
       return products;
    },

		getSlotPrices: function() {
			// todo : read slot prices from file
			return [0.8, 0.9, 1.2, 1, 1.5];
		},
		dispenseProduct: function(product) {
			let products = this.getProducts();
			let result = false;
			for(let item in  products){
			  if(products[item].name  === product.name && products[item].qty > 0 ){
            products[item].qty = products[item].qty - 1;
						result = true;
            break;
        }
			}
      return result;
		},

		dispenseCoin: function(value) {
			// todo : send message to machine to dispense coin
			return true;
		}
	};
})
  .controller('MainCtrl', ['$filter','$scope','$timeout','vendingMachine',function ($filter,$scope,$timeout,vendingMachine) {

    this.coins = [{name:'nickel',value:0.05,weight:5.00,diameter:21.21},
                {name:'dime',value:0.10,weight:2.26,diameter:17.91},
                {name:'quarter',value:0.25,weight:5.67,diameter:24.26},
                {name:'penny',value:0.01,weight:2.50,diameter:19.05},
                {name:'half',value:0.50,weight:30.61,diameter:11.34},
                {name:'dollar',value:1.00,weight:8.10,diameter:26.50}];

    this.availableCoins = vendingMachine.getAvailableCoins;
    this.products = vendingMachine.getProducts();
    $scope.status = "Inser Coin";
    $scope.credit = 0;
    this.change = 0;



    this.buyItem = function (product){
			 let products = this.products;
			 let isDespenseProduct = vendingMachine.dispenseProduct(product);
			 if(isDespenseProduct){
				 if($scope.credit >= product.price)
				 {
						decrementCredit(product.price);
						let change = getChange(this.availableCoins(),$scope.credit);
						console.log('this is the change','25 * '+change[0]+"- 10 * "+change[1]+"- 5 * "+change[2]);
				 }
				 else{
					 	console.log('no sufficiant balance');
				 }

			 }
			 else{
				 console.log('product not available');
			 }
			 flashStatus(product.name+' Dispensed');
    }


    this.insertCoin = function(coin){
      // console.log('inserted coin',coin.value);
      incrementCredit(coin.value);
    }

    this.returnCoin  = function(){
        // console.log('coin is returning',$scope.credit);
    }

		function getChange(availableCoins,amount){
			amount = amount*100;
			var i = 0,
					coincount = availableCoins.map(function () { return 0; }); // returns an array and for each element of coins zero
			while (i < availableCoins.length) {
					while (availableCoins[i] <= amount) {
							amount -= availableCoins[i];
							coincount[i]++;
					}
					i++;
			}
			return coincount;
		}

    function incrementCredit(value) {
      $scope.credit += value;
      roundTwoDecimals();
    }
		function decrementCredit(value){
			$scope.credit -= value;
      roundTwoDecimals();
		}

    function hasSufficientCredit(price) {
      if ($scope.credit >= price) return true;
      flashPrice(price); return false;
    }

    function roundTwoDecimals() {
      // Round to two decimal places to avoid floating point weirdness.
			// console.log('this is the round decimal',$scope.credit);
      $scope.credit = Math.round($scope.credit * 100) / 100;
    }
    function flashPrice(price) {
      flashStatus($filter('currency')(price, "€"));
    }

    function flashStatus(message) {
      $scope.status = message;
      $timeout(function(){ $scope.status = "Insert Coin";}, 2000);

		}

  }]);
