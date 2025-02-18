import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import routes from '../routes';

const app = express();
app.use(bodyParser.json());
app.use('/api', routes);

describe('Booking Routes', () => {
  it('should create a new booking', async () => {
    const token = 'fake-jwt-token'; // Simule um token JWT válido

    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resourceId: 'resource-id',
        startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
        endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Booking created successfully');
  });

  it('should get all bookings', async () => {
    const token = 'fake-jwt-token'; // Simule um token JWT válido

    const response = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get bookings by user', async () => {
    const token = 'fake-jwt-token'; // Simule um token JWT válido

    const response = await request(app)
      .get('/api/bookings/user/user-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
