# Bamazon
Bamazon! This is an Amazon-like storefront built with MySQL and Node.js. App will take in orders from customers and deplete stock from the store's inventory. In case if it low on stock or out stock the customer will be provided with a relevant message. 

### Built With : 
* Node.js 
* Javascript 
* MySQL 

### Installation 
* Clone the folder first. 
* Run under the folder using the command line prompt: 

    npm install 

* Created the package.json file  using 

    npm init -y 

* Packages used to achieve: 
    * mysql - to cconect database 
    * inquirer - to prompt user for inputs 
    * cli-table - display data in a tabular format
    * cli-color - to show different colored messages 
    * format-currency - to display amount in dollars and format price  [npm install --save format-currency]

## How does the App Work 
Currently the app can be run in 2 modes typing the following command(s) in bash terminal:

    node bamazonCustomer.js
    OR 
    node bamazonManager.js
    OR 
    node bamazonSupervisor.js

1. <u><b>Customer View </b></u>
    <hr />
    Here the customer can see all the available products along with their details displayed in a tabular form. Once the customer views all the products the store has to offer. He/She can make a purchse by entering a valid Item ID  and amount of quantity required for the same. 
    the customer can exit the app by **_Pressing Q_** at an given time. 

    Checkpoints : 

    1. Checks if the customer entered the <b style="color:red;">right Item id</b> if not then he gets an error message stating to input a valid Item ID. 
    2. Then it will check if the product is in stock. In case if the customer wants more than the units avaiable at the store he gets an <b>Insufficnet Supply Message</b>.
    3. In case if the units entered matched with the quantity in the store he/she **sucessfully purchases**  the item(s). Customer will be displayed with **final amount due**. 

#### Screeshots:
![customer view](https://github.com/NVK2016/bamazon/blob/master/screenshots/CustomerVIew.png?raw=true)

![Purchase Item](https://github.com/NVK2016/bamazon/blob/master/screenshots/purchaseAnitem.png?raw=true)

![EXIT APP](https://github.com/NVK2016/bamazon/blob/master/screenshots/goodbyeMSgonQ.png?raw=true)

2. <u><b>Manager View </b></u>
    <hr />
    When a store manager logs in he/she is displayed with 4 options to choose from. 
* **_View Products for Sale_** : List down all the products at the store. 
* **_View Low Inventory_**: List down all the products whose quantity is less than 5. 
* **Restock Inventory** : Will allow to update stock for the selected Item. In case of non-exisiting product it will throw an error. 
* **Add New Product** : Will allow the manager to add a new product within the exisiting departments created. 
* **Quit** : exit the app 

![Manager View](https://github.com/NVK2016/bamazon/blob/master/screenshots/ManagerView.png?raw=true)
3. <u><b>Supervisior View </b></u>
    <hr />
    WORK IN PROGRESS 
    
#### Owner 
<hr/>
Namita Shenai 