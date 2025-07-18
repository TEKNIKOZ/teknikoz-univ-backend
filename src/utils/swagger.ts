export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Teknikoz University API',
    version: '1.0.0',
    description: 'API for managing contact forms and brochure requests',
  },
  servers: [
    {
      url: 'http://localhost:8080/api',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'better-auth.session_token',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
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
          name: { type: 'string', minLength: 2, maxLength: 100 },
          email: { type: 'string', format: 'email', maxLength: 255 },
          phone: { type: 'string', minLength: 10, maxLength: 20 },
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
          },
          message: { type: 'string', maxLength: 1000 },
          form_type: { type: 'string', enum: ['contact', 'brochure'] },
        },
      },
      BrochureRequestForm: {
        type: 'object',
        required: ['name', 'email', 'phone', 'course_interest'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          email: { type: 'string', format: 'email', maxLength: 255 },
          phone: { type: 'string', minLength: 10, maxLength: 20 },
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
          },
          message: { type: 'string', maxLength: 1000 },
        },
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
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        responses: {
          '200': {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/contacts': {
      post: {
        tags: ['Contacts'],
        summary: 'Submit a contact form',
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
                    success: { type: 'boolean' },
                    message: { type: 'string' },
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
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Contacts'],
        summary: 'Get all contacts (Admin only)',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
          {
            name: 'form_type',
            in: 'query',
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
                    success: { type: 'boolean' },
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
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '403': {
            description: 'Insufficient permissions',
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
        summary: 'Get contact by ID (Admin only)',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
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
                    success: { type: 'boolean' },
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
    },
    '/brochure-requests': {
      post: {
        tags: ['Brochure Requests'],
        summary: 'Request a course brochure',
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
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/BrochureRequest' },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Brochure Requests'],
        summary: 'Get all brochure requests (Admin only)',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
          {
            name: 'course_type',
            in: 'query',
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
                    success: { type: 'boolean' },
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
    '/brochure-requests/stats/email-delivery': {
      get: {
        tags: ['Brochure Requests'],
        summary: 'Get email delivery statistics (Admin only)',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Email delivery statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        sent: { type: 'integer' },
                        pending: { type: 'integer' },
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
    '/auth/sign-up': {
      post: {
        tags: ['Authentication'],
        summary: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string', default: 'user' },
                        isActive: { type: 'boolean', default: true },
                        createdAt: { type: 'string', format: 'date-time' },
                      },
                    },
                    session: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        userId: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error or user already exists',
          },
        },
      },
    },
    '/auth/sign-in': {
      post: {
        tags: ['Authentication'],
        summary: 'Sign in to existing account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  rememberMe: { type: 'boolean', default: false },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Sign in successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        isActive: { type: 'boolean' },
                        lastLoginAt: { type: 'string', format: 'date-time' },
                      },
                    },
                    session: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        userId: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/auth/sign-out': {
      post: {
        tags: ['Authentication'],
        summary: 'Sign out of current session',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Sign out successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Signed out successfully' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/session': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current session information',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Current session information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        isActive: { type: 'boolean' },
                        lastLoginAt: { type: 'string', format: 'date-time' },
                      },
                    },
                    session: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        userId: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Not authenticated',
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
  },
};