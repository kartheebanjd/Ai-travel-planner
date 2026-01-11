# AI Travel Planner – Smart Itinerary Generator

A smart, AI-powered web application that generates personalized travel itineraries based on destination, budget, and interests. This project demonstrates the integration of Large Language Models (LLMs) into a full-stack application using a lightweight, zero-dependency Node.js architecture.

## Features

*   **AI-Powered Planning:** Utilizes the Groq API (Llama 3 model) to generate detailed, day-by-day travel itineraries.
*   **Customizable Inputs:** Users can specify destination, budget, interests, and trip duration for a tailored experience.
*   **Zero-Dependency Backend:** Built entirely with Node.js native modules (`http`, `https`, `fs`)—no `npm install` required.
*   **Secure Configuration:** Sensitive API keys are managed via a `.env` file, keeping them safe from version control.
*   **Responsive UI:** A clean and modern interface built with HTML, CSS, and vanilla JavaScript.

## Tech Stack

*   **Backend:** Node.js (Native Modules)
*   **AI Model:** Groq API (Llama 3.1)
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript

## Getting Started

### 1. Prerequisites
*   Node.js installed on your machine.
*   A Groq API key (Get one for free at console.groq.com).

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/kartheebanjd/ai-travel-planner.git
cd ai-travel-planner
```

### 3. Security Setup
Create a `.env` file in the root directory to safely store your API key. This file is ignored by Git to protect your credentials.

```bash
touch .env
```

Add your key to the `.env` file:
```env
GROQ_API_KEY=gsk_your_actual_api_key_here
```

### 4. Run the Application
Start the server:
```bash
node server.js
# OR
bash start.sh
```

Visit **http://localhost:3000** in your browser.
