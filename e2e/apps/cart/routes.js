import { Cart, CartItem } from './models.js';

// Sets up the routes.
export default function setup(app) {
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
        res.json(carts);
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
        carts.push(cart);
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
        var cart = carts.find((cart) => cart.id == req.params.id);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send();
        }
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
        var cart = carts.find((cart) => cart.id == req.params.id);
        if (cart) {
            var item = Object.assign(new CartItem(), req.body);
            cart.items.push(item);
            res.json(cart);
        } else {
            res.status(404).send();
        }
    });
}