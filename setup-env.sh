#!/bin/bash

# Marketing Pro SaaS - Environment Setup Script
# This script helps set up the necessary environment variables for the project

# Color codes for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Marketing Pro SaaS - Environment Setup${NC}"
echo "This script will help you set up the environment variables for the project."
echo

# Check if .env file exists
if [ -f .env ]; then
  echo -e "${YELLOW}Warning: .env file already exists. Creating backup...${NC}"
  cp .env .env.backup
  echo "Backup created as .env.backup"
fi

# Create .env file
echo "Creating new .env file..."

# Ask for OpenRouter API Key (required)
echo
echo -e "${GREEN}Required API Keys:${NC}"
echo -e "These keys are needed for core functionality."
echo

read -p "Enter your OpenRouter API Key (required for AI text generation): " openrouter_key
echo "OPENROUTER_API_KEY=$openrouter_key" > .env

# Optional keys
echo
echo -e "${GREEN}Optional API Keys:${NC}"
echo -e "These keys enable additional features but are not required."
echo

read -p "Enter your Gemini API Key (press Enter to skip): " gemini_key
if [ ! -z "$gemini_key" ]; then
  echo "GEMINI_API_KEY=$gemini_key" >> .env
fi

read -p "Enter your OpenAI API Key (press Enter to skip): " openai_key
if [ ! -z "$openai_key" ]; then
  echo "OPENAI_API_KEY=$openai_key" >> .env
fi

read -p "Enter your Stripe Secret Key (press Enter to skip): " stripe_key
if [ ! -z "$stripe_key" ]; then
  echo "STRIPE_SECRET_KEY=$stripe_key" >> .env
fi

# Completion
echo
echo -e "${GREEN}Environment setup complete!${NC}"
echo "The following environment variables have been set:"
echo
cat .env | sed 's/^/  /'
echo
echo -e "${YELLOW}IMPORTANT:${NC} Never commit your .env file to version control."
echo "It contains sensitive API keys and is listed in .gitignore."
echo
echo "For more information on API keys, see docs/api_keys_setup.md"
