# Marketing Pro SaaS Platform

A comprehensive marketing SaaS platform designed to streamline and automate marketing tasks for businesses of all sizes. The platform leverages AI to generate content, provides analytics to measure performance, offers a content calendar for planning, and integrates with various social media platforms for seamless publishing.

## Important Implementation Rule

**CRITICAL**: DO NOT initialize checkpoints until ALL features from the PRD are fully implemented. Each feature must be completed according to the specifications without simplification or elimination of any requirements.

## Features

- **AI-Powered Content Generation**: Text, image, speech, and video generation
- **Content Calendar & Scheduling**: Plan, organize, and schedule content
- **Analytics Dashboard**: Track performance metrics across all marketing channels
- **Social Media Management**: Manage multiple social media accounts from a single interface
- **Settings & Management**: Configure app settings, user management, and subscription details

## Documentation

For complete specifications and implementation details, please refer to the following documentation:

- [Product Requirements](./docs/product_requirements.md)
- [QA Process](./docs/qa_process.md)
- [Implementation Plan](./docs/implementation_plan.md)
- [Build Instructions](./docs/build_instructions.md)
- [Development Prompt](./docs/development_prompt.md)
- [Documentation Overview](./docs/README.md)

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based auth with secure cookies
- **Payment Processing**: Stripe API integration

## Getting Started

1. Clone the repository
2. Use the packager tool to install dependencies
3. Set up environment variables for API keys (see below)
4. Start the development server with the workflow "Start application"
5. Access the application at the provided URL

### Environment Variables & API Keys

This project uses environment variables to store API keys securely. To set up:

1. Copy `.env.example` to a new file named `.env`
2. Fill in the required API keys (see below)
3. Never commit your `.env` file to version control (it's in `.gitignore`)

**Required API Keys:**

- **OpenRouter API Key** - Required for AI text generation
  - Sign up at [OpenRouter.ai](https://openrouter.ai/)
  - Set as `OPENROUTER_API_KEY` in your `.env` file

**Optional API Keys (for additional features):**

- **Stripe** - Required for payment processing 
  - Sign up at [Stripe.com](https://stripe.com)
- **OpenAI, Anthropic, etc.** - For additional AI providers
  - See `.env.example` for the full list

## Development Guidelines

1. Read ALL documentation before starting development
2. Follow the Implementation Plan phases in order
3. Implement ALL requirements specified in the PRD
4. Apply the QA process to each feature as it's developed
5. Only consider a feature complete when it meets ALL requirements and passes ALL quality gates

Remember: No feature can be simplified or eliminated during implementation. The complete marketing SaaS suite must be built exactly as specified in the documentation.

## API Keys and Environment Variables

To properly use this application, you need to set up environment variables for API keys:

1. For development in Replit, use the "Secrets" feature to securely store API keys
2. For local development or other environments, run the included setup script:
   ```bash
   # Run the setup script to create your .env file
   ./setup-env.sh
   ```
3. Alternatively, copy `.env.example` to `.env` and fill in the values manually

See [API Keys Setup Guide](./docs/api_keys_setup.md) for detailed instructions.

⚠️ **IMPORTANT**: Never hardcode API keys directly in your code files. Always use environment variables.
