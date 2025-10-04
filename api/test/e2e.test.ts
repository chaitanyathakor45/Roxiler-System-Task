import request from 'supertest';
import { app } from '../src/server';

describe('e2e', () => {
  it('signup -> login -> rate flow', async () => {
    const unique = Date.now();
    const email = `e2e${unique}@example.com`;
    const signup = await request(app).post('/auth/signup').send({ name: 'E2E Tester Long Name Here', email, address: 'E2E', password: 'User@1234' });
    expect([201,409]).toContain(signup.status);

    const login = await request(app).post('/auth/login').send({ email, password: 'User@1234' });
    expect(login.status).toBe(200);
    const token = login.body.token as string;
    expect(token).toBeTruthy();

    // find a store to rate
    const stores = await request(app).get('/stores');
    expect(stores.status).toBe(200);
    const storeId = stores.body.items?.[0]?.id;
    if (!storeId) return;

    const res = await request(app).post(`/stores/${storeId}/ratings`).set('Authorization', `Bearer ${token}`).send({ value: 4 });
    expect([200,201]).toContain(res.status);
  }, 20000);
});
