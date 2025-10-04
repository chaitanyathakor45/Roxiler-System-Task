import request from 'supertest';
import { app } from '../src/server';

describe('smoke', () => {
  it('health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('can get stores listing', async () => {
    const res = await request(app).get('/stores');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
  });
});
