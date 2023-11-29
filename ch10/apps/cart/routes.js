import { Cart, CartItem } from './models.js';
import async from 'async';

// Sets up the routes.
export default function setup(app, redisClient) {
    const prefix = 'Cart:';
    var carts = [];

    /**
     * @swagger
     * definitions:
     *   Cart:
     *     type: object
     *     properties:
     *       id: 
     *         type: string
     *       items:
     *         type: array
     *         items:
     *           $ref: '#/definitions/CartItem'
     *   CartItem:
     *     type: object
     *     properties:
     *       sku:
     *         type: string
     *       name:
     *         type: string
     *       quantity:
     *         type: integer
     *       price:
     *         type: number
     */

    /**
     * @swagger
     * tags:
     *   name: Cart
     *   description: Shopping Cart Operations
     */

    /** 
     * @swagger
     * /health:
     *   get:
     *     description: Returns the health of the service
     *     tags: [Cart]  
     *     responses:
     *       200:
     *         description: Service working!
     */
    app.get('/health', (req, res) => {
        res.status(200).send();
    });

    /**
     * @swagger
     * /carts:
     *   get:
     *     description: Returns all shopping carts
     *     tags: [Cart]
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: Cart
     *         schema:
     *           type: array
     *           items: 
     *              $ref: '#/definitions/Cart'
     */
    app.get('/carts', (req, res) => {
        var cs = [];
        redisClient.keys(`${prefix}*`).then((keys) => {
            if (keys) {
                async.map(keys, (key, cb) => {
                    redisClient.json.get(key).then((value) => {
                        var cart = Object.assign(new Cart(), value);
                        cs.push(cart);
                        cb();
                    });
                }, err => {
                    if (err) res.status(404).send();
                    res.json(cs);
                });
            }
        });
    });

    /**
     * @swagger
     * /carts:
     *   post:
     *     description: Creates a new cart
     *     tags: [Cart]
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: Cart
     *         schema:
     *           type: object
     */
    app.post('/carts', (req, res) => {
        var cart = new Cart();
        redisClient.json.set(`${prefix}${cart.id}`, '.', cart);
        res.json(cart);
    });

    /**
     * @swagger
     * /carts/{id}:
     *   get:
     *     description: Returns a shopping cart by its id
     *     tags: [Cart]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Cart
     *         schema:
     *           $ref: '#/definitions/Cart'
     *       404:
     *         description: Cart not found
     */
    app.get('/carts/:id', (req, res) => {
        redisClient.json.get(`${prefix}${req.params.id}`).then((value) => {
            res.json(value);
        });
    });

    /**
     * @swagger
     * /carts/{id}/item:
     *   post:
     *     description: Adds an item to a shopping cart
     *     tags: [Cart]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *       - in: body
     *         name: item
     *         schema:
     *           $ref: '#/definitions/CartItem'
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: Cart
     *         schema:
     *           $ref: '#/definitions/Cart'
     *       404:
     *         description: Cart not found
     */
    app.post('/carts/:id/item', (req, res) => {
        redisClient.json.get(`${prefix}${req.params.id}`).then((value) => {
            var cart = Object.assign(new Cart(), value);
            if (cart) {
                var newItem = Object.assign(new CartItem(), req.body);
                var item = cart.items.find((item) => item.sku == newItem.sku);
                if (item) {
                    item.quantity += newItem.quantity;
                    item.price = newItem.price;
                } else {
                    cart.items.push(newItem);
                }
                redisClient.json.set(`${prefix}${cart.id}`, '.', cart).then(() => {
                    res.json(cart);
                });
            } else {
                res.status(404).send();
            }
        });
    });

    /**
     * @swagger
     * /carts/{id}:
     *   delete:
     *     description: Deletes a shopping cart by its id
     *     tags: [Cart]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Cart deleted
     *       404:
     *         description: Cart not found
     */
    app.delete('/carts/:id', (req, res) => {
        redisClient.json.get(`${prefix}${req.params.id}`).then((value) => {
            if (value) {
                redisClient.del(`${prefix}${req.params.id}`).then(() => {
                    res.status(200).send();
                });
            } else {
                res.status(404).send();
            }
        });
    });

    /**
     * @swagger
     * /carts:
     *   delete:
     *     description: Deletes all shopping carts
     *     tags: [Cart]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Carts deleted
     *       404:
     *         description: Carts not found
     */
    app.delete('/carts', (req, res) => {
        redisClient.keys(`${prefix}*`).then((keys) => {
            if (keys) {
                async.map(keys, (key, cb) => {
                    redisClient.json.del(key).then((value) => {
                        cb();
                    });
                }, err => {
                    if (err) res.status(404).send();
                    res.status(200).send();
                });
            }
        });
    });
}