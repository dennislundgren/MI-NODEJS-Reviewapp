
const generateID = () => {
    const seed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890".split("")
    id = ""
    for (let i = 0; i < 8; i++) 
        id += seed[Math.floor(Math.random() * seed.length) -1 ]
    return id
}

module.exports = {
    generateID
}