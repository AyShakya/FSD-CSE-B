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

function sendEmail(){
    console.log('sending....');
    const res = waitfor2seconds();
    console.log(res);
    console.log('sent');  
}

regiseter();
sendEmail();

function registernew(cb){
    setTimeout(() => {
        console.log('registering....');
        cb();
    }, 2000);
}

registernew(() => {
    sendEmail(() => {
        regiseter(() => {
            console.log('all done');
        })
    });
})