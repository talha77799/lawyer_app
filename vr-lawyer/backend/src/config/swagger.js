import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VR-Digital API',
      version: '1.0.0',
      description:
        'REST API for VR-Digital — Book verified lawyers in Pakistan. Auth, lawyers, appointments, cases, dashboards.',
      contact: { name: 'VR-Digital' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local development' },
      { url: 'http://localhost:5001', description: 'Local (port 5001)' },
      { url: 'http://localhost:5000/api', description: 'API base' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check' },
      { name: 'Auth', description: 'Register, login, profile' },
      { name: 'Lawyers', description: 'Find and register lawyers' },
      { name: 'Appointments', description: 'Book and manage appointments' },
      { name: 'Cases', description: 'Case tracking' },
      { name: 'Dashboard', description: 'Client & lawyer dashboards' },
    ],
    paths: {
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'API health check',
          responses: {
            200: { description: 'Server is running' },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new client or lawyer',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Hassan Mehmood' },
                    email: { type: 'string', example: 'hassan.mehmood@email.com' },
                    password: { type: 'string', example: 'password123' },
                    phone: { type: 'string' },
                    role: { type: 'string', enum: ['client', 'lawyer'], default: 'client' },
                    city: { type: 'string', example: 'Lahore' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Registered successfully (returns token + user)' },
            400: { description: 'Validation error or email exists' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'hassan.mehmood@email.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'JWT token + user' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User object' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/lawyers': {
        get: {
          tags: ['Lawyers'],
          summary: 'List / filter lawyers',
          parameters: [
            { name: 'city', in: 'query', schema: { type: 'string' }, example: 'Lahore' },
            { name: 'area', in: 'query', schema: { type: 'string' }, example: 'Family Law' },
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search name/service' },
            { name: 'online', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
            {
              name: 'sort',
              in: 'query',
              schema: { type: 'string', enum: ['rating', 'fee-low', 'fee-high', 'exp'] },
            },
          ],
          responses: { 200: { description: 'Array of lawyers' } },
        },
      },
      '/api/lawyers/{id}': {
        get: {
          tags: ['Lawyers'],
          summary: 'Get lawyer by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Lawyer profile' },
            404: { description: 'Not found' },
          },
        },
      },
      '/api/lawyers/register': {
        post: {
          tags: ['Lawyers'],
          summary: 'Register as a lawyer (pending verification)',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    phone: { type: 'string' },
                    city: { type: 'string' },
                    specialization: { type: 'string' },
                    experience: { type: 'number' },
                    barCouncil: { type: 'string' },
                    bio: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Registration received' } },
        },
      },
      '/api/lawyers/cities': {
        get: {
          tags: ['Lawyers'],
          summary: 'List major cities',
          responses: { 200: { description: 'Cities array' } },
        },
      },
      '/api/lawyers/practice-areas': {
        get: {
          tags: ['Lawyers'],
          summary: 'List practice areas',
          responses: { 200: { description: 'Practice areas array' } },
        },
      },
      '/api/appointments': {
        get: {
          tags: ['Appointments'],
          summary: 'My appointments',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['upcoming', 'completed', 'cancelled'] },
            },
          ],
          responses: { 200: { description: 'Appointments list' } },
        },
        post: {
          tags: ['Appointments'],
          summary: 'Book an appointment',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['lawyerId', 'date', 'time'],
                  properties: {
                    lawyerId: { type: 'string' },
                    date: { type: 'string', example: '2026-08-20' },
                    time: { type: 'string', example: '11:00' },
                    type: { type: 'string', enum: ['video', 'in-person'] },
                    notes: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Appointment created' } },
        },
      },
      '/api/appointments/calendar': {
        get: {
          tags: ['Appointments'],
          summary: 'Calendar data for current user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Appointments for calendar' } },
        },
      },
      '/api/cases': {
        get: {
          tags: ['Cases'],
          summary: 'My cases',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Cases list' } },
        },
        post: {
          tags: ['Cases'],
          summary: 'Create a case',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'lawyerId'],
                  properties: {
                    title: { type: 'string' },
                    lawyerId: { type: 'string' },
                    description: { type: 'string' },
                    filedDate: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Case created' } },
        },
      },
      '/api/dashboard/client': {
        get: {
          tags: ['Dashboard'],
          summary: 'Client dashboard stats',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Stats, upcoming, cases, recommended lawyers',
            },
          },
        },
      },
      '/api/dashboard/lawyer': {
        get: {
          tags: ['Dashboard'],
          summary: 'Lawyer dashboard stats',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Stats, bookings, earnings, cases',
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);