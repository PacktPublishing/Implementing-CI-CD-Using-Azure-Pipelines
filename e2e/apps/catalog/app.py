from flask import Flask
from flask import jsonify
from flask import request

app = Flask(__name__)

@app.route('/')
def index():
  return 'Server Works!'
  
@app.route('/health')
def return_health():
  return {}, 200

@app.route('/products')
def get_products():
  return jsonify(get_products_list())

@app.route('/products/<sku>', methods=['GET'])
def get_product(sku):
  try:
    product = find_product(int(sku))
    return jsonify(product)
  except:
    return jsonify({}), 404

@app.route('/products', methods=['POST'])
def add_product():
  product = request.get_json()
  try:
    p = find_product(int(product['sku']))
    if (p != None):
      return jsonify({'message': f'Product with SKU {p["sku"]} already exists.'}), 409
  except StopIteration:
    add_product(product)
    return jsonify(product), 201

@app.route('/products/<sku>/quantity/<quantity>', methods=['POST'])
def update_product_quantity(sku, quantity):
  try:
    product = find_product(int(sku))
    product['quantity'] = int(quantity)
    return jsonify(product)
  except:
    return jsonify({}), 404

@app.route('/products/<sku>/add-quantity/<quantity>', methods=['POST'])
def add_product_quantity(sku, quantity):
  try:
    product = find_product(int(sku))
    product['quantity'] = product['quantity'] + int(quantity)
    return jsonify(product)
  except:
    return jsonify({}), 404

product_list = [
    {'sku': 1, 'name': 'Product 1', 'quantity': 10, 'price': 100},
    {'sku': 2, 'name': 'Product 2', 'quantity': 20, 'price': 50},
    {'sku': 3, 'name': 'Product 3', 'quantity': 30, 'price': 75},
    {'sku': 4, 'name': 'Product 4', 'quantity': 25, 'price': 60},
    {'sku': 5, 'name': 'Product 5', 'quantity': 50, 'price': 200},
    {'sku': 6, 'name': 'Product 5', 'quantity': 50, 'price': 200},
  ]

def add_product(product):
  product_list.append(product)

def get_products_list():
  return product_list

def find_product(sku):
  return next(p for p in get_products_list() if p["sku"] == sku)