//Firstly , irst display all of the items available for sale. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//DECLARING ALL REQUIRED VARIABLES 
//------------------------------------------------------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var clc = require("cli-color");
const formatCurrency = require('format-currency'); 
var figlet = require('figlet');

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
    console.log("Succesfull Connection!! " );

    //Display LOGO 
    companyLogo(); 
    

});

//  FUNCTIONS 
//---------------------------------------------------------------------

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
                //Displaying price in format $
                let opts = { format: '%s%v %c', code: 'USD', symbol: '$ ' }
                vertical_table.push([res[i].item_id, res[i].product_name, res[i].department_name, formatCurrency(res[i].price, opts), res[i].stock_quantity]);
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

                        console.log(clc.magenta.bold("\n\n Thank you for shopping at Bamazon !! \n"));
                        //Close Connection 
                        connection.end();
                        //exits the app 
                        process.exit();
                    }
                    else if (isNaN(input) || parseInt(input) <= 0 || input === '' ) {

                        console.log(clc.redBright("Please provide a valid item_id number \n"));
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

                        console.log(clc.magenta.bold("\n\n Thank you for shopping at Bamazon !! \n"));
                        //Close Connection 
                        connection.end();
                        //exits the app 
                        process.exit();
                    }
                    else if (isNaN(input) || parseInt(input) <= 0 || input === '' ) {

                        console.log(clc.redBright("Please provide a valid number \n"));
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

                //CHeck for a item id exisits 
                if (res.length === 0) {
                    console.log(clc.magenta.bold('\n ERROR: Product does not exists. Please select a valid Item ID.\n'));
                     //DISPLAYS INVENTORY 
                     displayInventory();
                }
                else {
                    //Insufficient Quantity 
                    if (parseInt(inquirerResponse.purchaseQty) > parseInt(res[0].stock_quantity)) {
                        console.log(clc.redBright.bold(' -----------------********************------ \n'));
                        console.log(clc.redBright.bold('\n Insufficient Quantity, your order cannot be placed as is. \n'));
                        console.log(clc.redBright.bold('\n Please place a new order... \n'));
                        console.log(clc.redBright.bold(' -----------------********************------ \n'));
                         //DISPLAYS INVENTORY 
                         displayInventory();
                    }
                    else {
                        //Billed Amount based on the items purchased 
                        console.log(clc.blueBright.bold(' -----------------********************----------------------- \n'));
                        console.log(clc.green.bold("Succesfully purchased " + inquirerResponse.purchaseQty + " " + res[0].product_name + "(s) .\n"));


                        //UPDATE PRODUCTS TABLE WITH NEW QUANTITY 
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

                                var purchaseAmt = (parseFloat(res[0].price) * parseInt(inquirerResponse.purchaseQty));
                                // use to reformat currency strings
                                let opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
                                console.log(clc.blueBright.bold('Order Total: ' + formatCurrency(purchaseAmt, opts)));
                                
                                console.log(clc.blueBright.bold('\n -----------------********************----------------------- \n'));
                                // console.log("Updated Products successfully!");
                                 //DISPLAYS INVENTORY 
                                displayInventory();
                            }
                        );
                    }
                }
            });

        });
        
}

function companyLogo() {

    figlet('Welcome to Bamzon Store!!', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        //If connection is establised sucessfully display inventory 
        displayInventory();

    });

}