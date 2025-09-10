# AI Learning Assistant

This project is an AI Learning Assistant with a Flask backend and a React frontend.

## How to Run This Project Locally

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

*   **Python 3.x**
*   **pip** (Python package installer)
*   **Node.js** (which includes npm)

### 1. Backend Setup (Python/Flask)

1.  **Navigate to the project root directory** in your terminal:
    ```bash
    cd /path/to/your/AI Learning Assistant
    ```
    (Replace `/path/to/your/AI Learning Assistant` with the actual path to this project on your system.)

2.  **Install Python dependencies:**
    ```bash
    pip install Flask Flask-Cors groq python-dotenv
    pip install "Flask[async]"
    ```

3.  **Set up your Groq API Key:**
    Create a file named `.env` in the project root directory and add your Groq API key:
    ```
    GROQ_API_KEY=your_groq_api_key_here
    ```
    (Replace `your_groq_api_key_here` with your actual Groq API Key.)

4.  **Run the Flask backend server:**
    ```bash
    python main.py
    ```
    The backend will run on `http://127.0.0.1:5000`. Keep this terminal window open.

### 2. Frontend Setup (React)

1.  **Open a new terminal window.**

2.  **Navigate to the `frontend` directory:**
    ```bash
    cd /path/to/your/AI Learning Assistant/frontend
    ```

3.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

4.  **Run the React development server:**
    ```bash
    npm start
    ```
    The frontend will typically open in your web browser at `http://localhost:3000`.

You need both the backend and frontend servers running simultaneously for the application to work correctly.
