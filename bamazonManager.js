var inquirer = require('inquirer');
var cn = require('./connection.js');

cn.connect(function(err) {
    if (err) throw err;
    managerInput();    
    console.log("connected as id " + cn.threadId);
});

function managerInput() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Select Manager option.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(option) {
        execute(option.menu);
        // console.log(option.menu);
    })
}

function execute(option) {
    switch (option) {
        case "View Products for Sale":
            products();
            break;
        case "View Low Inventory":
            lowInventory();
            break;
        case "Add to Inventory":
            // function to add to inventory
            break;
        case "Add New Product":
            // function to add new product
            break;
        case "Exit":
            exit();
        default:
            break;
    }
}

function products() {
    cn.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('ID#: ' + res[i].item_id  + ' | Product: ' + res[i].product_name + ' | Department: ' 
            + res[i].department_name + ' | Price: ' + res[i].price + ' | Item Count: ' + res[i].stock_quantity + ' | ');
        }
        console.log("----------------------------------------------------");
        managerInput();        
    });
}

function lowInventory() {
    cn.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
        if (err) throw err;
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                console.log('ID#: ' + res[i].item_id  + ' | Product: ' + res[i].product_name + ' | Department: ' 
                + res[i].department_name + ' | Price: ' + res[i].price + ' | Item Count: ' + res[i].stock_quantity + ' | ');
            }
            managerInput();
        } else {
            console.log('There are no Low Inventory Items to view.')
            managerInput();
        }        
    });
}

function exit() {
    cn.end();
}