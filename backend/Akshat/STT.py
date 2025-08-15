# STT is required because the candidate (or user) will speak, that audio will be recorded and sent to the Connector
# This file will convert the audio into text and give it back to Connector to send the text to Correctness_Analyser
def Speech_To_Text(AUDIO_FILE):
    import whisper

    # Load the "base" model
    model = whisper.load_model("base")

    # Transcribe an audio file
    result = model.transcribe(AUDIO_FILE)

    # Print recognized text
    return result.get('text')
    # USING GPU WOULD GIVE FASTER RESULTS
