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

	 let availableCoins = [{"name":0.25,"qty":10,weight:5.67,diameter:24.26},{"name":0.10,"qty":10,weight:2.26,diameter:17.91},{"name":0.05,"qty":10,weight:5.00,diameter:21.21}];

	return {
		getValidCoin:function(){
			return availableCoins;
		},
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
		this.validCoin  = vendingMachine.getValidCoin();
    this.products = vendingMachine.getProducts();
    $scope.status = "";
    $scope.credit = 0;
		$scope.returnMsg = "";
    this.change = 0;



    this.buyItem = function (product){
			 let products = this.products;
			 let isDespenseProduct = vendingMachine.dispenseProduct(product);
			 if(isDespenseProduct){
				 if($scope.credit >= product.price)
				 {
						decrementCredit(product.price);
						this.returnCoin();
						flashStatus('THANK YOU','INSERT COIN');
				 }
				 else{
					 flashStatus('INSERT COIN',$scope.credit);
				 }
			 }
			 else{
				 flashStatus("SOLD OUT",$scope.credit+" ");
			 }
		 }


    this.insertCoin = function(coin){
			let err = undefined;
			for(let vCoin in this.validCoin){
					vCoin = this.validCoin[vCoin];
				if(coin.value == vCoin.name && coin.weight == vCoin.weight ){
							incrementCredit(coin.value);
							flashStatus($scope.credit);
							err = undefined;
							break;
				}
				else {
					err = "INSERT COIN";
				}
			}
			if(err)
				flashStatus(err,$scope.credit);
		}

    this.returnCoin  = function(){
        let change = returnChange(this.availableCoins(),$scope.credit);
				$scope.credit = 0;
				flashCoinreturn(change);
				flashStatus("INSERT COIN");
			}

		function returnChange(availableCoins,amount){
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
			let result = '(25 x '+coincount[0]+") (10 x "+coincount[1]+") (5 x "+coincount[2]+")";
			return result;
		}

    function incrementCredit(value) {
      $scope.credit += value;
      roundTwoDecimals();
    }
		function decrementCredit(value){
			$scope.credit -= value;
      roundTwoDecimals();
		}



    function roundTwoDecimals() {
      // Round to two decimal places to avoid floating point weirdness.
      $scope.credit = Math.round($scope.credit * 100) / 100;
    }

    function flashStatus(message,defaultMsg) {
      $scope.status = message;
			if(defaultMsg)
      	$timeout(function(){ $scope.status = defaultMsg;}, 1000);
		}



		function flashCoinreturn(message) {
			$scope.returnMsg = message;
			$timeout(function(){ $scope.returnMsg = "";}, 1000);
		}

  }]);
