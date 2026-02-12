const myPormis = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if(success){
            resolve('Operation completed successfully');
        } else {
            reject(new Error('Operation failed'));
        }
    }, 1000);
});

myPormis.then((result) => {
    console.log(result);
}).catch((error) => {
    console.error(error.message);
});