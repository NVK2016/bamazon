// Manager can :  View Products for Sale / View Low Inventory / Add to Inventory / Add New Product

//DECLARING ALL REQUIRED VARIABLES 
//------------------------------------------------------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var clc = require("cli-color");
var figlet = require('figlet');
const formatCurrency = require('format-currency'); 

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

    console.log("Succesfull Connection!! \n" );
    // console.log("connected as id " + connection.threadId);

    //If connection is establised sucessfully display manager diffrent options  
    // managerView();
    companyLogo();

});

function companyLogo() {

    figlet('Welcome to Bamzon Store !!\n', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)

        //If connection is establised sucessfully display manager diffrent options  
        managerView();


    });

}
//FUNCTION FOR MANAGER VIEW 
function managerView() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do today?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Restock Inventory', 'Add New Product', 'Quit']
    }]).then(function (inquirerResponse) {

        //Swicth Case 
        switch (inquirerResponse.action) {
            case "View Products for Sale":
                viewAllProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Restock Inventory":
                restockQuantity();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Quit":
            default:
                console.log(clc.magenta.bold("\n Thank you for logging into Bamazon!! Goodbye\n"));
                connection.end();
                break;

        }

    });
}

function viewAllProducts() {
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
                //Displaying price in format $
                let opts = { format: '%s%v %c', code: 'USD', symbol: '$ ' }
                vertical_table.push([res[i].item_id, res[i].product_name, res[i].department_name, formatCurrency(res[i].price, opts), res[i].stock_quantity]);
            }
            console.log(vertical_table.toString());
            //RECURSIVE FUNCtion 
            managerView();
        });
}

// ANY PRODUCT THAT is LESS THAN PR EQUAL TO 5 in QUANTITY 
function viewLowInventory() {
    console.log(clc.red.bold("\n Low in stock.... \n"));
    // console.log("--------------------------------------------------------------- \n");

    var query = connection.query(
        "SELECT * FROM products where stock_quantity < 5;",
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
                //Displaying price in format $
                let opts = { format: '%s%v %c', code: 'USD', symbol: '$ ' }
                vertical_table.push([res[i].item_id, res[i].product_name, res[i].department_name, formatCurrency(res[i].price, opts), res[i].stock_quantity]);
            }
            console.log(vertical_table.toString());
            //RECURSIVE FUNCtion 
            managerView();
        });
}

//UPDATE STOCK INVENTORY 
function restockQuantity() {
    inquirer.prompt([
        {
            name: "itemID",
            type: "input",
            message: "Please enter the item ID that you would like to re-stock to.",
            validate: function (input) {
                console.log("Input: " + input);
                if (isNaN(input)|| parseInt(input) <= 0 || input === '')  {
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
            validate: function (input) {
                console.log("Input: " + input);
                if (isNaN(input) || parseInt(input) <= 0 || input === '' ) {
                    console.log(clc.red('\n Please enter a valid number \n'));
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ]).then(function (inquirerResponse) {

        //SELECT THE ITEM 
        connection.query('SELECT * FROM products WHERE item_id = ?', [inquirerResponse.itemID], function (err, res) {
            //throw error 
            if (err) throw clc.red.bold(err);

            //CHeck for a item id exisits 
            if (res.length === 0) {
                console.log(clc.magenta.bold('\n ERROR: Product does not exists. Please select a valid Item ID.\n'));
                 //RECURSIVE FUNCtion 
                 managerView();
            }
            else { 
                //UPDATE THE PRODUCT BY ADDING NEW QUANTITY TO OLD STOCK 
                connection.query("UPDATE products SET ? WHERE ?", [{

                    stock_quantity: [parseInt(res[0].stock_quantity) + parseInt(inquirerResponse.restockQty)]
                }, {
                    item_id: inquirerResponse.itemID
                }], function (err, res) {

                    //throw error 
                    if (err) throw clc.red.bold(err);

                    //SUCCESSFULLY UPDATED INVENTORY 
                    console.log(clc.green.bold("\n-----------------******************--------------------\n"));
                    console.log(clc.green.bold("    Succesfully Re-stocked the item  \n"));
                    console.log(clc.green.bold("\n-----------------******************--------------------\n"));

                    //RECURSIVE FUNCtion 
                    managerView();
                });
            }
        });

    });
}

function addNewProduct() {
    // query the database to populated the department choice list in alphabetic order
    connection.query("SELECT distinct department_name FROM products ORDER BY department_name;", function (err, results) {
        //Throw an error 
        if (err) throw err;

        // once you have the departemnts, prompt the user for which department they like to add inventory 
        inquirer.prompt([{
            name: 'productName',
            message: 'What is the new of the product you would like to add?'
        }, {
            name: 'department',
            type: 'list',
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].department_name);
                }
                return choiceArray;
            },
            message: 'Which department does it fall into?'
        }, {
            name: 'price',
            message: 'How much does it cost?',
            validate: function (input) {
                if (isNaN(input) || parseFloat(input) <= 0 || input === '') {
                    console.log(clc.red.bold("\n Please provide a valid number \n"));
                    return false;
                }
                else {
                    return true;
                }
            }
        }, {
            name: 'stock',
            message: 'How many do we have?',
            validate: function (input) {
                // var valid = input.match(/^[0-9]+$/)
                if (isNaN(input) || parseInt(input) <= 0 || input === '') {
                    console.log(clc.red.bold("\n Please provide a valid number \n"));
                    return false;
                }
                else {
                    return true;
                }
            }
        }]).then(function (response) {
            // console.log("Inserting values : "+ response.productName + " | "+ response.department+ " | " +  response.price + " | "+ response.stock);

            if (( response.productName === '' || response.productName === null )||
            ( response.department === '' || response.department === null )||
            ( response.price === '' || response.price === null )||
            ( response.stock === '' || response.stock === null ))
            {
                console.log(clc.red.bold('\n Please enter value do not leave it blank or undefined \n' ));
                //UPDATE PRODUCT LIST 
                viewAllProducts();
            }
            else { 
                // INSERT DATA INTO PRODUCTS 
                var query = connection.query("INSERT INTO products SET ? ;",
                {
                product_name: response.productName ,
                    department_name: response.department,
                    price: parseFloat(response.price) ,
                    stock_quantity: parseInt(response.stock), 
                }, function (err, res) {
                    //throw error 
                    if (err) throw clc.red.bold(err);

                    //UPDATE PRODUCT LIST 
                    viewAllProducts();
                });
                console.log(query.sql);
            }
            
        });
    });
}