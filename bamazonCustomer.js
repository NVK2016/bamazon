//Firstly , irst display all of the items available for sale. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//DECLARING ALL REQUIRED VARIABLES 
//------------------------------------------------------------------
var sql = require("mysql"); 
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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    
});