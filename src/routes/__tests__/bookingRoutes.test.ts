import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import routes from '../routes';

const app = express();
app.use(bodyParser.json());
app.use('/api', routes);

describe('Booking Routes', () => {
  const userPayload = { name: 'John Doe', sub: 'user-id' };
  const token = jwt.sign(userPayload, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });

  it('should create a new booking', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resourceId: 'resource-id',
        userId: 'user-id',
        startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
        endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
      });


    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Booking created successfully');
  });

  it('should get all bookings', async () => {
    const response = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get bookings by user', async () => {
    const response = await request(app)
      .get('/api/bookings/user/user-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
