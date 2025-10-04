// Use the global fetch available in Node 18+
(async ()=>{
  try{
    const signupRes = await fetch('http://localhost:3000/auth/signup',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({
        name:'Chaitanya Ravindra Thakor',
        email:'chaitanyathakor@example.com',
        address:'Swargate, Pune',
        password:'User@1234'
      })
    });
    console.log('signup status',signupRes.status);
    console.log(await signupRes.text());

    const loginRes = await fetch('http://localhost:3000/auth/login',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({
        email:'chaitanyathakor@example.com',
        password:'User@1234'
      })
    });
    console.log('login status',loginRes.status);
    console.log(await loginRes.text());
  }catch(e){console.error(e)}
})();
