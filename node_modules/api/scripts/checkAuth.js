(async () => {
  const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
  try {
    const signupRes = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Script User Name Long Enough', email: `script${Date.now()}@example.com`, address: 'Script address', password: 'User@1234' }),
    });
    console.log('signup status', signupRes.status, await signupRes.text());
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: `script${Date.now()}@example.com`, password: 'User@1234' }),
    });
    console.log('login status', loginRes.status, await loginRes.text());
  } catch (e) { console.error(e); }
})();
