//Firstly , irst display all of the items available for sale. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

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
    // console.log("connected as id " + connection.threadId);

    //If connection is establised sucessfully display inventory 
    displayInventory();

});

function displayInventory() {
    console.log(clc.bold("\n Displaying inventory for all supplies..... until stock lasts \n"));
    // console.log("--------------------------------------------------------------- \n");

    var query = connection.query(
        "SELECT * FROM products ;",
        function (err, res) {
            // Log all results of the SELECT statement
            //   console.log(res);

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
        });
}
