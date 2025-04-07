# AI Integration Guidelines

## Overview

This document provides guidance for integrating AI models into our Marketing SaaS application. Follow these instructions to ensure proper implementation, authentication, debugging, and maintenance.

## Context File Usage

The `context-guidelines.md` file contains essential marketing context that should be referenced before generating any marketing content. This file should be:

1. **Loaded before prompt processing**: The content should be added as context to all marketing-related AI prompts
2. **Referenced explicitly**: Prompts should include an instruction to "refer to the provided context"
3. **Updated regularly**: As marketing standards and capabilities evolve, this file should be kept current

## Authentication Structure

### Provider Authentication

1. **Environment Variables**: All API keys must be stored in environment variables, never in code
2. **Secrets Management**: Use Replit Secrets for development and proper key management in production
3. **Fallback Providers**: Configure multiple providers (DeepSeek, Gemini, etc.) with proper fallback logic
4. **Circuit Breaking**: Implement circuit breaking pattern to prevent cascading failures

### API Key Formats

- **OpenRouter**: Keys start with `sk-or-v1-`
- **Gemini**: Keys are typically 39 characters
- **OpenAI**: Keys start with `sk-`

## Debugging AI Integrations

When errors occur in AI generation:

1. **Log Request/Response**: Capture full details of each request and response
2. **Validate API Key Format**: Confirm keys match expected formats
3. **Check Provider Status**: Verify provider service status
4. **Review Rate Limits**: Check if you've hit provider rate limits
5. **Test Alternative Models**: Try different models to isolate issues
6. **Parse Error Responses**: Extract specific error codes and messages

## Error Handling Strategy

- **User-Facing Errors**: Translate technical errors into actionable messages
- **Fallback Content**: Provide alternatives when generation fails
- **Retry Logic**: Implement exponential backoff for transient failures
- **Monitoring**: Track error rates by provider and model

## Security Considerations

1. **Prompt Injection Prevention**: Sanitize inputs to prevent prompt manipulation
2. **Content Filtering**: Apply content safety filters appropriate to the use case
3. **User Data Protection**: Minimize passing PII to external AI providers
4. **Audit Logging**: Maintain logs of all AI requests for security review

## Performance Optimization

- **Caching**: Cache common AI responses where appropriate
- **Prompt Efficiency**: Optimize prompts to reduce token usage
- **Batch Processing**: Group related requests where possible
- **Asynchronous Generation**: Use background processing for non-interactive generation

## Implementation Checklist

- [ ] Environment variables configured
- [ ] Context file properly loaded
- [ ] Error handling implemented
- [ ] Fallback providers configured
- [ ] Logging and monitoring in place
- [ ] Security reviews completed
- [ ] Performance optimization applied

## Troubleshooting Common Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| "Invalid API key" | Key format incorrect or expired | Verify key format and regenerate if needed |
| "Failed to parse response" | API response format changed | Update response parsing logic |
| "Rate limit exceeded" | Too many requests | Implement rate limiting and backoff |
| "Provider unavailable" | Service outage | Activate fallback provider |
| "Content filtered" | Safety filters triggered | Review prompt for problematic content |

---

*Last updated: April 7, 2025*
