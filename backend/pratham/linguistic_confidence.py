from openai import OpenAI
import os 
import sys 
from audio_transcriber import transcribe_audio
from dotenv import load_dotenv

def evaluate_linguistic_confidence(audio_path):
    """
    Evaluates the linguistic confidence of a transcription using OpenAI's API.
    
    Parameters:
    audio_path (str): Path to the audio file to be transcribed.
    
    Returns:
    int: Linguistic confidence score between 0 and 100.
    """
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key)
    Transcription = transcribe_audio(audio_path=audio_path)
    prompt = f"""
    You are an expert in evaluating linguistic confidence based on transcriptions. 
    Here is the transcription: {Transcription}
    Please analyze the transcription and provide a confidence score between 0 and 100
    based on the clarity, coherence, and overall quality of the spoken content.
    Provide only the score as an integer without any additional text.
    """
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="gpt-3.5-turbo",
        max_tokens=10,
    )
    confidence_score = chat_completion.choices[0].message.content
    return confidence_score

project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.append(os.path.join(project_root, 'backend'))

audio_path = os.path.join(project_root,'backend', 'media', 'extracted_audio', 'audio_sample.wav')
