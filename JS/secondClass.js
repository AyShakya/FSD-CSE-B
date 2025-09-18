function register() {
    console.log("Register");
}

function login() {
    console.log("Login");
}

function display(){
    console.log("display");
}

function waitforfive() {
    const ky = new Date().getTime()+5000;
    while(new Date().getTime()<ky){

    }
    console.log("Wait");
}

register();
login();
display();
waitforfive();