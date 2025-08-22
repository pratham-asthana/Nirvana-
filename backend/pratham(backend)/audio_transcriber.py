import whisper 
def transcribe_audio(audio_path):
    model = whisper.load_model("base")
    transcription = model.transcribe(audio_path, language="en", task="transcribe")
    return transcription['text']