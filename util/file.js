const fs = require('fs');

const deletFile = (filePath) => {
    console.log(filePath);
    fs.unlink(filePath , (err) => {
        if(err) {
            throw(err)
        }

    })
}

exports.deletFile = deletFile;