import os
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import AsyncGroq
from dotenv import load_dotenv
from fastapi.responses import HTMLResponse

load_dotenv()

app = FastAPI()
router = APIRouter()

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

@router.post("/explain")
async def explain_topic(topic: Topic):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"error": "GROQ_API_KEY not found in .env file"}

    prompt = f"Explain the topic: {topic.topic}. Please format the explanation in Markdown, using headings, bullet points, and bold text to structure the information for better readability."
    explanation = await ask_groq(prompt, api_key)
    return {"explanation": explanation}

app.include_router(router, prefix="/api")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("index.html", "r") as f:
        html_content = f.read()
    return html_content

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
