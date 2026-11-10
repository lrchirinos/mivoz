import os
import asyncio
import edge_tts
import urllib.request

VOICE = "es-PE-AlexNeural"
RATE = "-5%" # slightly calmer for stroke rehabilitation clarity

AUDIO_DIR = os.path.join("public", "audio", "male")
PIPER_DIR = os.path.join("public", "piper")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(PIPER_DIR, exist_ok=True)

PHRASES = {
    "btn-1.mp3": "Quiero ir al baño, por favor.",
    "btn-2.mp3": "Tengo hambre o sed.",
    "btn-3.mp3": "Tengo calor, por favor abre la ventana.",
    "btn-4.mp3": "Quiero salir o cambiar de posición.",
    "btn-5.mp3": "¡Atención por favor, me duele algo y necesito ayuda urgente!",
    "btn-6.mp3": "Necesito otra cosa, por favor ven a verme.",
    "btn-yes.mp3": "Sí.",
    "btn-no.mp3": "No.",
    "phrase-0.mp3": "Muchas gracias.",
    "phrase-1.mp3": "Por favor.",
    "phrase-2.mp3": "Tengo frío.",
    "phrase-3.mp3": "Quiero dormir.",
    "phrase-4.mp3": "¿Qué hora es?",
    "phrase-5.mp3": "Llama a mi familia, por favor.",
    "phrase-6.mp3": "Todo está bien.",
    "phrase-7.mp3": "Por favor, un vaso de agua.",
    "phrase-8.mp3": "Quiero descansar.",
    "phrase-9.mp3": "Por favor, enciende la televisión.",
}

async def generate_audios():
    print(f"Generando {len(PHRASES)} audios neuronales masculinos con {VOICE}...")
    for filename, text in PHRASES.items():
        filepath = os.path.join(AUDIO_DIR, filename)
        if not os.path.exists(filepath):
            communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
            await communicate.save(filepath)
            print(f" [OK] {filename} -> {text}")
        else:
            print(f" [EXISTE] {filename}")

def download_piper_models():
    base_url = "https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_MX/ald/medium"
    files = ["es_MX-ald-medium.onnx.json", "es_MX-ald-medium.onnx"]
    
    for f in files:
        target = os.path.join(PIPER_DIR, f)
        if not os.path.exists(target):
            url = f"{base_url}/{f}"
            print(f"Descargando {f} desde HuggingFace...")
            urllib.request.urlretrieve(url, target)
            print(f" [OK] Descargado: {f} ({os.path.getsize(target)} bytes)")
        else:
            print(f" [EXISTE] {f} ({os.path.getsize(target)} bytes)")

if __name__ == "__main__":
    asyncio.run(generate_audios())
    download_piper_models()
    print("Todos los recursos de voz masculina han sido preparados correctamente.")
