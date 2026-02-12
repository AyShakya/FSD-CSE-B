fs.readfile('file.txt', 'utf-8', (err, data) => {
    if (err)  throw err;
    fs.readfile('file1.txt', 'utf8', (err, data) => {
        if(err) throw err;
        fs.readfile('file2.txt', 'utf-8', (err, data) => {
            if (err) throw err;
            console.log(data);
        });
    });
})