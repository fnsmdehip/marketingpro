# UGC AI GENERATOR - SECURE MULTI-PROVIDER IMPLEMENTATION

## HARDENED SYSTEM ARCHITECTURE

The system uses a security-first multi-provider architecture with intelligent routing to leverage free API tiers while providing fallback options when rate limits are hit:

```
┌─────────────────────────────────────┐      ┌──────────────────────────┐
│                                     │      │                          │
│         DigitalOcean VPS            │      │     External Services    │
│                                     │      │                          │
│  ┌───────────────────────────────┐  │      │  ┌──────────────────┐   │
│  │                               │  │      │  │  Hugging Face    │   │
│  │  React Frontend + CSP         │  │      │  │  Inference API   │   │
│  │  (HTTPS Enforced)             │  │      │  └──────────────────┘   │
│  └───────────────────────────────┘  │      │                          │
│           │                         │      │  ┌──────────────────┐   │
│  ┌────────┴────────────────────┐    │      │  │                  │   │
│  │                             │    │      │  │    Replicate     │   │
│  │  Auth Gateway + Rate Limiter├────┼──────┼─▶│    API           │   │
│  │                             │    │      │  │                  │   │
│  └────────────────────────────┬┘    │      │  └──────────────────┘   │
│           │                   │     │      │                          │
│  ┌────────┴──────────────┐    │     │      │  ┌──────────────────┐   │
│  │                       │    │     │      │  │                  │   │
│  │  API Validation Layer │◄───┘     │      │  │  Stability AI    │   │
│  │                       │          │      │  │                  │   │
│  └────────────────────┬──┘          │      │  └──────────────────┘   │
│           │           │             │      │                          │
│  ┌────────┴──────────┐│             │      │  ┌──────────────────┐   │
│  │                   ││             │      │  │                  │   │
│  │  Provider Router  ││             │      │  │  D-ID API        │   │
│  │  + Circuit Breaker│◄────────────┐│      │  │                  │   │
│  └────────────────┬──┘             ││      │  └──────────────────┘   │
│           │       │                ││      │                          │
│  ┌────────┴──────┐│                ││      └──────────────────────────┘
│  │              ││                 ││      
│  │  Job Queue   ││                 ││       ┌──────────────────────┐
│  │  Manager     │◄─────────────────┘│       │                      │
│  └─────────┬────┘│                  │       │  Security Monitoring │
│            │     │                  │       │  + Alerting          │
│  ┌─────────┴─────┴─────────────┐    │       │                      │
│  │                             │    │       └──────────────────────┘
│  │  Encrypted SQLite DB        │◄───┘                 ▲
│  │  (Parameterized Queries)    │                      │
│  └─────────────────────────────┘                      │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Hardened Components:

1. **Auth Gateway + Rate Limiter**: Protects against unauthorized access and DoS attacks
2. **API Validation Layer**: Ensures all inputs are validated and sanitized
3. **Provider Router + Circuit Breaker**: Intelligently routes requests with fallback mechanisms
4. **Job Queue Manager**: Securely processes async jobs with proper error handling
5. **Encrypted Database**: Stores data with parameterized queries to prevent SQL injection
6. **Security Monitoring**: Logs security events and alerts on suspicious activity

## REQUIRED EXTERNAL ACCOUNTS & SECURE HANDLING

### 1. Hugging Face
- **Purpose**: Text-to-Speech models via Inference API
- **Free Tier**: Limited calls per hour
- **Security Classification**: API key with read-only permissions
- **Setup Instructions**:
  1. Visit https://huggingface.co/join and create account with strong password + 2FA
  2. Navigate to Settings > Access Tokens
  3. Generate a token with "read" scope ONLY (principle of least privilege)
  4. Copy and store the token securely (not in version control)
  5. Verify API key permissions to ensure read-only access

### 2. Replicate
- **Purpose**: Text-to-Video and avatar generation models
- **Free Tier**: Limited free credits (~$5) for getting started
- **Security Classification**: API key with model execution permissions
- **Setup Instructions**:
  1. Visit https://replicate.com/signin and create account with strong password + 2FA
  2. Go to https://replicate.com/account/api-tokens
  3. Create new API token with restricted IP access if possible
  4. Copy and store the token securely (not in version control)
  5. Monitor token usage for unauthorized activity

### 3. Stability AI
- **Purpose**: Backup for text-to-video generation
- **Free Tier**: Limited free generations 
- **Security Classification**: API key with generation permissions
- **Setup Instructions**:
  1. Register at https://stability.ai/platform with strong password + 2FA
  2. Navigate to API Keys in your dashboard
  3. Create and copy your API key
  4. Store the key securely (not in version control)
  5. Set usage alerts to detect potential abuse

### 4. D-ID (Optional)
- **Purpose**: Talking head/avatar generation
- **Free Tier**: Free trial/limited credits
- **Security Classification**: API key with creation permissions
- **Setup Instructions**:
  1. Register at https://www.d-id.com/ with strong password + 2FA
  2. Look for API access in your dashboard
  3. Generate API key with minimum required permissions
  4. Store the key securely (not in version control)
  5. Implement expiration and rotation policy

### SECURE API KEY MANAGEMENT
1. **Never store credentials in code or version control**
2. **Use encrypted environment variables or secure secret storage**
3. **Implement API key rotation schedule (every 90 days)**
4. **Monitor API key usage patterns for anomalies**
5. **Set up alerts for unusual activity or rate limit approaches**

## SECURE REPLIT PROMPT

Use this security-hardened prompt with Replit AI to generate a complete application with robust security controls:

```
Create a secure Node.js/Express API with React frontend for a user-generated content (UGC) creator similar to makeugc.ai with comprehensive security features:

1. HARDENED ARCHITECTURE:
- Secure API layer with strong authentication and authorization
- Provider Router pattern with circuit breaker pattern for external service resilience
- SQLite database with parameterized queries and encryption at rest
- Rate-limited endpoints with DDOS protection
- Container security with least privilege principles
- Input validation on ALL endpoints

2. CORE FUNCTIONALITY:
- Text-to-Speech generation with multiple voice options
- Text-to-Video generation with style controls
- Avatar/Talking Head generation (optional)
- Intelligent provider selection with security-focused fallbacks
- Real-time status monitoring with anomaly detection
- Advanced rate limit detection and avoidance

3. SECURITY CONTROLS:
- Content Security Policy (CSP) implementation
- XSS protection via input sanitization and output encoding
- CSRF protection with token validation
- HTTPS enforcement with secure headers
- API key rotation and secure handling
- Secure logging (no sensitive data in logs)
- Request throttling to prevent abuse
- Input validation with schema validation
- Secure session management
- Proper CORS configuration

4. PROVIDER INTEGRATIONS:
- Hugging Face Inference API for TTS (XTTS-v2 model) with secure API key handling
- Replicate API for text-to-video with timeout and error handling
- Stability AI as backup provider with circuit breaker pattern
- Optional: D-ID for avatar generation with secure credential management

5. SECURE DEPLOYMENT:
- Docker container with resource limitations and security hardening
- Nginx configuration with secure headers
- Environment variables for API keys with proper encryption
- Production-ready configuration with security scanning
- Dependency scanning and vulnerability management

6. USER EXPERIENCE WITH SECURITY:
- Clean, modern UI with secure authentication flows
- Real-time status updates with sanitized output
- Transparent communication about security measures
- Authentication with proper password policies and account lockouts
- GDPR-compliant data handling

Include comprehensive error handling that doesn't leak sensitive information, retry logic with exponential backoff, and graceful degradation when free tier limits are reached. The system should automatically switch between providers when rate limits are hit, implement proper timeouts on all external calls, and queue jobs for later processing when all providers are unavailable.
```

## IMPLEMENTATION DETAILS

### Secure Provider Abstraction Layer

```javascript
// src/services/providers/base-provider.js
class BaseProvider {
  constructor(config) {
    // Validate required configuration
    if (!config.name || !config.endpoint || !config.apiKey) {
      throw new Error('Invalid provider configuration: missing required fields');
    }
    
    this.name = config.name;
    this.endpoint = config.endpoint;
    
    // Don't store API key directly in class instance - use getter only
    // This prevents accidental logging of API key in stack traces
    Object.defineProperty(this, '_apiKey', {
      value: config.apiKey,
      writable: false,
      enumerable: false, // Prevent key from being serialized/exposed
    });
    
    this.hourlyLimit = config.hourlyLimit || 10;
    this.dailyLimit = config.dailyLimit || 100;
    this.timeout = Math.min(config.timeout || 30000, 60000); // Cap maximum timeout
    this.retryDelay = config.retryDelay || 1000;
    
    // Add request tracking for rate limiting
    this.requestTimestamps = [];
    
    // Security-focused configuration
    this.validateSSL = config.validateSSL !== false; // Default true
    this.requestLogging = config.requestLogging === true ? true : false; // Default false
    this.maxContentSize = config.maxContentSize || 10 * 1024 * 1024; // 10MB default max
  }
  
  // Secure getter for API key
  get apiKey() {
    return this._apiKey;
  }
  
  // Record request for internal rate limiting
  recordRequest() {
    const now = Date.now();
    this.requestTimestamps.push(now);
    
    // Cleanup old timestamps (older than 1 hour)
    const hourAgo = now - 3600000;
    this.requestTimestamps = this.requestTimestamps.filter(time => time >= hourAgo);
  }
  
  // Check if we should self-limit based on our tracking
  isRateLimitedLocally() {
    // Count requests in last hour
    const hourlyCount = this.requestTimestamps.length;
    return hourlyCount >= this.hourlyLimit;
  }
  
  async callAPI(endpoint, params) {
    // Check local rate limiting first
    if (this.isRateLimitedLocally()) {
      throw {
        status: 429,
        provider: this.name,
        retryAfter: 3600,
        message: 'Local rate limit prevention triggered'
      };
    }
    
    // Validate input size to prevent abuse
    const inputSize = JSON.stringify(params).length;
    if (inputSize > this.maxContentSize) {
      throw {
        status: 413,
        provider: this.name,
        message: 'Request payload too large'
      };
    }
    
    // Record this request attempt
    this.recordRequest();
    
    // To be implemented by concrete providers
    throw new Error('Method not implemented');
  }
  
  isRateLimitError(error) {
    // Default implementation - override in specific providers
    return error.status === 429 || 
           (error.status === 403 && error.message?.includes('rate')) ||
           error.message?.toLowerCase().includes('rate limit');
  }
  
  extractRetryAfter(error) {
    // Try to get retry-after header or default to 1 hour
    return error.headers?.['retry-after'] ? 
           parseInt(error.headers['retry-after']) : 
           3600;
  }
  
  // Sanitize error response to prevent information disclosure
  sanitizeError(error) {
    // Create a clean error object with minimal necessary information
    const sanitizedError = {
      status: error.status || 500,
      provider: this.name,
      message: error.message || 'Unknown error',
      retryAfter: this.isRateLimitError(error) ? this.extractRetryAfter(error) : null
    };
    
    // Ensure no sensitive data is included
    if (sanitizedError.message.includes(this.apiKey)) {
      sanitizedError.message = 'Provider error (sensitive details redacted)';
    }
    
    return sanitizedError;
  }
  
  // Secure logging helper
  secureLog(message, data = {}) {
    if (!this.requestLogging) return;
    
    // Clone data to avoid modifying the original
    const safeData = { ...data };
    
    // Remove sensitive fields
    delete safeData.apiKey;
    delete safeData.authorization;
    delete safeData.auth;
    delete safeData.password;
    delete safeData.secret;
    delete safeData.token;
    
    console.log(`[${this.name}] ${message}`, safeData);
  }
}

module.exports = BaseProvider;
```

### Secure Hugging Face Provider

```javascript
// src/services/providers/huggingface-provider.js
const BaseProvider = require('./base-provider');
const axios = require('axios');
const { sanitizeInput, validateModel } = require('../utils/security');

class HuggingFaceProvider extends BaseProvider {
  constructor(config) {
    super({
      name: 'huggingface',
      endpoint: 'https://api-inference.huggingface.co/models/',
      apiKey: config.apiKey,
      hourlyLimit: 60, // Estimate - adjust based on observations
      dailyLimit: 1000,
      // Set strict timeout to prevent hanging connections
      timeout: config.timeout || 15000,
      ...config
    });
    
    // Allowlist of permitted models for security
    this.allowedModels = new Set([
      'coqui/XTTS-v2',
      'facebook/mms-tts'
      // Add other verified models here
    ]);
    
    // Initialize circuit breaker
    this.consecutiveFailures = 0;
    this.circuitOpen = false;
    this.lastErrorTime = null;
    this.circuitResetTimeout = 300000; // 5 minutes
  }
  
  // Check if circuit breaker is open (service considered down)
  isCircuitOpen() {
    // If circuit is open, check if we should try again
    if (this.circuitOpen) {
      const now = Date.now();
      const timeSinceFailure = now - this.lastErrorTime;
      
      // Reset circuit after timeout period
      if (timeSinceFailure > this.circuitResetTimeout) {
        this.circuitOpen = false;
        this.consecutiveFailures = 0;
        return false;
      }
      return true;
    }
    return false;
  }
  
  // Security validation for model parameter
  validateModelSecurity(model) {
    // Prevent path traversal attacks or unauthorized model access
    if (!this.allowedModels.has(model)) {
      throw {
        status: 403,
        provider: this.name,
        message: `Model "${model}" is not on the approved list for security reasons`
      };
    }
    
    // Validate model name format (prevents injection)
    if (!validateModel(model)) {
      throw {
        status: 400,
        provider: this.name,
        message: 'Invalid model format'
      };
    }
  }
  
  async callAPI(model, params) {
    // Check circuit breaker
    if (this.isCircuitOpen()) {
      throw {
        status: 503,
        provider: this.name,
        message: 'Service temporarily unavailable (circuit breaker open)',
        retryAfter: Math.floor(this.circuitResetTimeout / 1000)
      };
    }
    
    // Security validations
    this.validateModelSecurity(model);
    
    // Sanitize user inputs to prevent injection
    const sanitizedParams = { ...params };
    if (sanitizedParams.inputs?.text) {
      sanitizedParams.inputs.text = sanitizeInput(sanitizedParams.inputs.text);
    }
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.endpoint}${model}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'UGC-Generator/1.0' // Consistent user-agent 
        },
        data: sanitizedParams,
        timeout: this.timeout,
        responseType: params.responseType || 'json',
        // Security options
        maxContentLength: this.maxContentSize,
        maxBodyLength: this.maxContentSize,
        validateStatus: null, // Handle all status codes in catch
        httpsAgent: {
          rejectUnauthorized: this.validateSSL
        }
      });
      
      // Handle unsuccessful status codes
      if (response.status >= 400) {
        this.secureLog('API error response', { 
          status: response.status, 
          model, 
          errorType: 'HTTP Error'
        });
        
        this.consecutiveFailures++;
        this.lastErrorTime = Date.now();
        
        // Trip circuit breaker after multiple failures
        if (this.consecutiveFailures >= 5) {
          this.circuitOpen = true;
        }
        
        if (this.isRateLimitError(response)) {
          throw {
            status: 429,
            provider: this.name,
            retryAfter: this.extractRetryAfter(response),
            message: 'Rate limit exceeded for Hugging Face'
          };
        }
        
        throw {
          status: response.status,
          provider: this.name,
          message: response.data?.error || 'Unknown error from Hugging Face'
        };
      }
      
      // Reset failure counter on success
      this.consecutiveFailures = 0;
      
      return response.data;
    } catch (error) {
      this.consecutiveFailures++;
      this.lastErrorTime = Date.now();
      
      // Trip circuit breaker after multiple failures
      if (this.consecutiveFailures >= 5) {
        this.circuitOpen = true;
      }
      
      // Log error securely (no sensitive data)
      this.secureLog('API call failed', {
        errorType: error.name,
        errorCode: error.code,
        model
      });
      
      if (this.isRateLimitError(error?.response || error)) {
        throw {
          status: 429,
          provider: this.name,
          retryAfter: this.extractRetryAfter(error?.response || error),
          message: 'Rate limit exceeded for Hugging Face'
        };
      }
      
      // Return sanitized error
      throw this.sanitizeError({
        status: error.response?.status || 500,
        provider: this.name,
        message: error.message || 'Unknown error from Hugging Face'
      });
    }
  }
  
  async generateSpeech(text, voice = "en_speaker_1") {
    // Validate input length to prevent abuse
    if (!text || typeof text !== 'string') {
      throw {
        status: 400,
        provider: this.name,
        message: 'Invalid text parameter'
      };
    }
    
    if (text.length > 5000) {
      throw {
        status: 413,
        provider: this.name,
        message: 'Text too long (max 5000 characters)'
      };
    }
    
    // Validate voice parameter
    const allowedVoices = ['en_speaker_1', 'en_speaker_2', 'en_speaker_3', 'en_speaker_4'];
    if (!allowedVoices.includes(voice)) {
      throw {
        status: 400,
        provider: this.name,
        message: 'Invalid voice parameter'
      };
    }
    
    return this.callAPI('coqui/XTTS-v2', {
      inputs: {
        text,
        voice
      },
      responseType: 'arraybuffer'
    });
  }
}

module.exports = HuggingFaceProvider;
```

### Secure Provider Router with Circuit Breaker

```javascript
// src/services/provider-router.js
const db = require('../db');
const { sanitizeError, logSecurityEvent } = require('../utils/security');
const crypto = require('crypto');

class ProviderRouter {
  constructor() {
    this.providers = {};
    this.rateLimitCache = new Map();
    this.securityEvents = new Map();
    
    // Security and monitoring settings
    this.securityMonitoringEnabled = true;
    this.anomalyThreshold = 3; // Number of errors before considering an anomaly
    this.circuitBreakerThreshold = 5; // Consecutive failures before breaking circuit
    this.securityEventRetention = 24 * 60 * 60 * 1000; // 24 hours
    
    // Start security event cleanup interval
    this.securityCleanupInterval = setInterval(() => {
      this.cleanupSecurityEvents();
    }, 3600000); // Run hourly
    
    // Maps tracking provider health status
    this.healthStatus = new Map();
    this.circuitBreakers = new Map();
  }
  
  // Cleanup function to prevent memory leaks
  destroy() {
    if (this.securityCleanupInterval) {
      clearInterval(this.securityCleanupInterval);
    }
  }
  
  // Record security-related events for anomaly detection
  recordSecurityEvent(type, details) {
    const eventId = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    
    const event = {
      id: eventId,
      type,
      timestamp,
      details: { ...details }
    };
    
    // Sanitize any potentially sensitive info
    delete event.details.apiKey;
    delete event.details.token;
    delete event.details.secret;
    
    this.securityEvents.set(eventId, event);
    
    // Log security event if enabled
    if (this.securityMonitoringEnabled) {
      logSecurityEvent(event);
    }
    
    return eventId;
  }
  
  // Clean up old security events to prevent memory leak
  cleanupSecurityEvents() {
    const cutoff = Date.now() - this.securityEventRetention;
    
    for (const [id, event] of this.securityEvents.entries()) {
      if (event.timestamp < cutoff) {
        this.securityEvents.delete(id);
      }
    }
  }
  
  // Detect anomalies in provider usage
  detectAnomalies(providerName, serviceType) {
    const recentEvents = Array.from(this.securityEvents.values())
      .filter(event => 
        event.details.provider === providerName && 
        event.details.serviceType === serviceType &&
        event.timestamp > Date.now() - 3600000 // Last hour
      );
    
    const errorCount = recentEvents.filter(e => 
      e.type === 'error' || e.type === 'rate_limit'
    ).length;
    
    return errorCount >= this.anomalyThreshold;
  }
  
  registerProvider(serviceType, provider, priority = 0) {
    if (!serviceType || !provider) {
      this.recordSecurityEvent('validation_error', {
        message: 'Invalid registerProvider parameters',
        serviceType: !!serviceType ? serviceType : 'undefined',
        providerPresent: !!provider
      });
      throw new Error('Invalid provider registration parameters');
    }
    
    // Ensure service type is valid (preventing injection)
    if (!/^[a-z0-9-]+$/.test(serviceType)) {
      this.recordSecurityEvent('validation_error', {
        message: 'Invalid serviceType format',
        serviceType
      });
      throw new Error('Invalid service type format');
    }
    
    if (!this.providers[serviceType]) {
      this.providers[serviceType] = [];
    }
    
    // Validate provider has required methods
    if (typeof provider.callAPI !== 'function') {
      throw new Error(`Provider ${provider.name} missing required methods`);
    }
    
    this.providers[serviceType].push({
      provider,
      priority,
      registered: Date.now()
    });
    
    // Initialize health status
    this.healthStatus.set(provider.name, {
      status: 'healthy',
      lastChecked: Date.now(),
      successCount: 0,
      failureCount: 0
    });
    
    // Sort by priority (lower number = higher priority)
    this.providers[serviceType].sort((a, b) => a.priority - b.priority);
    
    this.recordSecurityEvent('provider_registered', {
      provider: provider.name,
      serviceType,
      priority
    });
  }
  
  // Check if circuit breaker is open for a provider
  isCircuitOpen(providerName) {
    if (this.circuitBreakers.has(providerName)) {
      const circuitBreaker = this.circuitBreakers.get(providerName);
      
      // Circuit is open
      if (circuitBreaker.open) {
        // Check if we should try again (half-open state)
        const now = Date.now();
        if (now > circuitBreaker.resetTime) {
          // Transition to half-open state
          this.circuitBreakers.set(providerName, {
            ...circuitBreaker,
            halfOpen: true
          });
          return false;
        }
        return true;
      }
    }
    return false;
  }
  
  // Trip circuit breaker for a provider
  tripCircuitBreaker(providerName, durationSeconds = 300) {
    const resetTime = Date.now() + (durationSeconds * 1000);
    
    this.circuitBreakers.set(providerName, {
      open: true,
      halfOpen: false,
      trippedAt: Date.now(),
      resetTime,
      reason: 'consecutive_failures'
    });
    
    this.recordSecurityEvent('circuit_breaker_tripped', {
      provider: providerName,
      resetTime,
      durationSeconds
    });
    
    // Update health status
    this.healthStatus.set(providerName, {
      ...this.healthStatus.get(providerName),
      status: 'unhealthy',
      lastChecked: Date.now()
    });
  }
  
  // Reset circuit breaker when service recovers
  resetCircuitBreaker(providerName) {
    if (this.circuitBreakers.has(providerName)) {
      this.circuitBreakers.set(providerName, {
        open: false,
        halfOpen: false,
        resetAt: Date.now()
      });
      
      this.recordSecurityEvent('circuit_breaker_reset', {
        provider: providerName
      });
      
      // Update health status
      this.healthStatus.set(providerName, {
        ...this.healthStatus.get(providerName),
        status: 'healthy',
        lastChecked: Date.now(),
        failureCount: 0
      });
    }
  }
  
  async isRateLimited(providerName) {
    // Check circuit breaker first
    if (this.isCircuitOpen(providerName)) {
      return true;
    }
    
    // Check cache first
    if (this.rateLimitCache.has(providerName)) {
      const { until } = this.rateLimitCache.get(providerName);
      if (Date.now() < until) {
        return true;
      }
      // Expired rate limit
      this.rateLimitCache.delete(providerName);
    }
    
    try {
      // Check recent usage
      const hourlyUsage = await db.getProviderUsage(providerName, 3600 * 1000);
      const provider = Object.values(this.providers)
        .flat()
        .find(p => p.provider.name === providerName)?.provider;
        
      if (!provider) return false;
      
      const isLimited = hourlyUsage >= provider.hourlyLimit;
      
      if (isLimited) {
        // Record rate limit for monitoring
        this.recordSecurityEvent('rate_limit_approached', {
          provider: providerName,
          hourlyUsage,
          limit: provider.hourlyLimit
        });
      }
      
      return isLimited;
    } catch (error) {
      // If DB error, assume not rate limited but log event
      this.recordSecurityEvent('db_error', {
        provider: providerName,
        operation: 'isRateLimited',
        message: error.message
      });
      return false;
    }
  }
  
  async markRateLimited(providerName, durationSeconds = 3600) {
    const until = Date.now() + (durationSeconds * 1000);
    this.rateLimitCache.set(providerName, { until });
    
    try {
      await db.setRateLimit(providerName, until);
      
      this.recordSecurityEvent('rate_limited', {
        provider: providerName,
        durationSeconds,
        until: new Date(until).toISOString()
      });
    } catch (error) {
      // Still keep in-memory cache even if DB fails
      this.recordSecurityEvent('db_error', {
        provider: providerName,
        operation: 'markRateLimited',
        message: error.message
      });
    }
  }
  
  async getAvailableProvider(serviceType) {
    if (!this.providers[serviceType] || this.providers[serviceType].length === 0) {
      return null;
    }
    
    // First try healthy (non-rate-limited, circuit not open) providers with prioritization
    for (const { provider } of this.providers[serviceType]) {
      // Skip if circuit breaker is open
      if (this.isCircuitOpen(provider.name)) {
        continue;
      }
      
      const isLimited = await this.isRateLimited(provider.name);
      if (!isLimited) {
        return provider;
      }
    }
    
    // If all are rate-limited or down, try testing a half-open circuit
    const halfOpenProviders = this.providers[serviceType]
      .filter(({ provider }) => {
        const circuitBreaker = this.circuitBreakers.get(provider.name);
        return circuitBreaker && circuitBreaker.halfOpen;
      });
    
    if (halfOpenProviders.length > 0) {
      return halfOpenProviders[0].provider;
    }
    
    return null;
  }
  
  async executeService(serviceType, method, params) {
    // Input validation
    if (!serviceType || !method) {
      this.recordSecurityEvent('validation_error', {
        message: 'Missing required parameters',
        serviceType: !!serviceType,
        method: !!method
      });
      
      return {
        status: 'error',
        error: {
          status: 400,
          message: 'Missing required parameters'
        }
      };
    }
    
    // Check provider availability
    const provider = await this.getAvailableProvider(serviceType);
    
    if (!provider) {
      const waitTime = await this.getMinimumWaitTime(serviceType);
      
      this.recordSecurityEvent('all_providers_unavailable', {
        serviceType,
        method,
        waitTime
      });
      
      return {
        status: 'delayed',
        message: 'All providers are currently unavailable',
        estimatedWaitTime: waitTime
      };
    }
    
    // Security checks before execution
    if (typeof provider[method] !== 'function') {
      this.recordSecurityEvent('method_not_found', {
        provider: provider.name,
        serviceType,
        method
      });
      
      return {
        status: 'error',
        error: {
          status: 400,
          message: `Method ${method} not supported by provider ${provider.name}`
        }
      };
    }
    
    // Check for anomalies before execution
    const hasAnomalies = this.detectAnomalies(provider.name, serviceType);
    if (hasAnomalies) {
      this.recordSecurityEvent('anomaly_detected', {
        provider: provider.name,
        serviceType,
        method
      });
      
      // Don't fail, but log for investigation
    }
    
    try {
      // Execute the service method
      const result = await provider[method](params);
      
      // Record successful call
      try {
        await db.recordSuccessfulCall(provider.name, serviceType);
      } catch (dbError) {
        // Non-fatal, just log
        this.recordSecurityEvent('db_error', {
          provider: provider.name,
          operation: 'recordSuccessfulCall',
          message: dbError.message
        });
      }
      
      // Update health status
      const health = this.healthStatus.get(provider.name) || {
        status: 'healthy',
        successCount: 0,
        failureCount: 0
      };
      
      this.healthStatus.set(provider.name, {
        ...health,
        status: 'healthy',
        lastChecked: Date.now(),
        successCount: health.successCount + 1,
        failureCount: 0 // Reset failures on success
      });
      
      // Reset circuit breaker if it was half-open
      if (this.circuitBreakers.has(provider.name) && 
          this.circuitBreakers.get(provider.name).halfOpen) {
        this.resetCircuitBreaker(provider.name);
      }
      
      return {
        status: 'success',
        result,
        provider: provider.name
      };
    } catch (error) {
      // Secure error handling
      const sanitizedError = sanitizeError(error);
      
      try {
        // Record failed call in database
        await db.recordFailedCall(
          provider.name, 
          serviceType, 
          sanitizedError.status || 500, 
          sanitizedError.message || 'Unknown error'
        );
      } catch (dbError) {
        // Non-fatal, just log
        this.recordSecurityEvent('db_error', {
          provider: provider.name,
          operation: 'recordFailedCall',
          message: dbError.message
        });
      }
      
      // Update health metrics
      const health = this.healthStatus.get(provider.name) || {
        status: 'healthy',
        successCount: 0,
        failureCount: 0
      };
      
      const newFailureCount = health.failureCount + 1;
      
      this.healthStatus.set(provider.name, {
        ...health,
        lastChecked: Date.now(),
        failureCount: newFailureCount,
        // Mark as degraded if multiple failures
        status: newFailureCount >= 2 ? 'degraded' : health.status
      });
      
      // Trip circuit breaker if too many consecutive failures
      if (newFailureCount >= this.circuitBreakerThreshold) {
        this.tripCircuitBreaker(provider.name);
      }
      
      // Security event for tracking
      this.recordSecurityEvent('provider_error', {
        provider: provider.name,
        serviceType,
        method,
        errorStatus: sanitizedError.status || 500,
        failureCount: newFailureCount
      });
      
      // Handle rate limiting by trying another provider
      if (sanitizedError.status === 429) {
        await this.markRateLimited(
          provider.name, 
          sanitizedError.retryAfter || 3600
        );
        
        // Try next provider with recursion
        return this.executeService(serviceType, method, params);
      }
      
      // Return sanitized error details
      return {
        status: 'error',
        error: sanitizedError,
        provider: provider.name
      };
    }
  }
  
  async getMinimumWaitTime(serviceType) {
    if (!this.providers[serviceType] || this.providers[serviceType].length === 0) {
      return Infinity;
    }
    
    // Get the earliest time when a provider will be available again
    const providers = this.providers[serviceType];
    let minTime = Infinity;
    
    for (const { provider } of providers) {
      // Check circuit breaker first
      if (this.circuitBreakers.has(provider.name)) {
        const circuitBreaker = this.circuitBreakers.get(provider.name);
        if (circuitBreaker.open) {
          minTime = Math.min(minTime, circuitBreaker.resetTime);
          continue;
        }
      }
      
      // Then check rate limits
      if (this.rateLimitCache.has(provider.name)) {
        const { until } = this.rateLimitCache.get(provider.name);
        minTime = Math.min(minTime, until);
      } else {
        // At least one provider not rate limited
        return 0;
      }
    }
    
    return minTime === Infinity ? 3600 * 1000 : Math.max(0, minTime - Date.now());
  }
  
  // Get health status of all providers
  getSystemHealth() {
    const health = {
      overall: 'healthy',
      providers: {},
      rateLimits: {},
      circuitBreakers: {}
    };
    
    // Map all providers
    for (const [serviceType, providers] of Object.entries(this.providers)) {
      health.providers[serviceType] = providers.map(({ provider, priority }) => {
        const providerHealth = this.healthStatus.get(provider.name) || { status: 'unknown' };
        
        return {
          name: provider.name,
          status: providerHealth.status,
          priority,
          lastChecked: providerHealth.lastChecked
        };
      });
      
      // Count available providers
      const availableCount = providers.filter(({ provider }) => {
        return !this.isCircuitOpen(provider.name) && 
               !this.rateLimitCache.has(provider.name);
      }).length;
      
      if (availableCount === 0) {
        health.overall = 'degraded';
      }
    }
    
    // Rate limit status
    for (const [provider, { until }] of this.rateLimitCache.entries()) {
      health.rateLimits[provider] = {
        rateLimitedUntil: until,
        remainingTime: Math.max(0, until - Date.now())
      };
    }
    
    // Circuit breaker status
    for (const [provider, breaker] of this.circuitBreakers.entries()) {
      if (breaker.open) {
        health.circuitBreakers[provider] = {
          status: breaker.halfOpen ? 'half-open' : 'open',
          trippedAt: breaker.trippedAt,
          resetTime: breaker.resetTime,
          remainingTime: Math.max(0, breaker.resetTime - Date.now())
        };
      }
    }
    
    return health;
  }
}

module.exports = new ProviderRouter();
```

### Job Queue

```javascript
// src/services/job-queue.js
const db = require('../db');
const providerRouter = require('./provider-router');
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events');

class JobQueue extends EventEmitter {
  constructor() {
    super();
    this.processing = false;
    this.processInterval = null;
  }
  
  start() {
    if (this.processInterval) return;
    this.processInterval = setInterval(() => this.processJobs(), 10000);
  }
  
  stop() {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
  }
  
  async addJob(serviceType, method, params, priority = 1) {
    const jobId = uuidv4();
    
    await db.addJob({
      id: jobId,
      serviceType,
      method,
      params: JSON.stringify(params),
      status: 'pending',
      priority,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    // Start processing if not already
    this.ensureProcessing();
    
    return jobId;
  }
  
  ensureProcessing() {
    if (!this.processing) {
      this.processJobs();
    }
  }
  
  async processJobs() {
    if (this.processing) return;
    
    this.processing = true;
    
    try {
      // Get pending jobs ordered by priority and creation time
      const jobs = await db.getPendingJobs(5);
      
      for (const job of jobs) {
        // Don't process jobs for services where all providers are rate limited
        const waitTime = await providerRouter.getMinimumWaitTime(job.serviceType);
        
        if (waitTime > 0) {
          // Update the job with estimated wait time
          await db.updateJob(job.id, {
            estimatedWaitTime: waitTime,
            updatedAt: Date.now()
          });
          continue;
        }
        
        // Update to processing
        await db.updateJob(job.id, {
          status: 'processing',
          updatedAt: Date.now()
        });
        
        // Process the job
        const params = JSON.parse(job.params);
        const result = await providerRouter.executeService(
          job.serviceType, 
          job.method, 
          params
        );
        
        if (result.status === 'success') {
          await db.updateJob(job.id, {
            status: 'completed',
            result: JSON.stringify(result.result),
            completedAt: Date.now(),
            updatedAt: Date.now()
          });
          
          this.emit('job:completed', job.id, result.result);
        } else if (result.status === 'delayed') {
          // Put back in queue with estimated wait time
          await db.updateJob(job.id, {
            status: 'pending',
            estimatedWaitTime: result.estimatedWaitTime,
            updatedAt: Date.now()
          });
        } else {
          // Error
          await db.updateJob(job.id, {
            status: 'failed',
            error: JSON.stringify(result.error),
            updatedAt: Date.now()
          });
          
          this.emit('job:failed', job.id, result.error);
        }
      }
    } catch (error) {
      console.error('Error processing jobs:', error);
    } finally {
      this.processing = false;
    }
  }
  
  async getJob(jobId) {
    return db.getJob(jobId);
  }
}

module.exports = new JobQueue();
```

### API Endpoint Examples

```javascript
// src/routes/generation.js
const express = require('express');
const router = express.Router();
const providerRouter = require('../services/provider-router');
const jobQueue = require('../services/job-queue');

// Text-to-Speech endpoint
router.post('/speech', async (req, res) => {
  const { text, voice } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  // Try immediate execution
  const result = await providerRouter.executeService(
    'text-to-speech', 
    'generateSpeech', 
    { text, voice }
  );
  
  if (result.status === 'success') {
    // Return audio data directly
    return res.json({
      status: 'success',
      result: result.result
    });
  }
  
  if (result.status === 'delayed') {
    // Add to queue
    const jobId = await jobQueue.addJob(
      'text-to-speech',
      'generateSpeech',
      { text, voice }
    );
    
    return res.status(202).json({
      status: 'queued',
      jobId,
      message: 'All providers are currently rate limited. Job added to queue.',
      estimatedWaitTime: result.estimatedWaitTime
    });
  }
  
  // Error
  return res.status(500).json({
    status: 'error',
    error: result.error
  });
});

// Text-to-Video endpoint
router.post('/video', async (req, res) => {
  const { prompt, style, duration } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  // Video generation is resource-intensive, always queue
  const jobId = await jobQueue.addJob(
    'text-to-video',
    'generateVideo',
    { prompt, style, duration }
  );
  
  return res.status(202).json({
    status: 'queued',
    jobId,
    message: 'Video generation job added to queue.'
  });
});

// Job status endpoint
router.get('/job/:jobId', async (req, res) => {
  const { jobId } = req.params;
  
  const job = await jobQueue.getJob(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  const response = {
    id: job.id,
    status: job.status,
    serviceType: job.serviceType,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  };
  
  if (job.estimatedWaitTime) {
    response.estimatedWaitTime = job.estimatedWaitTime;
  }
  
  if (job.status === 'completed') {
    response.result = JSON.parse(job.result);
    response.completedAt = job.completedAt;
  }
  
  if (job.status === 'failed') {
    response.error = JSON.parse(job.error);
  }
  
  return res.json(response);
});

module.exports = router;
```

## DEPLOYMENT CONFIGURATION

### Docker Compose

```yaml
# docker-compose.yml
version: '3'

services:
  ugc-app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - REPLICATE_API_KEY=${REPLICATE_API_KEY}
      - STABILITY_API_KEY=${STABILITY_API_KEY}
      - DID_API_KEY=${DID_API_KEY}
    volumes:
      - ./data:/app/data
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/ugc-app
server {
    listen 80;
    server_name ugc.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SETUP SCRIPT

```bash
#!/bin/bash

# Ensure Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker not found, installing..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  rm get-docker.sh
fi

# Create project directory
mkdir -p ~/ugc-app/data
cd ~/ugc-app

# Create .env file
cat > .env << EOL
HUGGINGFACE_API_KEY=your_huggingface_token
REPLICATE_API_KEY=your_replicate_token
STABILITY_API_KEY=your_stability_token
DID_API_KEY=your_did_token
EOL

echo "Remember to update .env with your actual API keys"

# Setup Nginx
if command -v nginx &> /dev/null; then
  echo "Setting up Nginx..."
  cat > /tmp/ugc-app << EOL
server {
    listen 80;
    server_name ugc.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

  sudo mv /tmp/ugc-app /etc/nginx/sites-available/
  sudo ln -sf /etc/nginx/sites-available/ugc-app /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl reload nginx
fi

echo "Setup complete! Next steps:"
echo "1. Update .env with your API keys"
echo "2. Deploy the app from Replit"
echo "3. Run 'docker-compose up -d' to start the app"
```

## SECURITY & SCALING CONSIDERATIONS

### 1. Security Monitoring & Incident Response

1. **Threat Monitoring**:
   - Implement real-time security event monitoring
   - Set up alerting for suspicious patterns
   - Create a security incident response plan

2. **Vulnerability Management**:
   - Establish regular dependency scanning (weekly minimum)
   - Implement automated patching for critical vulnerabilities
   - Conduct periodic security audits

3. **Access Control Hardening**:
   - Implement IP-based access restrictions for admin functions
   - Add multi-factor authentication for sensitive operations
   - Create role-based access control as user base grows

### 2. Data Protection & Privacy

1. **Data Minimization**:
   - Review collected data and eliminate unnecessary storage
   - Implement automatic data purging for inactive users
   - Create data classification policies

2. **Privacy Controls**:
   - Add user consent mechanisms for data processing
   - Implement data subject access request handling
   - Create privacy policy compliant with regulations

3. **Encryption Enhancements**:
   - Implement end-to-end encryption for sensitive operations
   - Add field-level encryption for PII
   - Store encryption keys separately from data

### 3. Secure Scaling

1. **Database Security**:
   - Migrate from SQLite to PostgreSQL with encryption
   - Implement connection pooling with proper authentication
   - Set up database activity monitoring

2. **Microservice Isolation**:
   - Create service boundaries with access controls
   - Implement API gateways with security filtering
   - Add service-to-service authentication

3. **Secure Horizontal Scaling**:
   - Deploy stateless services for easier scaling
   - Implement secure session distribution
   - Add load balancing with security filtering

### 4. Operational Security

1. **Secure DevOps**:
   - Implement secure CI/CD pipelines with automated testing
   - Add infrastructure-as-code security scanning
   - Create immutable infrastructure patterns

2. **Disaster Recovery**:
   - Implement encrypted backups with access controls
   - Create business continuity procedures
   - Test recovery scenarios regularly

3. **Security Documentation**:
   - Create and maintain security architecture documentation
   - Implement change management procedures
   - Establish security training for all team members

### 5. Secure Monetization Strategy

1. **Payment Processing Security**:
   - Use established payment processors with PCI compliance
   - Implement tokenization for payment information
   - Add fraud detection mechanisms

2. **Secure User Tiers**:
   - Create secure role-based access controls
   - Implement resource isolation between tiers
   - Add usage monitoring with anomaly detection

3. **Business Continuity**:
   - Create redundancy for critical services
   - Implement secure failover mechanisms
   - Establish SLAs with security guarantees
