import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GrillRentBFF API',
      version: '1.0.0',
      description: 'API documentation for GrillRentBFF',
    },
    components: {
      schemas: {
        RegisterUserDto: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            apartment: { type: 'string' },
          },
          required: ['name', 'email', 'password', 'apartment'],
        },
        LoginUserDto: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        UpdateUserProfileDto: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            apartment: { type: 'string' },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
