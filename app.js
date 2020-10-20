var budgetController = (function () {

    // Here the variable a and function add have became priavet as we can only access them by calling budgetController.
    var x = 23;

    var add = function(a){
        return x + a;
    }
    return {
        publicTest : function(b) {
            console.log(add(b));
        }
    }
    /*Here budgetController will return an object of functions which we want to make public or expose to user such as publicTest  */

})();


var UIController = ( function() {
    //Code for our UI



})();



var controller = ( function(budgetCtrl, UICtrl) { 


})(budgetController, UIController);
