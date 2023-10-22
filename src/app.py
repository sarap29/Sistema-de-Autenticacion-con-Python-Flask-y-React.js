"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt


#from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configura la extensión Flask-JWT-Extended
app.config["JWT_SECRET_KEY"] = "Sa29ra" # ¡Cambia las palabras "super-secret" por otra cosa!
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response

# Inicio de sesión
# Esta parte del proceso ocurre solo cuando los nuevos tokens fueron generados.

@app.route('/', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'Mensaje': 'Body must be sent'}), 400
    if 'email' not in body:
        return jsonify({'Mensaje': 'Email obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'Mensaje': 'Password obligatorio'}), 400

    #user = User.query.filter_by(email=body['email']).first()
    #user = User.filter.query(email=body['email'], password=body['password']).first()
    user = User.query.filter_by(email=body['email'], password=body['password']).first()

    if user is None:
        return jsonify({'Mensaje': 'El usuario no existe'}), 400
    if user.password != body['password']:
        return jsonify({'Mensaje': 'La contraseña no es correcta'}), 400

    token = create_access_token(identity=user.email)
    return jsonify({'token': token})

@app.route('/private', methods=['GET'])
@jwt_required()
def private():
    email = get_jwt_identity()
    return jsonify({'Mensaje': 'Metodo privado', 'user': email}), 200


# crear un registro de usuario
@app.route('/registrar', methods=['POST'])
def registrar():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'Mensaje':'Body deberia ser enviado'}), 400
    if 'email' not in body:
        return jsonify({'Mensaje':'Es necesario el campo email'}),400
    if 'password' not in body:
        return jsonify({'Mensaje':'Es necesario el campo password'}), 400
    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user = User()
    new_user.email = body['email']
    new_user.password = pw_hash
    new_user.is_active = True
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Usuario con email {} creado' .format(body["email"])})



# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
