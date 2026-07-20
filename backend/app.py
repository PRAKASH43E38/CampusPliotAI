from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from config import Config
from flask_migrate import Migrate
from routes import auth_bp, academics_bp, campus_bp, engagement_bp, resources_bp, transport_bp, ai_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend integration
    CORS(app)

    # Initialize SQLAlchemy database
    db.init_app(app)

    # Initialize Flask-Migrate
    Migrate(app, db)

    # Register blueprints under the /api prefix
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(academics_bp, url_prefix='/api')
    app.register_blueprint(campus_bp, url_prefix='/api')
    app.register_blueprint(engagement_bp, url_prefix='/api')
    app.register_blueprint(resources_bp, url_prefix='/api')
    app.register_blueprint(transport_bp, url_prefix='/api')
    app.register_blueprint(ai_bp, url_prefix='/api')

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'CampusPilot AI Backend is running'}), 200

    # Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

app = create_app()

if __name__ == '__main__':
    # Running on port 5000 by default
    app.run(host='0.0.0.0', port=5000, debug=True)
