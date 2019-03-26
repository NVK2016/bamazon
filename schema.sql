-- Hold the bamazon Database structure & seed file 

DROP DATABASE IF EXISTS bamazon_db; 

CREATE DATABASE bamazon_db; 

USE bamazon_db; 

create table product(
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    product_name VARCHAR(150) NOT NULL, 
    department_name VARCHAR(150) NOT NULL, 
    price decimal(10,4) NOT NULL, 
    stock_quantity int NOT NULL 
);