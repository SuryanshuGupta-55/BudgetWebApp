var budgetController = (function () {

    //Creating a function Constructors for Expenses and Income.

    var Expenses = function(id,des,val){
        this.id = id,
        this.des = des,
        this.val = val
    };

    var Income = function(id,des,val){
        this.id = id,
        this.des = des,
        this.val = val
    };

    var calculateTotal = function(type){

        var sum = 0;
        data.allItems[type].forEach(function (cur){

            //The value is from Income and Expense function Constructor.
            sum += cur.val;
        });

        //Total of either expense or income has been set.
        data.total[type] = sum;

    }

    //Creating a dataStructur for storing all required field.

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        total: {
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage: -1
    };

    return {
        // Creating public method to add data according to its type in our data structure.
        addItem: function (type,description,value) {
            var newItem,Id;

            //Creating new Id.
            if(data.allItems[type].length > 0){
                
                Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                Id = 0;
            }

            //Create new item based on 'inc' or 'exp'.
            if(type === 'exp'){
                newItem = new Expenses(Id,description,value);
            } else if(type === 'inc'){
                newItem = new Income(Id,description,value);
            }

            //Adding data to our array.
            //First we call the private constructor data and after that access its properties allItems.
            //pushing new item into our data structure.
            data.allItems[type].push(newItem);
            
            // return the new element.
            return newItem;
        },

        deleteItem: function(type,id){

            var ids,index;

            //Here we cannot delete item like this data.allItems[ype][id] because we are not sure index and Id will be same.
            //Here we are using map funtion to iterate over array as it returns a new array. 

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
            
        },

        calculateBudget: function(){
            //Calculate total of expense and income.
            calculateTotal('exp');
            calculateTotal('inc');
            
            //Calculate the budget: income - expense.
            data.budget = data.total.inc - data.total.exp;

            //Calculate the percentage of the income that we spent

            data.percentage = Math.round((data.total.exp / data.total.inc) * 100);

        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.total.inc,
                totalExpense: data.total.exp,
                percentage: data.percentage
            };
        },

        testing : function(){
            console.log(data);
        }
    };

})();


var UIController = ( function() {
    //Code for our UI

    var DOMStrings = {
        inputType: '.add__type',
        inputDes:  '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetTitle: '.budget__value',
        expenseTitle: '.budget__expenses--value',
        incomeTitle:  '.budget__income--value',
        percentageTitle: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function () {
            return {
                type : document.querySelector(DOMStrings.inputType).value,
                des  : document.querySelector(DOMStrings.inputDes).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        //Creating function for adding item into the Income and expense list of app by changing HTML using DOM.

        addListItem: function (obj,type){
            var html,newhtml,element;

            if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newhtml = html.replace("%id%",obj.id);
            newhtml = newhtml.replace("%description%",obj.des);
            newhtml = newhtml.replace("%value%",obj.val);

            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

        },

        deleteListItem: function(selectorId){
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        clearField: function() {
            var fields,fieldArray;

            fields = document.querySelectorAll(DOMStrings.inputDes + ',' + DOMStrings.inputValue);

            fieldArray = Array.prototype.slice.call(fields);

            fieldArray.forEach(function(current,index,array){
                current.value = "";
            });

            fieldArray[0].focus();

        },

        displayBudget: function(obj){

            document.querySelector(DOMStrings.budgetTitle).textContent = obj.budget,
            document.querySelector(DOMStrings.expenseTitle).textContent = obj.totalExpense,
            document.querySelector(DOMStrings.incomeTitle).textContent = obj.totalIncome

            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageTitle).textContent = obj.percentage+'%'
            }
            else{
                document.querySelector(DOMStrings.percentageTitle).textContent = '---'
            }


        },
        
        getDOmStrings: function(){
            return DOMStrings;
        }
    };


})();



var controller = ( function(budgetCtrl, UICtrl) { 

    // Creating a function for eventListners to make code organised.
    var setupEventListners = function (){
        var DOM = UICtrl.getDOmStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event) {
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        //Using event deligation for targeting remove button.
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

    };

    var updateBudget = function() {

        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);

    };

    var ctrlAddItem = function () {
        var input,newItem;
        
        input = UICtrl.getInput();

        if(input.des !== "" && !isNaN(input.value) && input.value > 0){

            newItem = budgetCtrl.addItem(input.type,input.des,input.value);
    
            UICtrl.addListItem(newItem,input.type);
    
            UICtrl.clearField();

            updateBudget();

        }
        
        
    
    };

    var ctrlDeleteItem = function(event) {
        var itemId,splitId,type,Id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){

            splitId = itemId.split('-');
            type = splitId[0];
            Id = parseInt(splitId[1]);

            //delete item from the data Structure
            budgetCtrl.deleteItem(type,Id);
           
            //Delete the item from UI
            UICtrl.deleteListItem(itemId);

            //Update and show the new Budget.
            updateBudget();
        }


    };

    // Created init function which is a public function and will the first which will be called so that application can work.
    return {
        init: function(){
            console.log("Application is running");
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            setupEventListners();
        }
    }

})(budgetController, UIController);

controller.init();





























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