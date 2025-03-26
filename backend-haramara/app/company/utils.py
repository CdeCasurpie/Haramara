from flask import jsonify
from datetime import datetime

def verifications(data):
    required_fields = ["titulo", "price", "start_date", "end_date", "adittional_info", "description", "tags", "vacancies", "ubicacion", "min_age"]
    
    missing = []
    if required_fields:
        for field in required_fields:
            if field not in data or data[field] in [None, "", [], {}]:
                missing.append(field)

    if missing:
        return jsonify({"success": False, "message": f"Campos requeridos: {', '.join(missing)}"}), 400
    print(3)
    # verificiaciones de valores numericos
    try:
        data["price"] = float(data["price"])
        if data["price"] < 0:
            return jsonify({"success": False, "message": "El precio debe ser un número positivo"}), 400
    except ValueError:
        return jsonify({"success": False, "message": "El precio debe ser un número válido"}), 400

    try:
        data["vacancies"] = int(data["vacancies"])
        if data["vacancies"] < 0:
            return jsonify({"success": False, "message": "Las vacantes deben ser un número positivo"}), 400
    except ValueError:
        return jsonify({"success": False, "message": "Las vacantes deben ser un número válido"}), 400

    try:
        data["min_age"] = int(data["min_age"])
        if data["min_age"] < 0:
            return jsonify({"success": False, "message": "La edad mínima debe ser un número positivo"}), 400
    except ValueError:
        return jsonify({"success": False, "message": "La edad mínima debe ser un número válido"}), 400


    # verificamos que las fechas sean válidas
    try:
        data['start_date'] = datetime.strptime(data['start_date'], '%Y-%m-%d')
        data['end_date'] = datetime.strptime(data['end_date'], '%Y-%m-%d')
    except Exception as e:
        return jsonify({"success": False, "message": "Las fechas deben tener el formato 'YYYY-MM-DD'"}), 400
