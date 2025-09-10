import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import AsyncGroq
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows the React app to make requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Topic(BaseModel):
    topic: str

def get_groq_client(api_key):
    return AsyncGroq(api_key=api_key)

async def ask_groq(prompt: str, api_key: str, model="llama3-8b-8192") -> str:
    client = get_groq_client(api_key)
    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content

@app.post("/api/explain")
async def explain_topic(topic: Topic):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"error": "GROQ_API_KEY not found in .env file"}

    prompt = f"Explain the topic: {topic.topic}. Please format the explanation in Markdown, using headings, bullet points, and bold text to structure the information for better readability."
    explanation = await ask_groq(prompt, api_key)
    return {"explanation": explanation}

app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)