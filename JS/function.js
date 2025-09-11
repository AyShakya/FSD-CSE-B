function f1(user='Guest'){
    console.log(`Hello ${user}`);
}
f1();
f1('ashish');

const add = (x,y) => x+y;
console.log(add(5,6));

const waitfor2seconds = () => {
    const ms = new Date().getTime() + 2000;
    while (new Date() < ms) {}
    return 'done';
}

function regiseter(){
    console.log('registering....');
    const res = waitfor2seconds();
    console.log(res);
    console.log('registered');  
}

regiseter();