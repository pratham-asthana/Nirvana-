def TTS_pyttsx3(text):
    import pyttsx3
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

def TTS_edge(text_sample):
    import edge_tts
    import asyncio
    import pygame

    async def main():
        text = text_sample
        # voice = "en-US-AriaNeural" female
        voice = "en-US-GuyNeural"
        # voice = "en-GB-SoniaNeural" this one is seductive wala
        # voice = "en-US-ChristopherNeural"
        output = "voice.mp3"

        # Generate TTS
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output)

        # Play audio without opening a player
        pygame.mixer.init()
        pygame.mixer.music.load(output)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            pass  # wait until it finishes

    asyncio.run(main())

# TTS_edge(text_sample)
TTS_pyttsx3(text_sample)