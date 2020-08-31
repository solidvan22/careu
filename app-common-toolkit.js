async function saveFile(file, path) {
    return new Promise((resolve, reject) => {
        file.mv(path, err => {
            console.log('ERROR SAVING FILE>>', err);
            if (err) return reject(err);
            return resolve(true);
        })
    })
}
module.exports ={
    saveFile
}