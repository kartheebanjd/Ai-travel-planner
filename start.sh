#!/bin/bash

export $(cat .env | grep GROQ_API_KEY | sed 's/ *= */=/g')

if [ -z "$GROQ_API_KEY" ] || [ "$GROQ_API_KEY" = "gsk_your_api_key_here" ]; then
  echo "Error: Please add your Groq API key to .env file"
  echo "Get your key from: https://console.groq.com/keys"
  exit 1
fi

echo "✈️  Starting AI Travel Planner..."
node server.js
