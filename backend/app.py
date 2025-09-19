from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import sys
import tempfile
from flask_cors import CORS

backend_path = os.path.join(os.path.dirname(__file__), 'pratham(backend)')
sys.path.append(backend_path)

from MAIN_MAIN import main

app = Flask(__name__)
CORS(app)  
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'pratham(backend)', 'media', 'videos')
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'webm'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_video():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    print("=== Received video analysis request ===")
    
    if 'video' not in request.files:
        print("Error: No video file in request")
        return jsonify({'error': 'No video file provided'}), 400
    
    video_file = request.files['video']
    if video_file.filename == '':
        print("Error: Empty filename")
        return jsonify({'error': 'No selected file'}), 400
    
    print(f"Received file: {video_file.filename}")
    
    if video_file and allowed_file(video_file.filename):
        # Create a temporary file with a secure filename
        temp_filename = secure_filename(video_file.filename)
        temp_filepath = os.path.join(UPLOAD_FOLDER, temp_filename)
        
        print(f"Saving video to: {temp_filepath}")
        
        try:
            # Save the uploaded file
            video_file.save(temp_filepath)
            print(f"Video saved successfully. File size: {os.path.getsize(temp_filepath)} bytes")
            
            # Process the video using MAIN_MAIN.py
            print(f"Processing video: {temp_filepath}")
            speech_conf, vision_conf, total_conf, flags, disqualified = main(temp_filepath)
            
            # Print results to console
            print(f"\n=== Video Analysis Results ===")
            print(f"Speech Confidence: {speech_conf}")
            print(f"Vision Confidence: {vision_conf}")
            print(f"Total Confidence: {total_conf}")
            print(f"Flags: {flags}")
            print(f"Disqualified: {disqualified}")
            print("=============================\n")
            sys.stdout.flush()  # Force output to appear immediately
            
            # Prepare response
            response = {
                'speech_confidence': float(speech_conf),
                'vision_confidence': float(vision_conf),
                'total_confidence': float(total_conf),
                'flags': flags,
                'disqualified': disqualified
            }
            
            return jsonify(response)
            
        except Exception as e:
            print(f"Error during processing: {str(e)}")
            return jsonify({'error': str(e)}), 500
        
        finally:
            # Clean up the temporary file (disabled for debugging)
            # if os.path.exists(temp_filepath):
            #     try:
            #         os.remove(temp_filepath)
            #         print(f"Temporary file cleaned up: {temp_filepath}")
            #     except Exception as cleanup_error:
            #         print(f"Warning: Could not clean up file {temp_filepath}: {cleanup_error}")
            pass
    
    print("Error: Invalid file type")
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

@app.route('/test-upload', methods=['POST'])
def test_upload():
    print("=== Test upload endpoint ===")
    if 'video' in request.files:
        file = request.files['video']
        print(f"Received test file: {file.filename}, Size: {len(file.read())} bytes")
        return jsonify({'status': 'Test upload successful', 'filename': file.filename})
    return jsonify({'error': 'No file received'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)