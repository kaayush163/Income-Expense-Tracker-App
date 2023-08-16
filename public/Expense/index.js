let ID;
let url = "http://localhost:3000/expense";
let url2 = "http://localhost:3000/purchase";
let url3 = "http://localhost:3000/premium";
const token = localStorage.getItem('token');

let downloading = document.getElementById('downloadexpense');
let oldfiledownloading = document.getElementById('oldfilesdownload');

function editid(id){  
    ID=id;
}

// Add transaction by clicking on button submitting
async function addTransaction(e){           //////first on submit it comes here
    try{
        e.preventDefault();
        if(text.value.trim() === "" || amount.value.trim() === "")
        {
         alert('Please Enter the Complete Details First');
        }
        else{
          let transaction = {     ////we created object
            text:text.value,
            amount: +amount.value, //use + to change its type from string to number or int
            category: category.value,
            //userId: 1   //now will no see in payload any userId  //but it will be null if u see expense table
           };

            if(ID){  //ye jo Id pass ho rha hai ye edit wale par hoga firse submit krna hai to id same lekar from crud wale se
                console.log(ID);
                // let res =  await axios.put(url+'/'+ID,transaction)
                try{
                    let res= await axios.post(`${url}/edit-expense/${ID}`,transaction, { headers: {'Authorization' : token}})
                    const obj = res.config.data;   //in update it present in config 
                    console.log(obj);
                    const parRes = JSON.parse(obj);
                    const sepid = {id:parseInt(`${ID}`)};
                    const last = {...sepid,...parRes};
                    console.log(last);
                    // console.log(parRes);
                    onScreenAfterEdit(last);  
                }catch(err){
                    console.log(err);
                    }
            }
            
           else{    //ID is now undefined
                let res=await axios.post(`${url}/post-expense`, transaction ,{ headers: {'Authorization' : token}}) //on submit new and fresh form post request will be sent
                try{
                    console.log(res.data.data);
                    //console.log(res.data.expense);
                    onScreen(res.data.data)
                }catch(err){
                    console.log(err,"not able to do post here in index.js");
                }
            }
         }
     }
     catch(err){
        console.log(err);
      }
}


window.addEventListener('DOMContentLoaded',onload);
function onload(e)
{
    const decodeToken = parseJwt(token);
    console.log(decodeToken);
    // const isadmin = localStorage.getItem('isadmin');
    let isadmin = decodeToken.ispremiumuser   //if you saw jwt.io there an option ispremiumuser so it means whatever token we have it also contains the key ispremiumuser so this will get true that we set in options handlers ispremium we are getting we set jwt .sign in backen and we see it in console.log
    console.log(isadmin);
    if(isadmin){
     showPremiumuser();
     showLeaderboard();
     downloading.style.visibility = "visible";
     oldfiledownloading.style.visibility = "visible";
    }
    const page = 1;
    getExpense(page);

    // let res=await axios.get(`${url}/get-expense`, { headers: {'Authorization': token}});
    // console.log(res.data);
    // console.log(res.data.all);
    // try
    // {
    //     res.data.all.forEach((key)=> {    //why put all check console.log(res.data)
    //         console.log(key);   // this is passing as data[i] data[0],data[1]
    //         onScreen(key);
    //     })
    // }
    // catch(err)
    // {
    //     console.log(err)
    // }
}

function getter() {   ////when click on get button which finction onclick already mention in html file we have to set dynamically how many items user want on the first page pagination 
    localStorage.setItem("count", document.getElementById("NumberofRecords").value)
    location.reload();   ////screen reloaded automaticalSly we dont need to click on reload button
}

async function getExpense(page){

        document.getElementById("list").innerHTML = "";  /////if go to next page we have to empty the list so that we can fill baad wale expence income jo bache hai
        const COUNT = localStorage.getItem("count");
        const database = await axios.get(`${url}/get-expense?page=${page}&count=${COUNT}`, { headers : {"Authorization": token}})
        .then(response => {
            console.log(response.data);
            sendToUi(response.data.rows);
           
             showPagination(response.data);   //////after we got the data  from database from backend to know about next,previos ,hasnext, has previous we will send to the function showPagination (currentbutton, next button, prev button)
        })
        .catch(err => console.log(err));

        return database       /////this will return to showPagination await getExpense
        //console.log(database.data)
  
}

async function sendToUi(obj) {

    console.log(obj);
    // if (obj.length == 0) {
    //     document.getElementById("puser").innerHTML ="<br> No Transactions to show"
    // }
    for (let i = 0; i < obj.length; i++) {
        console.log(obj[i]);
        onScreen(obj[i]);
        // console.log(dbData[i]);
    }
}

function onScreen(transaction){
    console.log(transaction);
    // const transaction = details.data;
    // console.log(transaction);
    const sign = transaction.amount < 0 ? "-":"+";
    let item = document.createElement("li");
    //let classname = transaction.amount < 0 ? "minus" : "plus"
    item.classList.add( //Hum class ko add kr rhe hai sign ko humne phele hi add krdiya on const sign
        transaction.amount < 0 ? "minus" : "plus"  //the advantage of this that it will be able to guess whether 
                                                //the value is minus and plus by seeing color red or green in history li items
    );
    //item.setAttribute("class", classname);
    item.setAttribute("id", transaction.id);
    let classname = transaction.amount < 0 ? "Expense" : "Income"
    item.innerHTML =  `Description : ${transaction.text}
                       <span>Category : ${transaction.category}</span>
                       <span>Amount ${classname} : ${sign}${Math.abs(transaction.amount)}</span>
                       <button class="edit-btn" onclick="editData('${transaction.id}','${transaction.text}','${transaction.amount}','${transaction.category}')">EDIT</button>
                       <button class="delete-btn" onclick="removeTransaction('${transaction.id}')">X</button>
                       `;
    
    list.appendChild(item);
    updateValues();
}

////Pagination /////
async function showPagination({
    // rows:rows,
    // currentpage: PAGE,
    // hasnextpage: ITEMS_PER_PAGE * PAGE < count,
    // nextpage:PAGE+1,
    // haspreviouspage: PAGE > 1,
    // previouspage: PAGE - 1,
    // lastpage: Math.ceil(count / ITEMS_PER_PAGE)

    currentpage,
    hasnextpage,
    nextpage,
    haspreviouspage,
    previouspage,
    lastpage
}){
    
    const pagination = document.getElementById('pagination');    //// to addd curent pagge and previous next button
    pagination.innerHTML = '';
    if(haspreviouspage){            ////if true whcih we will get from backend means hasPrevious page means not at the starting 1 but somewhere from 2-n
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = `<li class="page-item"><a class="page-link">Previous page</a></li>`;
        prevBtn.addEventListener('click', async() => { 
            await getExpense(previouspage) 
        })
        pagination.appendChild(prevBtn)
        //pagination.append(" ")  to just give some space between prev and curre
    }

    const currbtn = document.createElement('button');
    currbtn.innerHTML =  `<li class="page-item"><a class="page-link">${currentpage}</a></li>`
    currbtn.addEventListener('click', () => {
        if (currentpage == lastpage) {
            getExpense(1)
        }
    })
    pagination.appendChild(currbtn)
    //pagination.append(" ")

    if (hasnextpage) {
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = `<li class="page-item"><a class="page-link">Next Page</a></li>`;    ///when 
        nextBtn.addEventListener('click', async() => { 
            await getExpense(nextpage) 
        })
        pagination.appendChild(nextBtn)
    }

}



function showLeaderboard(){
    const inputElement = document.createElement("input");
    inputElement.type = 'button';
    inputElement.value = 'Show Leaderboard';
    inputElement.classList.add("btn");
   
    let ct =0 ;

    inputElement.onclick = async() => {
        if(ct == 0){
            ct+=1;
            const LeaderboardArray = await axios.get(`${url3}/showLeaderBoard`, { headers: { 'Authorization':token }});
            console.log(LeaderboardArray);
    
            let leaderboardElem = document.getElementById('leaderboard');
            leaderboardElem.innerHTML+= '<h1>Leader Board</h1>';
    
            LeaderboardArray.data.forEach((userDetails) => {
                leaderboardElem.innerHTML+= `<li>Name:${userDetails.name} Total Balance Money:${userDetails.totalBalance}</li>`  ///first we were using total_amountbalance which get from expense table and present in premium controller but now we dont nee to traverse expense table anymore we have done get expense controller changed to get total expense directly in user table
                 /// we get userDetails.total expense directly gfrom user table we no need to trace again and again the expense table and calcultae sum of amounts income and expense
                             //task 12 now instead of calculating total expense by traversing in the expense table of the same user doing more expense 
                                                                                                                                  //we can simply take total expense from user table the computtaion has become fast we have don esignup controlelrs u can revise this for sure!!!
    
            })
        }  
    }
    document.getElementById('message').append(inputElement);
}

function showPremiumuser() {
    document.getElementById('rzp-button').style.visibility = 'hidden';
    document.getElementById('message').innerHTML = `<h1>You are a premium user</h1>`;
}

function parseJwt (token) {   //this will decode the jwt token which containe 3 things from there we have to extract is premiusum :null/true
    //this we getten from internet how to decode jwt token
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.getElementById('rzp-button').onclick = async function(e) {
   const response = await axios.get(`${url2}/premiummembership`, {headers: {'Authorization': token}});
   console.log(response);// from backend created order we get data in res now move to the payment in options
   
   let options = {
    "key": response.data.key_id, //entert the key id which was generated from razorpay dashboard
    "order_id": response.data.order.id,  //for one time payment
    //IMP !!!! NEver ever pass amount here becoz u know the fortnend can be cjanged by the intruder so you want to to pay 20 the intruder will make it 2000 IMP
    //we already pass currency and amoutn in that order id so u are ggod to go with this order.id onlyb////
    "handler": async function(response) {    //It's a callback function whenever payment is successful

        //handler will handle the succes payment
        const res = await axios.post(`${url2}/updatetransaction`, {  //this will call the backend and update the token
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
        }, {headers: {'Authorization': token}})   //also imp to pass header with token so that whose order is going placed or going to be successful apyment that also imp
       // to the frontend we pass this callback function and then razor pay cna handle sit of
       console.log(res);
        alert('You are a Premium User Now')
        console.log(res.data.token);
        localStorage.setItem('token',res.data.token);   ////is admin can be changed easily from true to false but oout token will not becoz it created by jwt token and automatically accessible everytime we login becoz we have done generate token in signup controller so its safe to store it in local storage seting it up
    //    localStorage.setItem('isadmin',true);
       const decodeToken = parseJwt(token);
       console.log(decodeToken);
       document.getElementById('rzp-button').style.visibility = 'hidden';
       document.getElementById('message').innerHTML = `<h1>You are a Premium User now</h1>`;
       downloading.style.visibility = "visible";
       oldfiledownloading.style.visibility = "visible";
       //let isadmin = decodeToken.ispremiumuser
       showLeaderboard();
    },
   };

   const rzp1 = new Razorpay(options);  //from here we are passing the options
   rzp1.open(); //this help when click on by premium the screen of razorpay frontend pops up
   e.preventDefault();

   rzp1.on('payment.failed', function(response) {
    console.log(response);
    alert('Something went wrong');                   ////when payment got failed
   })
}

const balance = document.getElementById("balance");
const money_plus=document.getElementById('money-plus');
const money_minus=document.getElementById('money-minus');

const list=document.getElementById("list");
const form=document.getElementById('form');
const text=document.getElementById('text');
const amount=document.getElementById('amount');
const category=document.getElementById('category');


function download(){
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURl;     /////whatever you write in expense controller fileURl write that thing only instead of anything like fileurl or fileUrl or anything this will not work
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}

//Update Values  for changing income and expense number on submitting the form this is the beauty of JAVASCRIPT
async function updateValues(){ //mann ke chalo hamare pass 4 arrays hai means 4 transaction har value ko fetch out krna hai
    // const token = localStorage.getItem('token');
    let res = await axios.get(`${url}/get-update-expense`, { headers: {'Authorization': token}});
    console.log(res.data);
    try{
        const amounts = res.data.all.map((transaction) => transaction.amount);
        console.log(amount);   //if not put headers Authorixzstion this will show undefined the no of time u get expense
        const total = amounts.reduce((acc,item) => (acc+=item),0).toFixed(2);
        const income = amounts.filter((item) => item > 0).reduce((acc,item) => (acc+= item),0).toFixed(2);
        const expense = (amounts.filter((item) => item < 0).reduce((acc,item) => (acc+=item),0)*-1).toFixed(2);  //so to get expense in negative we multipley with -1
         
         //now add these in variables so that we can use them
         balance.innerText=`Rs.${total}`;   //u can use $ or rupees or any currency sign
         money_plus.innerText=`Rs.${income}`;
         money_minus.innerText=`Rs.${expense}`;
    }
    catch(err){
        console.log(err);
    }
 }
  
async function onScreenAfterEdit(parRes){
    console.log(parRes);
    //await axios.get(`${url}/edit-expense/${ID}`)
     try{
        //console.log(res.data);
        //onScreen(res.data)
        onScreen(parRes);
        ID=''  // here id do null because when to check on conditon if(ID) in add transaction the submit should be properly done 
               ///if any new data is inserted instead of edit data
     }
     catch(err){
        console.log(err);
     }
}

//Remove Transaction
async function removeTransaction(id){  //this will do on deleting any history element according to red or green your balance adjusted by this so if delete green wala(credited from history 
    //then balance se minus ho jaega automatic if remove red wala(expense) aur=tomatic plus in your balance)
console.log(id);

  if(confirm("are You sure want to delete this entry?"))
  {
    try{

    let res = await axios.get(`${url}/delete-expense/${id}`, { headers: {'Authorization': token}});
    removeFromScreen(id); 
  }
  catch(err){
    console.log(err);
   }
  }
}

function removeFromScreen(id){
    console.log(id);
    let parent = document.getElementById('list');
    console.log(parent);
    let child = document.getElementById(id);            ////I will remeber this how much to struggle to get this correct
    console.log(child);
    if(child){
        parent.removeChild(child);
    }
    updateValues();
}

function editData(id,text,amount,category)
{
    document.getElementById('text').value=text;
    document.getElementById('amount').value=amount;
    document.getElementById('category').value=category;
   // document.getElementById('description').value=des;
    //document.getElementById('category').value=cat;

    removeFromScreen(id);
    editid(id);             // calling editid() declared above to store id of particular object to be edited
}

function showError(err){
    document.body.innerHTML+=  `<div style="color:red;">${err}</div>`;
}

form.addEventListener('submit',addTransaction);


let oldct;
console.log(oldct);
async function oldfiles(event) {
   
    try {
       // const token = localStorage.getItem('token')
        if (token != null && oldct === undefined) {
            //  console.log("consolelog wala",token)
            oldct = 1;
            const expense = await axios.get(`${url3}/downloadlist`, { headers: { "Authorization": token } })
                .then(response => {
                    console.log(response)
                    document.getElementById("downloadResponse").textContent += `${response.data.message}`
                    return response.data.list
                }).catch((err)=> document.getElementById("downloadResponse").textContent += `${err.response.data}`)
            //  console.log(expense)

            document.getElementById("url").innerHTML = "<label style='font-weight: 800;'>Previous Downloads</label>";
             console.log(expense);
            for (let i = 0; i < expense.length; i++) {
                document.getElementById("listofurls").innerHTML += `<li><p>${expense[i].createdAt}</p><a href=${expense[i].url}>Download</a></li>`
                //  

            }
        } 
    } catch (e) {
        console.log(e)
    }
}
