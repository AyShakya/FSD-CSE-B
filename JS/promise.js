// Advance features of JS 
// ES-6 features 
// 1) Arrow function
// 2) let and const 
// 3) Promise 
// 4) Destructuring 
// 5) Speard and rest (...) operator 
// 6) Modules 
// 7) filter map and reduce 
// 8) class 
// 9) template literal(``)
// console.log(a);
// let e=10;
// var a;
// var b=6;
// console.log(a);
// {
//     var c=7;let d=9;
//     console.log(b);
//     console.log(c);
//     console.log(e);
// }
// console.log(c);
// console.log(d);

// Asynchronous Programing 
// register()
function register()
{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log("register email");
            resolve();
        },2000)});
    }

// sendEmail()
function sendEmail() {
    return waitfortwoseconds().then(() => {
        console.log("sendemail enal");
    });
}
// login()
function login() {
    return waitfortwoseconds().then(() => {
        console.log("login enal");
    });
}
// getData()
function getData() {
    return waitfortwoseconds().then(() => {
        console.log("getdata enal");
    });
}
// DisplayData()
function DisplayData() {
    return waitfortwoseconds().then(() => {
        console.log("DisplayData enal");
    });
}
// wait function
function waitfortwoseconds() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

// Promise chaining version
register()
    .then(sendEmail)
    .then(login)
    .then(getData)
    .then(DisplayData);


//// Call Back function
// Callback version (kept for reference)
// function register() {
//     setTimeout(() => {
//         console.log("register email");
//         sendEmail();
//     }, 2000);
// }



//with promises----->