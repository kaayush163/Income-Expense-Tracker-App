let ID;

let url = "http://localhost:3000/user";
const myForm = document.getElementById("my-form");
const UserName = document.getElementById("name");
const PassWord = document.getElementById("password");
const Email = document.getElementById("email");

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
try{
   e.preventDefault();
    const name = UserName.value;
    const password = PassWord.value;
    const email = Email.value;
    UserName.value = "";
    PassWord.value = "";
    Email.value = "";

    myObj = {
      name:name,
      password:password,
      email:email,
    };

    let res = await axios.post(`${url}/add-user`, myObj)
    console.log(res.status);
    // if(res.status === 201){
        alert(res.data.message);
        window.location.href = "../index.html"
    // }
    // else if(res.status === 204){
    //     console.log(res);
    //     // alert(res.data.message);
    //     alert('User Already exists Go to Login Please');

    // }
    // else{
    //     throw new Error('Failed to Sign up');
    // }
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
  else if(err.response.status === 404 && t == 0){
    t++;
    console.log(err.response.data.message);
    const fillprop = document.getElementById("fillnot");
    const ele = document.createElement('li');
      // document.body.innerHTML += `<br><div style = 'color:red;'>${err.response.data.err}</div>`;
      ele.innerHTML+=`<br><div style = 'color:red;'>${err.response.data.message}</div>`;
      fillprop.appendChild(ele);
  }
    
  else{
    document.body.innerHTML += `<div style = 'color:red;'>${err}</div>`;

  }
    
    }
}

let t= 0;