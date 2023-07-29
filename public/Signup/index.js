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
    if(res.status === 201){
        window.location.href = "../index.html"
    }
    else{
        throw new Error('Failed to Sign up');
    }
}
catch(err){
    document.body.innerHTML += `<div style = 'color:red;'>${err}</div>`;
    }
}
