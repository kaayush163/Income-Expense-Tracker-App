let url = "http://localhost:3000/user";
const myForm = document.getElementById("my-form");
const PassWord = document.getElementById("password");
const Email = document.getElementById("email");

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
try{
   e.preventDefault();
    const password = PassWord.value;
    const email = Email.value;
    PassWord.value = "";
    Email.value = "";

    myObj = {
      password:password,
      email:email,
    };

    let res = await axios.post(`${url}/add-login`, myObj)
      alert(res.data.message);
      localStorage.setItem('token', res.data.token)    //token is creating here and we getting from expense index.js IMP!!!
      window.location.href = "./Expense/expense.html"
      
}
catch(err){
  console.log(err.response.status);
  
  if(err.response.status === 400 && t == 0){
    t++;
    console.log(err.response.data.err);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      fillprop.appendChild(ele);
  }
  else if(err.response.status === 401 && t == 0){
    t++;
    console.log(err.response.data.message);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.message}</div>`;
      fillprop.appendChild(ele);
  }

  else if(err.response.status === 404 && t == 0){
    t++;
    console.log(err.response.data.message);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.message}</div>`;
      fillprop.appendChild(ele);

  }
  
 }
}

let t= 0;

function forgotpassword() {
  window.location.href = "./ForgotPassword/index.html"
}