import cv2
import mediapipe as mp
import numpy as np
import os
import tempfile
from moviepy.editor import VideoFileClip
import speech_recognition as sr
from dotenv import load_dotenv
import openai

load_dotenv()

class ConfidenceAnalyzer:
    def __init__(self):
        # Initialize MediaPipe
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )
        
        # OpenAI setup
        openai.api_key = os.getenv('OPENAI_API_KEY')
        
    def analyze_video(self, video_path):
        """Main analysis function that processes video and returns confidence scores"""
        try:
            # Extract audio and analyze
            audio_path = self.extract_audio(video_path)
            transcript = self.transcribe_audio(audio_path)
            linguistic_score = self.analyze_linguistic_confidence(transcript)
            
            # Analyze video frames
            visual_score = self.analyze_visual_confidence(video_path)
            
            # Calculate overall confidence
            overall_confidence = self.calculate_overall_confidence(
                visual_score, linguistic_score
            )
            
            return {
                'overall_confidence': overall_confidence,
                'visual_confidence': visual_score,
                'linguistic_confidence': linguistic_score,
                'transcript': transcript,
                'recommendations': self.generate_recommendations(
                    visual_score, linguistic_score, transcript
                )
            }
            
        except Exception as e:
            print(f"Error in analysis: {str(e)}")
            return {
                'error': str(e),
                'overall_confidence': 0,
                'visual_confidence': 0,
                'linguistic_confidence': 0,
                'transcript': '',
                'recommendations': []
            }
    
    def extract_audio(self, video_path):
        """Extract audio from video file"""
        try:
            video = VideoFileClip(video_path)
            audio_path = video_path.replace('.webm', '.wav').replace('.mp4', '.wav')
            video.audio.write_audiofile(audio_path, verbose=False, logger=None)
            video.close()
            return audio_path
        except Exception as e:
            print(f"Error extracting audio: {str(e)}")
            return None
    
    def transcribe_audio(self, audio_path):
        """Transcribe audio to text"""
        if not audio_path or not os.path.exists(audio_path):
            return ""
        
        try:
            r = sr.Recognizer()
            with sr.AudioFile(audio_path) as source:
                audio = r.record(source)
                transcript = r.recognize_google(audio)
                return transcript
        except Exception as e:
            print(f"Error transcribing audio: {str(e)}")
            return ""
    
    def analyze_linguistic_confidence(self, transcript):
        """Analyze linguistic confidence using OpenAI"""
        if not transcript or not openai.api_key:
            return 50  # Default score
        
        try:
            prompt = f"""
            Analyze the following interview response and rate the speaker's confidence on a scale of 0-100 based on:
            - Clarity of expression
            - Use of filler words
            - Coherence and structure
            - Professional language
            
            Response: "{transcript}"
            
            Provide only a numerical score (0-100):
            """
            
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=10,
                temperature=0.3
            )
            
            score = int(response.choices[0].text.strip())
            return max(0, min(100, score))  # Ensure score is between 0-100
            
        except Exception as e:
            print(f"Error analyzing linguistic confidence: {str(e)}")
            return 50
    
    def analyze_visual_confidence(self, video_path):
        """Analyze visual confidence from video frames"""
        try:
            cap = cv2.VideoCapture(video_path)
            frame_count = 0
            confidence_scores = []
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                # Process every 10th frame to improve performance
                if frame_count % 10 == 0:
                    score = self.analyze_frame_confidence(frame)
                    if score is not None:
                        confidence_scores.append(score)
            
            cap.release()
            
            if confidence_scores:
                return int(np.mean(confidence_scores))
            else:
                return 50  # Default score
                
        except Exception as e:
            print(f"Error analyzing visual confidence: {str(e)}")
            return 50
    
    def analyze_frame_confidence(self, frame):
        """Analyze confidence indicators in a single frame"""
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb_frame)
            
            if not results.multi_face_landmarks:
                return None
            
            face_landmarks = results.multi_face_landmarks[0]
            landmarks = face_landmarks.landmark
            
            # Basic confidence indicators
            eye_openness = self.calculate_eye_openness(landmarks)
            head_pose = self.calculate_head_pose(landmarks)
            mouth_expression = self.calculate_mouth_confidence(landmarks)
            
            # Combine scores (simple weighted average)
            confidence_score = (eye_openness * 0.4 + head_pose * 0.3 + mouth_expression * 0.3)
            return max(0, min(100, confidence_score))
            
        except Exception as e:
            return None
    
    def calculate_eye_openness(self, landmarks):
        """Calculate eye openness as confidence indicator"""
        try:
            # Left eye landmarks
            left_eye_top = landmarks[159].y
            left_eye_bottom = landmarks[145].y
            left_eye_openness = abs(left_eye_top - left_eye_bottom)
            
            # Right eye landmarks  
            right_eye_top = landmarks[386].y
            right_eye_bottom = landmarks[374].y
            right_eye_openness = abs(right_eye_top - right_eye_bottom)
            
            avg_openness = (left_eye_openness + right_eye_openness) / 2
            # Normalize to 0-100 scale (adjust multiplier based on testing)
            return min(100, avg_openness * 1000)
            
        except:
            return 70  # Default score
    
    def calculate_head_pose(self, landmarks):
        """Calculate head pose confidence (looking straight ahead scores higher)"""
        try:
            # Use nose tip and other facial landmarks to estimate head pose
            nose_tip = landmarks[1]
            left_eye_corner = landmarks[33]
            right_eye_corner = landmarks[263]
            
            # Simple head pose calculation
            eye_center_x = (left_eye_corner.x + right_eye_corner.x) / 2
            head_deviation = abs(nose_tip.x - eye_center_x)
            
            # Lower deviation = higher confidence
            pose_score = max(0, 100 - (head_deviation * 500))
            return pose_score
            
        except:
            return 70  # Default score
    
    def calculate_mouth_confidence(self, landmarks):
        """Calculate mouth expression confidence"""
        try:
            # Mouth landmarks for smile detection
            mouth_left = landmarks[61]
            mouth_right = landmarks[291]
            mouth_top = landmarks[13]
            mouth_bottom = landmarks[14]
            
            # Calculate mouth width vs height ratio
            mouth_width = abs(mouth_right.x - mouth_left.x)
            mouth_height = abs(mouth_top.y - mouth_bottom.y)
            
            # Slight smile indicates confidence
            ratio = mouth_width / mouth_height if mouth_height > 0 else 1
            confidence_score = min(100, ratio * 30)
            
            return confidence_score
            
        except:
            return 60  # Default score
    
    def calculate_overall_confidence(self, visual_score, linguistic_score):
        """Calculate weighted overall confidence score"""
        # Weight linguistic confidence more heavily
        overall = (visual_score * 0.4) + (linguistic_score * 0.6)
        return int(overall)
    
    def generate_recommendations(self, visual_score, linguistic_score, transcript):
        """Generate improvement recommendations"""
        recommendations = []
        
        if visual_score < 60:
            recommendations.append("Maintain better eye contact with the camera")
            recommendations.append("Keep your head straight and avoid excessive movement")
        
        if linguistic_score < 60:
            recommendations.append("Speak more clearly and reduce filler words")
            recommendations.append("Structure your responses more coherently")
        
        if len(transcript.split()) < 20:
            recommendations.append("Provide more detailed responses to questions")
        
        if not recommendations:
            recommendations.append("Great job! Continue practicing to maintain confidence")
        
        return recommendations
