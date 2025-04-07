# Programming Context and Guidelines

## Hyper-Rational Development Approach

This document outlines the fundamental programming principles and development approach for our marketing automation platform. It establishes a hyper-rational, first-principles problem-solving framework that guides all code development and architectural decisions.

## Operating Principles

### 1. Deconstruction
- Break down complex features into foundational components
- Challenge all implementation assumptions ruthlessly
- Identify core variables and dependencies in the system
- Map causal relationships explicitly in documentation
- Find the smallest actionable units of code

### 2. Solution Engineering
- Design interventions at high-leverage points in the codebase
- Prioritize features and fixes by impact-to-effort ratio
- Create specific, measurable acceptance criteria
- Build feedback loops into every implementation
- Focus on speed of execution without compromising quality

### 3. Code Quality Protocol
- Call out unclear implementations immediately
- Demand specificity in all interfaces and data structures
- Push back on vague specifications/metrics
- Force clarity through comprehensive documentation
- Insist on comprehensive test coverage

## Code Structure Guidelines

When a file becomes too long, split it into smaller files. When a function becomes too long, split it into smaller functions.

After writing code, deeply reflect on the scalability and maintainability of the code. Produce a 1-2 paragraph analysis of the code change and based on your reflections - suggest potential improvements or next steps as needed.

## Planning Process

When planning changes, deeply reflect upon the changes being requested and analyze existing code to map the full scope of changes needed. Follow this process:

1. Ask 4-6 clarifying questions based on initial findings
2. Draft a comprehensive plan of action
3. Seek approval before implementation
4. Execute all approved steps systematically
5. Report completion of each phase and clarify next steps

## Debugging Methodology

When debugging, follow this exact sequence:

1. Reflect on 5-7 different possible sources of the problem
2. Distill those down to 1-2 most likely sources
3. Add logs to validate assumptions and track data transformations
4. Analyze logs (console, network, server) to confirm suspicions
5. Produce a comprehensive analysis of the issue
6. Implement a targeted fix
7. Remove temporary debugging code after verification

## Security Checklist

All code changes must maintain the following security standards:

### Configuration Security
- ✓ Detect and eliminate secrets in code
- ✓ Keep credentials out of version control
- ✓ Flag and remove hardcoded credentials

### Authentication & Authorization
- ✓ Verify authentication checks are in place
- ✓ Ensure proper authorization patterns
- ✓ Apply principle of least privilege

### Data Protection
- ✓ Encrypt sensitive data
- ✓ Validate all inputs
- ✓ Encode all outputs to prevent XSS
- ✓ Protect against SQL injection

### API Security
- ✓ Implement appropriate rate limiting
- ✓ Ensure proper error handling without information leaks
- ✓ Validate all API inputs

### Dependency Management
- ✓ Use updated dependencies without vulnerabilities
- ✓ Minimize dependencies to reduce attack surface

### Resilience & Availability
- ✓ Implement comprehensive error handling
- ✓ Protect against DoS vulnerabilities
- ✓ Configure appropriate timeouts

## Refactoring Strategy

For large-scale code transformations, use a systematic approach:

1. **Parsing Phase**: Generate a comprehensive understanding of code structure
2. **Mapping Phase**: Create relationship graphs between components
3. **Targeting Phase**: Identify specific areas for refactoring
4. **Transformation Phase**: Apply systematic changes with validation

## Reference Implementation

All implementations should follow these principles and should be validated against this document during code review. Each build step must refer back to these guidelines to ensure proper adherence to our development standards.
