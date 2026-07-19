from flask import Blueprint, jsonify
from models import Bus

transport_bp = Blueprint('transport', __name__)

@transport_bp.route('/transport/buses', methods=['GET'])
def get_buses():
    buses = Bus.query.all()
    return jsonify([b.to_dict() for b in buses])
