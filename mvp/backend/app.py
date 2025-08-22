from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import sys
from datetime import datetime
from confidence_analyzer import ConfidenceAnalyzer

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'webm', 'avi', 'mov'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize confidence analyzer
analyzer = ConfidenceAnalyzer()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/analyze', methods=['POST'])
def analyze_video():
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        file = request.files['video']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Save uploaded file
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Analyze the video
            results = analyzer.analyze_video(filepath)
            
            # Clean up uploaded file (optional)
            # os.remove(filepath)
            
            return jsonify({
                'success': True,
                'analysis': results,
                'filename': filename
            })
        else:
            return jsonify({'error': 'Invalid file type'}), 400
            
    except Exception as e:
        print(f"Error analyzing video: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/mock-questions', methods=['GET'])
def get_mock_questions():
    """Get a set of mock interview questions"""
    questions = [
        "Tell me about yourself and your background.",
        "What are your greatest strengths?",
        "Describe a challenging situation you faced and how you handled it.",
        "Why are you interested in this position?",
        "Where do you see yourself in 5 years?"
    ]
    return jsonify({'questions': questions})

if __name__ == '__main__':
    print("Starting Nirvana MVP Backend...")
    print("Available endpoints:")
    print("- POST /analyze - Upload video for confidence analysis")
    print("- GET /mock-questions - Get interview questions")
    print("- GET /health - Health check")
    app.run(debug=True, host='0.0.0.0', port=5000)
