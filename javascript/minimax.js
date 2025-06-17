const mosseText = document.getElementById('mosse-valutate')
const tempoText = document.getElementById('tempo-di-valutazione')
let depth = 3
let mosseCalcolate = 0
let time
let timeStart
let timeStop

function trovaMosse(turno) {
    let mosseSottoAttacco = []

    for(let j = 0; j < 8; j ++) {
        for(let i = 0; i < 8; i ++) {
            if(scacchiera[j][i].pedina.charAt(0) == turno) {
                let coords = {
                    y: j,
                    x: i
                }
                if(scacchiera[j][i].pedina == 'NPE') {
                    mosseSottoAttacco = mosseSottoAttacco.concat(mossePedoneNero(coords, true))
                }
                switch(scacchiera[j][i].pedina.substring(1)) {
                    case 'RE':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseRe(coords, true))
                        break
                    case 'RG':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseRegina(coords, true))
                        break
                    case 'TO':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseTorre(coords, true))
                        break
                    case 'AL':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseAlfiere(coords, true))
                        break
                    case 'CA':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseCavallo(coords, true))
                        break
                    case 'PE':
                        if(turno == 'N') break
                        mosseSottoAttacco = mosseSottoAttacco.concat(mossePedoneBianco(coords, true))
                        break
                    default:
                        console.error('errore in trovaMosse')
                        break
                }
            }
        }
    }

    mosseSottoAttacco = ordinaMosse(mosseSottoAttacco)

    return mosseSottoAttacco
}

function ordinaMosse(arrayMosse) {
    if(arrayMosse == []) return arrayMosse
    for(let i = 0; i < arrayMosse.length; i++) {

        arrayMosse[i].punteggioMossa = 10 * pieceEval(datiDiGioco.turno + arrayMosse[i].pedina, arrayMosse[i].casellaDiPartenzaY, arrayMosse[i].casellaDiPartenzaX, true)

        if(arrayMosse[i].eat) {
            arrayMosse[i].punteggioMossa += 10 * pieceEval(scacchiera[arrayMosse[i].y][arrayMosse[i].x].pedina, arrayMosse[i].y, arrayMosse[i].x, true)
        }

        if(arrayMosse[i].promozione) {
            arrayMosse[i].punteggioMossa += 10 * 90
        }

    }

    arrayMosse.sort(function(a, b) {return b.punteggioMossa - a.punteggioMossa})

    return arrayMosse
}

function mossaFatta(coords) {
    if(coords.promozione) {
        scacchiera[coords.casellaDiPartenzaY][coords.casellaDiPartenzaX].pedina = datiDiGioco.turno + 'RG'
    }
    if(coords.enpassant) {
        scacchiera[coords.y][coords.x].enpassant = true
    }
    if(coords.mangiaInEnPassant) {
        enPassantHandler(coords)
    }
    if(coords.pedina == 'RE' || coords.pedina == 'TO'){
        if(scacchiera[coords.casellaDiPartenzaY][coords.casellaDiPartenzaX].aroccoFattibile) {
            scacchiera[coords.casellaDiPartenzaY][coords.casellaDiPartenzaX].aroccoFattibile = false
        }
    }
    if(coords.arocco) {
        aroccoHandler(coords)
    }

    scacchiera[coords.y][coords.x].pedina = scacchiera[coords.casellaDiPartenzaY][coords.casellaDiPartenzaX].pedina
    scacchiera[coords.casellaDiPartenzaY][coords.casellaDiPartenzaX].pedina = ''

    // rimuove enpassant e arocco fattibile
    rimuoviEnPassant(datiDiGioco.Turno)

    if(datiDiGioco.turno == 'B') {
        datiDiGioco.turno = 'N'
        datiDiGioco.Turno = 'B'
    } else {
        datiDiGioco.turno = 'B'
        datiDiGioco.Turno = 'N'
    }
}

function mossaControAi(casella) {
    let coordinate = inDueNUmeri(casella.target.id)
    for(let i = 0; i < mossePossibili.length; i++) {
        if(coordinate.y == mossePossibili[i].y && coordinate.x == mossePossibili[i].x) {
            spostamentoFigura(mossePossibili[i])
            mossePossibili = []
            setTimeout(mossaAI, 100)
            return
        }
    }

    if(scacchiera[coordinate.y][coordinate.x].pedina === '') return console.warn('casella vuota')

    if(datiDiGioco.turno === scacchiera[coordinate.y][coordinate.x].pedina.charAt(0)) {
        coloroScacchiera()
        casellaCliccataMossa = 0
        mossePossibili = []
        gestoreMosse(coordinate)
    }
}

function mossaAI(color) {
    if(color == undefined) color = datiDiGioco.coloreAI

    if(datiDiGioco.usePython) {
        socket.emit('richiestaMM')
    } else {
        mosseCalcolate = 0
        timeStart = new Date().getTime()
    
        nonColorare = true
        let mossaPossibile = trovaMosse(color)[minimaxRoot(depth, true, color)]
        nonColorare = false
    
        timeStop = new Date().getTime()
        time = timeStop - timeStart
        mosseText.textContent = mosseCalcolate + ' mosse calcolate'
        tempoText.textContent = time + ' ms'
    
        spostamentoFigura(mossaPossibile)
        mossePossibili = []
    }
}

function minimaxRoot(depth, isMaximizer, color) {
    let mossePossibili = trovaMosse(color)
    let mossaMigliore = -9999
    let trovaMossaMigliore

    for(let i = 0; i < mossePossibili.length; i++) {
        let backup = []
        for(let j = 0; j < 8; j ++) {
            let smolBackUp = []
            for(let o = 0; o < 8; o ++) {
                smolBackUp[o] = Object.assign({}, scacchiera[j][o])
            }
            backup.push(smolBackUp)
        }
        let backupDatiDiGioco = Object.assign({}, datiDiGioco)

        mossaFatta(mossePossibili[i])

        let evaluation = minimax(depth - 1, -Infinity, Infinity, !isMaximizer, color)

        if (evaluation >= mossaMigliore) {
            mossaMigliore = evaluation
            trovaMossaMigliore = i
        }

        for(let j = 0; j < 8; j ++) {
            for(let o = 0; o < 8; o ++) {
                scacchiera[j][o] = Object.assign({}, backup[j][o])
            }
        }
        datiDiGioco = Object.assign({}, backupDatiDiGioco)
    }

    return trovaMossaMigliore
}

function minimax(depth, alpha, beta, isMaximizer, color) {
    mosseCalcolate ++

    if(depth == 0) {
        if(color == 'N') {
            return -evalScacchiera(scacchiera)
        } else {
            return evalScacchiera(scacchiera)
        }
    }

    let mossePossibili = trovaMosse(datiDiGioco.turno)

    if(isMaximizer) {
        let bestMove = -9999
        for(let i = 0; i < mossePossibili.length; i++) {
            let backup = []
            for(let j = 0; j < 8; j ++) {
                let smolBackUp = []
                for(let o = 0; o < 8; o ++) {
                    smolBackUp[o] = Object.assign({}, scacchiera[j][o])
                }
                backup.push(smolBackUp)
            }
            let backupDatiDiGioco = Object.assign({}, datiDiGioco)

            mossaFatta(mossePossibili[i])
            bestMove = Math.max(bestMove, minimax(depth - 1, alpha, beta, !isMaximizer, color))

            for(let j = 0; j < 8; j ++) {
                for(let o = 0; o < 8; o ++) {
                    scacchiera[j][o] = Object.assign({}, backup[j][o])
                }
            }
            datiDiGioco = Object.assign({}, backupDatiDiGioco)

            alpha = Math.max(alpha, bestMove)
            if(beta <= alpha) {
                return bestMove
            }
        }
        return bestMove
    } else {
        let bestMove = 9999
        for(let i = 0; i < mossePossibili.length; i++) {
            let backup = []
            for(let j = 0; j < 8; j ++) {
                let smolBackUp = []
                for(let o = 0; o < 8; o ++) {
                    smolBackUp[o] = Object.assign({}, scacchiera[j][o])
                }
                backup.push(smolBackUp)
            }
            let backupDatiDiGioco = Object.assign({}, datiDiGioco)

            mossaFatta(mossePossibili[i])
            bestMove = Math.min(bestMove, minimax(depth - 1, alpha, beta, !isMaximizer, color))

            for(let j = 0; j < 8; j ++) {
                for(let o = 0; o < 8; o ++) {
                    scacchiera[j][o] = Object.assign({}, backup[j][o])
                }
            }
            datiDiGioco = Object.assign({}, backupDatiDiGioco)

            beta = Math.min(beta, bestMove)
            if(beta <= alpha) {
                return bestMove
            }
        }
        return bestMove
    }
}

function evalScacchiera(scacchiera) {
    let eval = 0

    for(let j = 0; j < scacchiera.length; j++) {
        for(let i = 0; i < scacchiera[j].length; i++) {
            eval = eval + pieceEval(scacchiera[j][i].pedina, j, i)
        }
    }

    return eval
}

function pieceEval(pedina, y, x, valutazionePositiva) {
    if(pedina == '') return 0

    let eval = 0
    let isB = pedina.charAt(0) == 'B'

    switch(pedina.substring(1)) {
        case 'RE':
            eval = 900 + (isB ? evalBRE[y][x] : evalNRE[y][x])
            break
        case 'RG':
            eval = 90 + evalRG[x][y]
            break
        case 'TO':
            eval = 50 + (isB ? evalBTO[y][x] : evalNTO[y][x])
            break
        case 'AL':
            eval = 30 + (isB ? evalBAL[y][x] : evalNAL[y][x])
            break
        case 'CA':
            eval = 30 + evalCA[x][y]
            break
        case 'PE':
            eval = 10 + (isB ? evalBPE[y][x] : evalNPE[y][x])
            break
        default:
            console.error('errore in valutazioneSingolePedine')
            break
    }

    if(valutazionePositiva) return eval
    return isB ? eval : -eval
}

function reverseArray(array) {
    return array.slice().reverse()
}

let evalBPE = [
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
    [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
    [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
    [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
    [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
    [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
]

let evalNPE = reverseArray(evalBPE)

let evalCA = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
    [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
    [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
    [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
    [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
    [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
]

let evalBAL = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [-1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [-1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [-1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [-1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
]

let evalNAL = reverseArray(evalBAL)

let evalBTO = [
    [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [ 0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ 0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
]

let evalNTO = reverseArray(evalBTO)

let evalRG = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [-0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ 0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [-1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
]

let evalBRE = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [ 2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
    [ 2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
]

let evalNRE = reverseArray(evalBRE)