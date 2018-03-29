var inquirer = require('inquirer');
var cn = require('./connection.js');
  
cn.connect(function(err) {
    if (err) throw err;
    products();    
    console.log("connected as id " + cn.threadId);
});

function products() {
    cn.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('ID#: ' + res[i].item_id  + ' | Product: ' + res[i].product_name + ' | Department: ' 
            + res[i].department_name + ' | Price: ' + res[i].price + ' | Item Count: ' + res[i].stock_quantity + ' | ');
        }
        console.log("----------------------------------------------------");
        userInput(res);        
    });
}

function userInput(res) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Input poduct ID# for purchase',
            validate: function(value) {
                if(isNaN(value) == false && parseInt(value) > 0  && parseInt(value) <= res.length) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Input quantity of purchase',
            validate: function(value) {
                if(isNaN(value) == false && parseInt(value) > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(function(inputs) {
        
        sales(res, inputs);
    })
    
}

function sales(res, inputs) {
    var id = inputs.id -1;
    var quantity = parseInt(inputs.quantity);
    console.log('ID: ' + inputs.id + ' | Quantity: ' + quantity);
    if (res[id].stock_quantity >= quantity) {
        total = res[id].price * quantity;
        cn.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: (res[id].stock_quantity - quantity)
                },
                {
                    item_id: inputs.id
                }
            ], function(err, res) {
                if (err) throw err;
                console.log('Purchase successful');
                console.log('Purchase cost: ' + total);
                proceed();
            }
        )
    } else {
        console.log('Insufficient stock.  Only ' + res[id].stock_quantity + ' ' + res[id].product_name + ' remaining.');
        proceed();
    }
}

function proceed() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'proceed',
            message: 'Submit another purchase?'
        }
    ]).then(function(select) {
        if (select.proceed) {
            products();
        } else {
            console.log('Ending session');
            cn.end();
        }
    })
}