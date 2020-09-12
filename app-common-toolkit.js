async function saveFile(file, path) {
    return new Promise((resolve, reject) => {
        file.mv(path, err => {
            if (err) {
                console.log('ERROR SAVING FILE >>>>>>' , err)
                return reject(err)
            };
            return resolve(true);
        })
    })
}
module.exports ={
    saveFile
}