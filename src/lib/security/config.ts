export const securityConfig = {
    cors: {
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'X-Requested-With',
        'Content-Type',
        'Authorization',
      ],
      credentials: true,
    },
    csp: {
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://cdnjs.cloudflare.com',
          'https://www.googletagmanager.com',
          'https://static.hotjar.com',
          'https://*.hotjar.com',
          'https://www.google-analytics.com'
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': [
          "'self'",
          'data:',
          'https:',
          'blob:',
          '*.cloudinary.com',
          'https://www.google-analytics.com'
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'connect-src': [
          "'self'",
          'https://api.cloudinary.com',
          'https://*.hotjar.com',
          'wss://*.hotjar.com',
          'https://www.google-analytics.com'
        ],
        'frame-src': ["'self'", 'https://*.hotjar.com'],
        'object-src': ["'none'"],
        'media-src': ["'self'"],
        'child-src': ["'self'", 'https://*.hotjar.com']
      },
    },
    rateLimit: {
      window: 60 * 1000,
      max: 100,
    }
  }