// View Product Sales by Department OR Create New Department

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
    console.log("Succesfull Connection!! " );
    
    //If connection is establised sucessfully then display different options  
    supervisorView();

});

//FUNCTION FOR Supervisor VIEW 
function supervisorView() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do today?',
        choices: ['View Products Sale by Department', 'Create New Department', 'Quit']
    }]).then(function (inquirerResponse) {

        //Swicth Case 
        switch (inquirerResponse.action) {
            case "View Products Sale by Department":
                // viewAllProducts();
                break;
            case 'Create New Department':

                break;
            case "Quit":
            default:
                console.log(clc.magenta.bold("\n Thank you for logging into Bamazon!! Goodbye \n"));
                connection.end();
                break;

        }

    });
}
