import os
import asyncio
from groq import AsyncGroq
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load variables from .env file
load_dotenv()

def get_groq_client(api_key):
    return AsyncGroq(api_key=api_key)

async def ask_groq(prompt: str, api_key: str, model="llama-3.3-70b-versatile") -> str:
    client = get_groq_client(api_key)
    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("⚠️ GROQ_API_KEY not found in .env file!")

@app.route('/ask', methods=['POST'])
async def ask():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        response_content = await ask_groq(prompt, api_key)
        return jsonify({"response": response_content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
