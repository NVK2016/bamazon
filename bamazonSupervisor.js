// View Product Sales by Department OR Create New Department

//DECLARING ALL REQUIRED VARIABLES 
//------------------------------------------------------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var clc = require("cli-color");
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
    console.log("Succesfull Connection!! ");

    companyLogo();


});

function companyLogo() {

    figlet('Welcome Bamzon Supervisor !!\n', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)

        //If connection is establised sucessfully then display different options  
        supervisorView();

    });

}

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
                viewProductSales(); 
                break;
            case 'Create New Department':
                addNewDepartment(); 
                break;
            case "Quit":
            default:
                console.log(clc.magenta.bold("\n Thank you for logging into Bamazon!! Goodbye \n"));
                connection.end();
                break;

        }

    });
}

function addNewDepartment() {
    // once you have the departemnts, prompt the user for which department they like to add inventory 
    inquirer.prompt([
        {
            name: 'department',
            message: 'What is the name of the department ?'
        }, {
            name: 'overheadCost',
            message: 'What is the overhead cost of the department?',
            validate: function (input) {
                if (isNaN(input) || parseInt(input) <= 0) {
                    console.logclc.redBright("\n Please provide a valid number \n");
                    return false;
                }
                else {
                    return true;
                }
            }
        }]).then(function (response) {

            //CHECK IF DEPARTMENT EXISTS 
            var query = connection.query('SELECT distinct department_name FROM products WHERE department_name = ? ;', [response.department], function (err, res) {
                //throw error 
                if (err) throw clc.red.bold(err);
                console.log(res);
                //CHeck for a item id exisits 
                if (res.length > 0) {
                    console.log(clc.magenta.bold('\n ERROR: Department Exists. Please enter a new department .\n'));
                    //return to start point 
                    supervisorView();
                }
                else {
                    // INSERT DATA INTO DEPARTMENTS  
                    var query = connection.query("INSERT INTO departments SET ? ;",
                        {
                            department_name: response.department,
                            over_head_costs: response.overheadCost,

                        }, function (err, res) {
                            //throw error 
                            if (err) throw clc.red.bold(err);

                            console.log(clc.blue.bold('\n\tDepartment successfully added!\n'));

                            supervisorView();
                        });
                    // console.log(query.sql);
                }
                
            });
        });
}

function viewProductSales(){
    var sqlJoinQuery = ""; 
    connection.query(sqlJoinQuery, function(error, results) {
		if (error) throw error;
        console.log("\n Display Profits "); 
        
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
        vertical_table.push([clc.blue.bold("Department ID"), clc.blue.bold("Department Name"), clc.blue.bold("Department Name"), clc.blue.bold("Price"), clc.blue.bold("Stock Quantity")]);

        //ADD ALL ROWS IN THE TABLE TO DISPLAY INVENTORY 
        for (var i = 0; i < res.length; i++) {
            //Displaying price in format $
            let opts = { format: '%s%v %c', code: 'USD', symbol: '$ ' }
            vertical_table.push([res[i].department_id, res[i].department_name, res[i].department_name, formatCurrency(res[i].price, opts), res[i].stock_quantity]);
        }
        console.log(vertical_table.toString());

	});
}