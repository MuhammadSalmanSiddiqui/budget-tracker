//ES6 CLASSES AND CONSTRUCTORS:
//----------------------------
class BudgetClassincExp{
    constructor (id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    }
    //THIS FUNCTION WILL GOES INTO PROTOTYPE FOR INHERITANCE
    CalcPerc(totalInc) 
    {
        if(totalInc > 0)
        {
            this.percentage=Math.round((this.value/totalInc)*100);
        }
        else
        {
            this.percentage=-1;
        }
    }
    //THIS FUNCTION WILL GOES INTO PROTOTYPE FOR INHERITANCE
    getperc()
    {
        return this.percentage;
    }
}
//BUDGETCONTROLLER
const budgetcontroller = (  () => {
    
    //ES5 FUNCTION CONSTRUCTOR:
    //------------------------
    // let Expense = function(id,description,value)
    // {
    //     this.id=id;
    //     this.description=description;
    //     this.value=value;
    // }
    // let Income = function(id,description,value)
    // {
    //     this.id=id;
    //     this.description=description;
    //     this.value=value;
    // }
    var calculatetotal = (type) =>{
        let sum = 0;
        data.allitems[type].forEach((cur) =>{
            sum+=cur.value;
        });
        data.totals[type]=sum;
    }
    //DATA
    let data = {
        allitems: {
            exp: [],
            inc: []
        },
        budget:0,
        percentage: -1,
        totals: {
            exp:0,
            inc:0
        }
    };
    
    return{
        //ADD ITEM TO DATA STRUCTURE
        addItem: (type,des,val) => {
            let newItem,ID;
            
            //new id
            if(data.allitems[type].length > 0){
                ID=data.allitems[type][data.allitems[type].length -1].id + 1;

            }
            else
            {
                ID=0;
            }
            
            //new item based on inc or exp
            if(type ==='inc')
            {
                newItem = new BudgetClassincExp(ID,des,val);
            }
            else if(type ==='exp')
            {
                newItem = new BudgetClassincExp(ID,des,val);
            }
            
            //push it into our data structure
            data.allitems[type].push(newItem);
            
            //return the new item
            return newItem;
        },
        //DELETE ITEM FROM DATA STRUCTURE
        deleteitem: (type,id) =>{
            let ids,index;
            //MAP IS JUSTT LIKE FOREACH BUT IT RETURNS A BRAND NEW ARRAY
            ids=data.allitems[type].map(function(current){
                return current.id;
            });
            //AFTER MAKING ARRAY, NOW WE ARE FINDING THE INDEX OF OUR DESIRED ID FROM THE LAST DEVELOPED index ARRAY.
            index = ids.indexOf(id);
            if(index !==-1) {
              //DELETING THE INDEX NO VALUE FROM OUR DATA ARRAY FOR INCOME OR EXPENSE USING SPLICE METHOD.
              data.allitems[type].splice(index,1);
            }
        },
        //CALCULATE BUDGET
        calculatebudget: () =>{
            //calculate total inc and exp
             calculatetotal('exp');
             calculatetotal('inc');
            //calculate the budget
             data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage of income we spent
            if(data.totals.inc > 0)
            {
            data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }
            else
            {
                data.percentage=-1;
            }
        },

        calculatePercentages: () =>
        {
           data.allitems.exp.forEach((cur)=>{
              cur.CalcPerc(data.totals.inc);
           })
        },
        getpercentages: ()=>{
           var allperc=data.allitems.exp.map((cur)=>{
               return cur.getperc();
           });
           return allperc;
        },

        getbudget: () => {
            return{
               budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage: data.percentage
            }
        },

        testing: () => console.log(data)
        
    };
    

})();

//UICONTROLLER
const uicontroller = (() => {
    let domStrings =
    {
        inputType: '.add__type',
        intputDescrp: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetlabel:'.budget__value',
        icomelabel:'.budget__income--value',
        expenselabel:'.budget__expenses--value',
        percentagelabel:'.budget__expenses--percentage',
        container:'.container',
        itemPercentage:'.item__percentage'
    };
    return{      
            getInput: () => {
            return{
                type: document.querySelector(domStrings.inputType).value,
                    Descp: document.querySelector(domStrings.intputDescrp).value,
                        Value: parseFloat(document.querySelector(domStrings.inputValue).value)
            };
        },
        addlistItem: (obj,type) => {
           var html,newHTML,element;

           //create html string with placeholder text
           if(type === 'inc')
           {
            element=domStrings.incomeContainer;   
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }
           else if(type === 'exp')
           {
            element=domStrings.expenseContainer;   
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }
           //replace place holder with actual data
            newHTML=html.replace('%id%', obj.id);
            newHTML=newHTML.replace('%description%',obj.description);
            newHTML=newHTML.replace('%value%',obj.value);

           //insert the html into the dom
           document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },
        displaypercentages: (percentages)=>{
            var fields=document.querySelectorAll(domStrings.itemPercentage);
            var fieldsArr=Array.from(fields);
            fieldsArr.forEach((current, index,array)=> {
                    if(percentages[index]>0)
                    {
                        current.textContent= percentages[index]+ '%';
                    }
                    else
                    {
                        current.textContent='---';
                    }
            });
            // var nodelistforeach= (list, callback)=> {
            //     for(var i=0; i< list.length; i++)
            //     {
            //         callback(list[i], i);
            //     }
            // };
            // nodelistforeach(fields,function (current,index) {
            //     if(percentages[index]>0)
            //     {
            //         current.textContent= percentages[index]+ '%';
            //     }
            //     else
            //     {
            //         current.textContent='---';
            //     }
            // });
        },

        displaybudget: (obj) =>{
 
           document.querySelector(domStrings.budgetlabel).textContent=obj.budget;
           document.querySelector(domStrings.icomelabel).textContent=obj.totalInc;
           document.querySelector(domStrings.expenselabel).textContent=obj.totalExp;
           if(obj.percentage > 0 && obj.percentage < 101)
           {
            document.querySelector(domStrings.percentagelabel).textContent=obj.percentage + '%';

           }
           else
           {
            document.querySelector(domStrings.percentagelabel).textContent='---';

           }
        },
        //CLEAR FIELDS AFTER CLICKING ON BUTTON OR PRESSSING ENTER
        clearfields: () => {
            var fields,fieldsArr;
            fields = document.querySelectorAll(domStrings.intputDescrp + ', '+ domStrings.inputValue);
            fieldsArr=Array.from(fields);
            fieldsArr.forEach((current, index,array)=> {
               current.value="";
            });
            fieldsArr[0].focus();
        },
        //DELETE ITEM FROM UI 
        deletelstItem: (selectorID)=> {
            
             var el=document.getElementById(selectorID);
             //JAVASCRIPT DOES NOT DELETE THE ELEMENT DIRECTLY BUT WE HAVE FIREST ACCESS THE SELECTED ELEMENT PARENT NODE AND 
             //THEN WE CAN DELETE THE CHILD NODE WHICH WE HAVE SELECTED BY THE QUERY SELECTOR...
            //  el.parentNode.removeChild(el);
            el.remove();
        },

        getdomstrings: () => {
            return domStrings;
        }
    };
})();


//GLOBAL APP CONTROLLER
const controller = ((budgetCtrl, UICtrl) => {
    
    let setUpEnentListeners = () =>
    {
        let Dom = UICtrl.getdomstrings();
        document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(Dom.container).addEventListener('click',ctrlDeleteItem);
    };
    
    let updatebudget = () =>{
        //1.calculate budget
         budgetcontroller.calculatebudget();
        //2.return the budget
         var budget=budgetcontroller.getbudget();
        //3.display budget on ui
         UICtrl.displaybudget(budget);
    };

    var updatePercentage = ()=>
    {
        budgetCtrl.calculatePercentages();
        var percentages= budgetCtrl.getpercentages();
        console.log(percentages);
        UICtrl.displaypercentages(percentages);
    }

    let ctrlAddItem = () => {
        let newItem,input;
        // 1. get the input data
        input = UICtrl.getInput();

        if(input.Descp !=="" && !isNaN(input.Value) && input.Value > 0)
        {
        // 2. add the item to the budget controller
        newItem= budgetcontroller.addItem(input.type,input.Descp,input.Value);
        //3. add the item to the ui
        UICtrl.addlistItem(newItem, input.type);

        // clear the fields
         UICtrl.clearfields();
        //4. calculate the buget and display on ui
         updatebudget();

         updatePercentage();
        }

    }

    var ctrlDeleteItem = (event) => {
        var iTemID,splitId,type,ID;
        iTemID= event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(iTemID);

        if(iTemID){
            //SPLIT METHOD WILL BREAK THE STRING TO ARRAY
            splitId=iTemID.split('-');
            //ES6 DESTRUCTURING
            [type,ID]=[splitId[0],parseFloat(splitId[1])];

            //1. deleete item from data structure
            budgetCtrl.deleteitem(type,ID);
            //2. delete the item from the ui
             UICtrl.deletelstItem(iTemID);
            //3.update and show the budget
            updatebudget();
        }
    }

    return{
        init: () =>
        {
            UICtrl.displaybudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setUpEnentListeners();
        }
    };
    

})(budgetcontroller, uicontroller);

controller.init();
