// Manager can :  View Products for Sale / View Low Inventory / Add to Inventory / Add New Product

//DECLARING ALL REQUIRED VARIABLES 
//------------------------------------------------------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var clc = require("cli-color");

//=================================Connect to SQL database===============================

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    // Your password
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    //If connection is establised sucessfully display manager diffrent options  
    managerView();

});

//FUNCTION FOR MANAGER VIEW 
function managerView() { 
    inquirer.prompt([{
		type: 'list',
		name: 'action',
		message: 'What would you like to do today?',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
	}]).then(function(inquirerResponse){

        //Swicth Case 
        switch (inquirerResponse.action){
            case "View Products for Sale": 
                viewAllProducts(); 
                break; 
            case "View Low Inventory": 
                viewLowInventory();
                break;
            case "Add to Inventory": 
                updateStockQuantity();
                break; 
            case "Add New Product":
            break;  
            case "Quit": 
            default: 
                console.log("Thank you for logging into Bamazon!! Goodbye"); 
                connection.end(); 
                break; 

        }

    });
}

function viewAllProducts(){
    console.log(clc.bold("\n Displaying all products in the inventory  \n"));
    // console.log("--------------------------------------------------------------- \n");

    var query = connection.query(
        "SELECT * FROM products ;",
        function (err, res) {
            //throw error 
            if (err) throw clc.red.bold(err);
            // Log all results of the SELECT statement
            var vertical_table = new Table({

                chars: {
                    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                    , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                    , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                    , 'right': '║', 'right-mid': '╢', 'middle': '│'
                },
                style: { 'padding-left': 2, 'padding-right': 2 }
            });

            //Add TABLE HEADERS 
            vertical_table.push([clc.blue.bold("Item ID"), clc.blue.bold("Product Name"), clc.blue.bold("Department Name"), clc.blue.bold("Price"), clc.blue.bold("Stock Quantity")]);

            //ADD ALL ROWS IN THE TABLE TO DISPLAY INVENTORY 
            for (var i = 0; i < res.length; i++) {
                vertical_table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
            }
            console.log(vertical_table.toString());
            //RECURSIVE FUNCtion 
            managerView(); 
        });
}

// ANY PRODUCT THAT is LESS THAN PR EQUAL TO 5 in QUANTITY 
function viewLowInventory(){
    console.log(clc.red.bold("\n Low in stock.... \n"));
    // console.log("--------------------------------------------------------------- \n");

    var query = connection.query(
        "SELECT * FROM products where stock_quantity <= 5;",
        function (err, res) {
            //throw error 
            if (err) throw clc.red.bold(err);
            // Log all results of the SELECT statement
            var vertical_table = new Table({

                chars: {
                    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                    , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                    , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                    , 'right': '║', 'right-mid': '╢', 'middle': '│'
                },
                style: { 'padding-left': 2, 'padding-right': 2 }
            });

            //Add TABLE HEADERS 
            vertical_table.push([clc.blue.bold("Item ID"), clc.blue.bold("Product Name"), clc.blue.bold("Department Name"), clc.blue.bold("Price"), clc.blue.bold("Stock Quantity")]);

            //ADD ALL ROWS IN THE TABLE TO DISPLAY INVENTORY 
            for (var i = 0; i < res.length; i++) {
                vertical_table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
            }
            console.log(vertical_table.toString());
             //RECURSIVE FUNCtion 
             managerView(); 
        });
}

//UPDATE STOCK INVENTORY 
function updateStockQuantity(){
    inquirer.prompt([
		{
			name: "itemID",
			type: "input",
            message: "Please enter the item ID that you would like to re-stock to.", 
            validate: function(input){
                if(isNaN(input)){
                    console.log(clc.red('\n Please enter a valid number')); 
                    return false; 
                }
                else { 
                    return true; 
                }
            }
		},
		{
			name: "restockQty",
			type: "input",
            message: "How much units of item would you like to add?", 
            validate: function(input){
                if(isNaN(input)){
                    console.log(clc.red('\n Please enter a valid number')); 
                    return false; 
                }
                else { 
                    return true; 
                }
            }
		}
	]).then(function(inquirerResponse) {
        
        //SELECT THE ITEM 
        connection.query('SELECT * FROM products WHERE item_id = ?', [inquirerResponse.itemID], function(err, res){
            //throw error 
            if (err) throw clc.red.bold(err);

            //UPDATE THE PRODUCT BY ADDING NEW QUANTITY TO OLD STOCK 
            connection.query("UPDATE products SET ? WHERE ?", [{

                stock_quantity: [parseInt(res[0].stock_quantity) + parseInt(inquirerResponse.restockQty)]
            }, {
                item_id: inquirerResponse.itemID
            }], function(err, res) {

                //throw error 
                if (err) throw clc.red.bold(err);

                //SUCCESSFULLY UPDATED INVENTORY 
                console.log(clc.green.bold("Succesfully Re-stocked the item \n")); 
                
                //RECURSIVE FUNCtion 
                managerView(); 
            });
        });

        
    });
}