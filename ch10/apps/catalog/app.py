from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from flasgger import APISpec, Schema, Swagger, fields
from apispec.ext.marshmallow import MarshmallowPlugin
from apispec_webframeworks.flask import FlaskPlugin

app = Flask(__name__)

app.config["SWAGGER"] = {
    "title": "Packt Store Catalog"
}

CORS(app)

@app.route('/', methods=['GET'])
def index():
    return redirect('/swagger')


@app.route('/health', methods=['GET'])
def get_health():
    """
    Health check endpoint
    A simple health check endpoint
    ---
    responses:
      200:
        description: OK
    """
    return {}, 200


@app.route('/products', methods=['GET'])
def get_products():
    """
    Get products
    Returns a list of products available in the catalog
    ---
    produces:
      - application/json
    responses:
      200:
        description: A list of products
        schema:
          type: array
          items:
            $ref: '#/definitions/Product'
    """
    return jsonify(get_products_list())


@app.route('/products/<sku>', methods=['GET'])
def get_product(sku):
    """
    Get product by SKU
    Returns a product from the catalog
    ---
    parameters:
      - in: path
        name: sku
        schema:
          type: string
        required: true
    produces:
      - application/json
    responses:
      200:
        description: The product details if found
        schema:
          $ref: '#/definitions/Product'
      404:
        description: Product not found
    """
    try:
        product = find_product(sku)
        return jsonify(product)
    except:
        return jsonify({}), 404


@app.route('/products', methods=['POST'])
def add_product():
    """
    Add a product
    Adds a product to the catalog
    ---
    parameters:
      - in: body
        name: product
        required: true
        schema:
          $ref: '#/definitions/Product'
    produces:
      - application/json
    responses:
      201:
        description: The product details if added successfully
        schema:
          $ref: '#/definitions/Product'
      409:
        description: Product not added to the catalog
    """
    product = request.get_json()
    try:
        p = find_product(product['sku'])
        if (p != None):
            return jsonify({'message': f'Product with SKU {p["sku"]} already exists.'}), 409
    except StopIteration:
        add_product_to_catalog(product)
        return jsonify(product), 201


@app.route('/products/<sku>/quantity/<quantity>', methods=['POST'])
def update_product_quantity(sku, quantity):
    """
    Update product quantity
    Updates a product quantity in the catalog
    ---
    parameters:
      - in: path
        name: sku
        schema:
          type: string
        required: true
      - in: path
        name: quantity
        schema:
          type: integer
        required: true
    produces:
      - application/json
    responses:
      200:
        description: The product quantity was updated successfully
        schema:
          $ref: '#/definitions/Product'
      404:
        description: Product not found in the catalog
    """
    try:
        product = find_product(sku)
        product['quantity'] = int(quantity)
        return jsonify(product)
    except:
        return jsonify({}), 404


@app.route('/products/<sku>/add-quantity/<quantity>', methods=['POST'])
def add_product_quantity(sku, quantity):
    """
    Add product quantity
    Adds the given quantity to the existing product in the catalog
    ---
    parameters:
      - in: path
        name: sku
        schema:
          type: string
        required: true
      - in: path
        name: quantity
        schema:
          type: integer
        required: true
    produces:
      - application/json
    responses:
      200:
        description: The product quantity was updated successfully
        schema:
          $ref: '#/definitions/Product'
      404:
        description: Product not found in the catalog
    """
    try:
        product = find_product(sku)
        product['quantity'] = product['quantity'] + int(quantity)
        return jsonify(product)
    except:
        return jsonify({}), 404


product_list = [
    {'sku': "1", 'name': 'Product 1', 'quantity': 10, 'price': 100},
    {'sku': "2", 'name': 'Product 2', 'quantity': 20, 'price': 50},
    {'sku': "3", 'name': 'Product 3', 'quantity': 30, 'price': 75},
    {'sku': "4", 'name': 'Product 4', 'quantity': 25, 'price': 60},
    {'sku': "5", 'name': 'Product 5', 'quantity': 50, 'price': 200},
    {'sku': "6", 'name': 'Product 6', 'quantity': 50, 'price': 200},
    {'sku': "7", 'name': 'Product 7', 'quantity': 10, 'price': 100},
    {'sku': "8", 'name': 'Product 8', 'quantity': 20, 'price': 50},
    {'sku': "9", 'name': 'Product 9', 'quantity': 30, 'price': 75},
    {'sku': "10", 'name': 'Product 10', 'quantity': 25, 'price': 60},
    {'sku': "11", 'name': 'Product 11', 'quantity': 50, 'price': 200},
    {'sku': "12", 'name': 'Product 12', 'quantity': 50, 'price': 200},
]


def add_product_to_catalog(product):
    product_list.append(product)


def get_products_list():
    return product_list


def find_product(sku):
    return next(p for p in get_products_list() if p["sku"] == sku)


# Create an APISpec
spec = APISpec(
    title='Packt Store Catalog API',
    version='1.0',
    openapi_version='2.0',
    plugins=[
        FlaskPlugin(),
        MarshmallowPlugin(),
    ]
)
swagger_config = {
    'specs_route': '/swagger/'
}


class ProductSchema(Schema):
    sku = fields.String()
    name = fields.String()
    quantity = fields.Integer()
    price = fields.Float()


template = spec.to_flasgger(
    app,
    definitions=[ProductSchema],
    paths=[get_health, get_products, get_product, add_product,
           update_product_quantity, add_product_quantity]
)

swagger = Swagger(app, template=template, config=swagger_config, merge=True)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5050)
