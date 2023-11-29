// models.js
'use strict';

class Cart {
    constructor() {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.items = [];
    }
}

class CartItem {
    constructor(sku, name, quantity, price) {
        this.sku = sku;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
}

//export default class { Cart }
export { Cart, CartItem }