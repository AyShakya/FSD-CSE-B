const fs = require('fs');
fs.writeFile('example.txt', 'This is an example file.', (err) => {
    if (err) {
        console.error('Error creating file:', err);
        return;
    }
    console.log('File created successfully.');
    fs.appendFile('example.txt', '\nThis content is appended to the file.', (err) => {
        if (err) {
            console.error('Error appending to file:', err);
            return;
        }     console.log('Content appended successfully.');
        fs.readFile('example.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            console.log('File content:\n', data);         
            fs.unlink('example.txt', (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
                console.log('File deleted successfully.');
            });
        });
    });
});