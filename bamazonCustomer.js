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
    console.log("connected as id " + connection.threadId);

    //If connection is establised sucessfully display inventory 
    displayInventory();

});

function displayInventory() {
    console.log(clc.bold("\n Displaying inventory for all supplies..... until stock lasts \n"));
    // console.log("--------------------------------------------------------------- \n");

    var query = connection.query(
        "SELECT * FROM products ;",
        function (err, res) {
            //throw error 
            if (err) throw clc.red.bold(err);
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

            //Would you like to purchase an item 
            purchaseItem();
        });


}

function purchaseItem() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "itemID",
                message: "What is the ID of the item you would like to purchase ? [Quit with q]",
                validate: function (input) {
                    // console.log(typeof input + " -- " + input);
                    if (input.toLowerCase() === 'q') {

                        console.log("Thank you for shopping at Bamazon !! ");
                        //Close Connection 
                        connection.end();
                    }
                    else if (isNaN(input)) {

                        console.log("Please provide a valid item_id number");
                        return false;
                    }
                    else {
                        return true;
                    }
                },
            },
            //Enter teh items to purchase 
            {
                type: "input",
                name: "purchaseQty",
                message: "How many would you like? [Quit with q]",
                validate: function (input) {
                    // console.log(typeof input + " -- " + input);
                    if (input.toLowerCase() === 'q') {

                        console.log("Thank you for shopping at Bamazon !! ");
                        //Close Connection 
                        connection.end();
                    }
                    else if (isNaN(input)) {

                        console.log("Please provide a valid number");
                        return false;
                    }
                    else {
                        return true;
                    }
                },
            }
        ]).then(function (inquirerResponse) {

            var query = connection.query('SELECT * FROM products WHERE item_id = ? ;', [inquirerResponse.itemID], function (err, res) {
                //throw error 
                if (err) throw clc.red.bold(err);

                // console.log("Old Quantity: " + res[0].stock_quantity + " Item needed: " + inquirerResponse.purchaseQty + "of itemID: " + inquirerResponse.itemID);
               
                //Insufficient Quantity 
                if (parseInt(inquirerResponse.purchaseQty) > parseInt(res[0].stock_quantity)) {
                    console.log(clc.redBright.bold('\n Insufficient Quantity!! \n'));
                    console.log(' ------------ \n');
                }
                else {
                    //Billed Amount based on the items purchased 
                    console.log(' ------------ \n');
                    console.log(clc.green.bold("Succesfully purchased " + inquirerResponse.purchaseQty + " " + res[0].product_name+"(s) .\n"));
                    var purchaseAmt = (parseFloat(res[0].price) * parseInt(inquirerResponse.purchaseQty));
                    console.log(clc.bold('Order Total: $' + purchaseAmt));
                    console.log(' ------------ \n');

                    //UPDATE PRODUCTS TABLE WITH NEW QUANTITY 
                    // console.log("New Quantity : " + (res[0].stock_quantity - inquirerResponse.purchaseQty));

                    var query = connection.query('UPDATE products SET ? Where ?',
                        [
                            {
                                stock_quantity: (res[0].stock_quantity - inquirerResponse.purchaseQty)
                            },
                            {
                                item_id: inquirerResponse.itemID
                            }
                        ],
                        function (error) {
                            if (error) throw clc.red.bold(err);
                            console.log("Updated Products successfully!");
                        }
                    );
                    // logs the actual query being run
                    // console.log(query.sql);
                }
                 //DISPLAYS INVENTORY 
                 displayInventory(); 
            });
           
        });
}
