# API Keys Setup Guide

## Environment Variables for API Keys

This project uses environment variables to store API keys securely. The following keys are needed for full functionality:

### Required Keys

- **OPENROUTER_API_KEY** - Required for AI text generation with DeepSeek models
  - Sign up at [OpenRouter.ai](https://openrouter.ai/)

### Optional Keys

- **GEMINI_API_KEY** - For Google Gemini AI models (used as fallback)
- **OPENAI_API_KEY** - For OpenAI models (optional)
- **ANTHROPIC_API_KEY** - For Claude models (optional)
- **STRIPE_SECRET_KEY** - For payment processing (optional during development)

## Setting Up Keys in Different Environments

### In Replit

1. Use the Secrets tab in the Tools panel to add your API keys
2. They will be automatically available as environment variables

### In Local Development or Other IDEs

1. Copy `.env.example` to a new file named `.env`
2. Add your API keys to the `.env` file
3. The application will automatically load these when starting

### IMPORTANT SECURITY NOTES

- NEVER hardcode API keys directly in your code
- NEVER commit `.env` files to version control (they should be in `.gitignore`)
- ALWAYS use environment variables for sensitive credentials
- Frontend code can expose API keys - only use keys in server-side code
