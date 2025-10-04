const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
(async ()=>{
  try{
    const email = `script${Date.now()}@example.com`;
    const signupRes = await fetch('http://localhost:3000/auth/signup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Script User Name Long Enough', email, address:'Script address', password:'User@1234'})});
    console.log('signup status',signupRes.status);
    console.log(await signupRes.text());
    const loginRes = await fetch('http://localhost:3000/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email, password:'User@1234'})});
    console.log('login status',loginRes.status);
    console.log(await loginRes.text());
  }catch(e){console.error(e)}
})();
