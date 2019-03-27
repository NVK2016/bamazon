-- Hold the bamazon Database structure & seed file 

DROP DATABASE IF EXISTS bamazon_db; 

CREATE DATABASE bamazon_db; 

USE bamazon_db; 

create table products(
    item_id int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    product_name VARCHAR(150) NOT NULL, 
    department_name VARCHAR(150) NOT NULL, 
    price decimal(10,4) NOT NULL, 
    stock_quantity int(100) NOT NULL 
);

CREATE TABLE departments(
	department_id int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    department_name VARCHAR(150) NOT NULL, 
    over_head_costs decimal(10,4) NOT NULL, 
    product_sales decimal(10,4) NOT NULL
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sunglasses", "Travel Gear", 153.12, 50), 
("Clear Globe String Bulbs", "Electronics", 15.95,12), 
("iphone X", "Electronics",999.09,7), 
("ipad Air 3", "Electronics",550.05, 32), 
("Cornhole Game", "Outdoor Games", 99.99, 25 ), 
("Jenga Blocks", "Outdoor Games", 7.14, 13), 
("Inflatable Pool Floats - Watermelon", "Travel Gear", 9.99, 35), 
("SPF 30 Natural Sunscreen", "Skin Care", 12.33, 10), 
("Aloe Vera Gel", "Skin Care", 12.95, 65); 
("Scientific Calculator", "Office Supplies", 17.98, 100 ) , 
("Brother P-touch Label Maker", "Office Supplies", 34.00, 43) ; 

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES ("Electronics" , 10000, 20000) , 
("Office Supplies" , 20100, 30200) ,
("Skin Care", 10000, 23000), 
("Outdoor Games", 23456, 56789), 
("Travel Gear",60000, 100000); 

SELECT * FROM products; 