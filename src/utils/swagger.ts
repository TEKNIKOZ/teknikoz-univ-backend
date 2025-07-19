export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Teknikoz University API',
    version: '1.0.0',
    description: 'Complete API for managing authentication, contact forms, and brochure requests for Teknikoz University',
    contact: {
      name: 'Teknikoz University',
      email: 'admin@teknikoz.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:8080/api',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token from login response'
      }
    },
    schemas: {
      // Auth Schemas
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          password: { type: 'string', minLength: 6, example: 'Admin@123' }
        }
      },
      SignupRequest: {
        type: 'object',
        required: ['email', 'password', 'username'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', minLength: 6, example: 'Password@123' },
          username: { type: 'string', minLength: 3, example: 'johndoe' },
          role: { type: 'string', enum: ['admin', 'user'], default: 'user' },
          is_active: { type: 'boolean', default: true },
          is_email_verified: { type: 'boolean', default: false }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          username: { type: 'string', example: 'admin' },
          is_active: { type: 'boolean', example: true },
          is_email_verified: { type: 'boolean', example: true },
          roles: { type: 'array', items: { type: 'string' }, example: ['admin'] }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              expiresIn: { type: 'integer', example: 900 }
            }
          }
        }
      },
      TokenRefreshResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Token refreshed successfully' },
          data: {
            type: 'object',
            properties: {
              accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              expiresIn: { type: 'integer', example: 900 }
            }
          }
        }
      },
      // Contact & Brochure Schemas
      Contact: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          course_interest: { type: 'string' },
          message: { type: 'string' },
          form_type: { type: 'string', enum: ['contact', 'brochure'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      BrochureRequest: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          contact_id: { type: 'string', format: 'uuid' },
          course_type: { type: 'string' },
          brochure_name: { type: 'string' },
          email_sent: { type: 'boolean' },
          email_sent_at: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      ContactForm: {
        type: 'object',
        required: ['name', 'email', 'phone', 'course_interest', 'form_type'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100, example: 'John Doe' },
          email: { type: 'string', format: 'email', maxLength: 255, example: 'john@example.com' },
          phone: { type: 'string', minLength: 10, maxLength: 20, example: '+1234567890' },
          course_interest: {
            type: 'string',
            enum: [
              'PLM Windchill',
              'Siemens Teamcenter',
              'Cloud Solutions',
              'Web Development',
              'Data Science',
              'Mobile Development',
              'DevOps',
              'AI/Machine Learning',
              'Cybersecurity',
              'Cloud Computing',
              'Other',
            ],
            example: 'Web Development'
          },
          message: { type: 'string', maxLength: 1000, example: 'I am interested in learning more about this course.' },
          form_type: { type: 'string', enum: ['contact', 'brochure'], example: 'contact' },
        },
      },
      BrochureRequestForm: {
        type: 'object',
        required: ['name', 'email', 'phone', 'course_interest'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100, example: 'Jane Smith' },
          email: { type: 'string', format: 'email', maxLength: 255, example: 'jane@example.com' },
          phone: { type: 'string', minLength: 10, maxLength: 20, example: '+1234567890' },
          course_interest: {
            type: 'string',
            enum: [
              'PLM Windchill',
              'Siemens Teamcenter',
              'Cloud Solutions',
              'Web Development',
              'Data Science',
              'Mobile Development',
              'DevOps',
              'AI/Machine Learning',
              'Cybersecurity',
              'Cloud Computing',
              'Other',
            ],
            example: 'Data Science'
          },
          message: { type: 'string', maxLength: 1000, example: 'Please send me the course brochure.' },
        },
      },
      // Common Response Schemas
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Invalid email format' },
              },
            },
          },
        },
      },
      RateLimitError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Too many requests, please try again later' },
          data: { type: 'null' },
          retryAfter: { type: 'integer', example: 60 }
        }
      }
    },
  },
  paths: {
    // Auth Endpoints
    '/auth/signup': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Create a new user account with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error or user already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '429': {
            description: 'Too many signup attempts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RateLimitError' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        description: 'Authenticate user with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '429': {
            description: 'Too many login attempts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RateLimitError' },
              },
            },
          },
        },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        description: 'Get a new access token using refresh token stored in cookies',
        responses: {
          '200': {
            description: 'Token refreshed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TokenRefreshResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid or expired refresh token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout user',
        description: 'Revoke refresh token and logout user',
        responses: {
          '200': {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['Authentication'],
        summary: 'Get user profile',
        description: 'Get current authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Profile retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/auth/revoke-all-tokens': {
      post: {
        tags: ['Authentication'],
        summary: 'Revoke all tokens',
        description: 'Logout from all devices by revoking all refresh tokens',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'All tokens revoked successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    // Health Check
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        description: 'Check if the API is running',
        responses: {
          '200': {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    service: { type: 'string', example: 'teknikoz-university-api' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    // Contact Endpoints
    '/contacts': {
      post: {
        tags: ['Contacts'],
        summary: 'Submit a contact form',
        description: 'Submit a new contact form inquiry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactForm' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Contact form submitted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Contact form submitted successfully' },
                    data: { $ref: '#/components/schemas/Contact' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '429': {
            description: 'Too many contact form submissions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RateLimitError' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Contacts'],
        summary: 'Get all contacts (Admin)',
        description: 'Retrieve all contact form submissions with pagination',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Number of contacts to return',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of contacts to skip',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
          {
            name: 'form_type',
            in: 'query',
            description: 'Filter by form type',
            schema: { type: 'string', enum: ['contact', 'brochure'] },
          },
        ],
        responses: {
          '200': {
            description: 'List of contacts',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Contact' },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        limit: { type: 'integer' },
                        offset: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/contacts/{id}': {
      get: {
        tags: ['Contacts'],
        summary: 'Get contact by ID',
        description: 'Retrieve a specific contact by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Contact UUID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Contact details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Contact' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Contact not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Contacts'],
        summary: 'Update contact (Admin)',
        description: 'Update contact message',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Contact UUID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: { type: 'string', example: 'Updated message content' }
                }
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Contact updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '404': {
            description: 'Contact not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Contacts'],
        summary: 'Delete contact (Admin)',
        description: 'Delete a contact permanently',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Contact UUID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Contact deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '404': {
            description: 'Contact not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/contacts/email/{email}': {
      get: {
        tags: ['Contacts'],
        summary: 'Get contacts by email (Admin)',
        description: 'Retrieve all contacts for a specific email address',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'email',
            in: 'path',
            required: true,
            description: 'Email address',
            schema: { type: 'string', format: 'email' },
          },
        ],
        responses: {
          '200': {
            description: 'Contacts for email',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Contact' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    // Brochure Request Endpoints
    '/brochure-requests': {
      post: {
        tags: ['Brochure Requests'],
        summary: 'Request a course brochure',
        description: 'Submit a request for a course brochure',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BrochureRequestForm' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Brochure request submitted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Brochure request submitted successfully. Check your email for the brochure.' },
                    data: { $ref: '#/components/schemas/BrochureRequest' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '429': {
            description: 'Too many brochure requests',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RateLimitError' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Brochure Requests'],
        summary: 'Get all brochure requests (Admin)',
        description: 'Retrieve all brochure requests with pagination',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Number of requests to return',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of requests to skip',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
          {
            name: 'course_type',
            in: 'query',
            description: 'Filter by course type',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'List of brochure requests',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/BrochureRequest' },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        limit: { type: 'integer' },
                        offset: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/brochure-requests/{id}': {
      get: {
        tags: ['Brochure Requests'],
        summary: 'Get brochure request by ID',
        description: 'Retrieve a specific brochure request by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Brochure request UUID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Brochure request details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/BrochureRequest' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Brochure request not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Brochure Requests'],
        summary: 'Delete brochure request (Admin)',
        description: 'Delete a brochure request permanently',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Brochure request UUID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Brochure request deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '404': {
            description: 'Brochure request not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/brochure-requests/{id}/resend': {
      post: {
        tags: ['Brochure Requests'],
        summary: 'Resend brochure email (Admin)',
        description: 'Resend the brochure email to the requester',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Brochure request UUID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Brochure resent successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '404': {
            description: 'Brochure request not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/brochure-requests/pending/email-delivery': {
      get: {
        tags: ['Brochure Requests'],
        summary: 'Get pending email deliveries (Admin)',
        description: 'Get list of brochure requests with pending email delivery',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Number of requests to return',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
          },
        ],
        responses: {
          '200': {
            description: 'Pending email deliveries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/BrochureRequest' },
                    },
                    total: { type: 'integer' }
                  },
                },
              },
            },
          },
        },
      },
    },
    '/brochure-requests/stats/email-delivery': {
      get: {
        tags: ['Brochure Requests'],
        summary: 'Get email delivery statistics (Admin)',
        description: 'Get statistics about email delivery success/failure rates',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Email delivery statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer', example: 100 },
                        sent: { type: 'integer', example: 95 },
                        pending: { type: 'integer', example: 5 },
                        success_rate: { type: 'number', format: 'float', example: 0.95 }
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/brochure-requests/contact/{contactId}': {
      get: {
        tags: ['Brochure Requests'],
        summary: 'Get brochure requests by contact ID',
        description: 'Get all brochure requests for a specific contact',
        parameters: [
          {
            name: 'contactId',
            in: 'path',
            required: true,
            description: 'Contact UUID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Brochure requests for contact',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/BrochureRequest' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  },
};