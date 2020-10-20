var budgetController = (function () {







    // Here the variable a and function add have became priavet as we can only access them by calling budgetController.
   /*  var x = 23;

    var add = function(a){
        return x + a;
    }
    return {
        publicTest : function(b) {
            console.log(add(b));
        }
    } */
    /*Here budgetController will return an object of functions which we want to make public or expose to user such as publicTest  */

})();


var UIController = ( function() {
    //Code for our UI

    var DOMStrings = {
        inputType: '.add__type',
        inputDes:  '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function () {
            return {
                type : document.querySelector(DOMStrings.inputType).value,
                des  : document.querySelector(DOMStrings.inputDes).value,
                value:  document.querySelector(DOMStrings.inputValue).value
            };
        },
        
        getDOmStrings: function(){
            return DOMStrings;
        }
    };


})();



var controller = ( function(budgetCtrl, UICtrl) { 

    var DOM = UICtrl.getDOmStrings();

    var ctrlAddItem = function () {
        
        console.log('pressed');
    
    }

    //Adding event handler for add button.

    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress',function(event) {
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });


})(budgetController, UIController);
