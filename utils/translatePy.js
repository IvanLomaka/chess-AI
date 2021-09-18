async function translatePy() {
    let sys = require('util')
    let spawn = require('child_process').spawn;
    let child = spawn('python', ['./utils/minimax.py', 'prova'])
    let mossa

    child.stdout.on('data', (data) => {
        mossa = data.toString()
        console.log(mossa, 'JS')
    })

    return mossa
}

module.exports = translatePy