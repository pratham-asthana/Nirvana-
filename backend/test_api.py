#!/usr/bin/env python3

import requests
import os

# Test the API with a sample video file
def test_analyze_endpoint():
    url = "http://localhost:5000/analyze"
    
    # Use the sample video file
    video_path = os.path.join("pratham(backend)", "media", "videos", "sample.mp4")
    
    if not os.path.exists(video_path):
        print(f"Sample video not found at: {video_path}")
        return
    
    print(f"Testing with video: {video_path}")
    print(f"File size: {os.path.getsize(video_path)} bytes")
    
    try:
        with open(video_path, 'rb') as video_file:
            files = {'video': ('sample.mp4', video_file, 'video/mp4')}
            
            print("Sending request to backend...")
            response = requests.post(url, files=files, timeout=120)
            
            print(f"Response status: {response.status_code}")
            print(f"Response: {response.json()}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_analyze_endpoint()
