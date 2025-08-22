from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import sys
import time
from MAIN_MAIN import main

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def index():
    try:
        file = request.files['video']
        
        # Use a relative path from the backend directory
        filepath = "media\\videos\\uploaded_video.webm"
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        file.save(filepath)
        output = main(filepath)
        return jsonify(output)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
