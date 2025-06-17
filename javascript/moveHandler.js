var mossePossibili = []
var casellaCliccataMossa 
var nonColorare = false

function inDueNUmeri(numero) {
    for(let j = 0; j < 8; j ++) {
        for(let i = 0; i < 8; i ++) {
            if (numero == 0) {
                let numeriTrovati = {
                    y: j,
                    x: i
                }
                return(numeriTrovati)
            }
            numero --
        }
    }
}

function mossaOffline(casella) {
    let coordinate = inDueNUmeri(casella.target.id)
    for(let i = 0; i < mossePossibili.length; i++) {
        if(coordinate.y == mossePossibili[i].y && coordinate.x == mossePossibili[i].x) {
            spostamentoFigura(mossePossibili[i])
            mossePossibili = []
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

function gestoreMosse(coords) {
    pedina = scacchiera[coords.y][coords.x].pedina
    if(pedina === 'NPE') {
        mossePedoneNero(coords, true)
        return
    }
    switch(pedina.substring(1)) {
        case 'RE':
            mosseRe(coords, true)
            break
        case 'RG':
            mosseRegina(coords, true)
            break
        case 'TO':
            mosseTorre(coords, true)
            break
        case 'AL':
            mosseAlfiere(coords, true)
            break
        case 'CA':
            mosseCavallo(coords, true)
            break
        case 'PE':
            mossePedoneBianco(coords, true)
            break
        default:
            console.error('errore nel gestore mosse')
            break
    }
}

// mosse legali può essere true o false e serve per vedere se le mosse possibili sono legali o no
function mossePedoneBianco(coords, mosseLegali) {
    let mosse = []
    casellaCliccataMossa = Object.assign({}, coords)
    let coordinate = Object.assign({}, coords)
    let mosseEat = []

    if(coords.y == 6) {
        mosseEat = mosseEat.concat(calcolatoreDellaMossa(coords, -1, 0, 2))
        for(let i = 0; i < mosseEat.length; i++) {
            if (mosseEat[i].eat == false) {
                if(i == 1) {
                    mosseEat[i].enpassant = true
                }
                mosse.push(mosseEat[i])
            }
        }
    } else {
        mosseEat = mosseEat.concat(calcolatoreDellaMossa(coords, -1, 0, 1))
        for(let i = 0; i < mosseEat.length; i++) {
            if (mosseEat[i].eat == false) {
                mosse.push(mosseEat[i])
            }
        }
    }

    coords = Object.assign({}, coordinate)
    if(coords.y == 3) {
        if(scacchiera[coords.y][coords.x - 1] != undefined) {
            if(scacchiera[coords.y][coords.x - 1].pedina == 'NPE') {
                if(scacchiera[coords.y][coords.x - 1].enpassant) {
                    let move = {
                        y: 2,
                        x: coords.x - 1,
                        mangiaInEnPassant: true,
                        eat: true,
                        pedina: scacchiera[coordinate.y][coordinate.x].pedina.substring(1),
                        YpedinaMangiata: coords.y,
                        casellaDiPartenzaY: coordinate.y,
                        casellaDiPartenzaX: coordinate.x,
                    }
                    mosse.push(move)
                }
            }
        }
        
        if(scacchiera[coords.y][coords.x + 1] != undefined) {
            if(scacchiera[coords.y][coords.x + 1].pedina == 'NPE') {
                if(scacchiera[coords.y][coords.x + 1].enpassant) {
                    let move = {
                        y: 2,
                        x: coords.x + 1,
                        mangiaInEnPassant: true,
                        eat: true,
                        pedina: scacchiera[coordinate.y][coordinate.x].pedina.substring(1),
                        YpedinaMangiata: coords.y,
                        casellaDiPartenzaY: coordinate.y,
                        casellaDiPartenzaX: coordinate.x,
                    }
                    mosse.push(move)
                }
            }
        }
    }

    mosseEat = []

    coords = Object.assign({}, coordinate)
    mosseEat = mosseEat.concat(calcolatoreDellaMossa(coords, -1, 1, 1))

    coords = Object.assign({}, coordinate)
    mosseEat = mosseEat.concat(calcolatoreDellaMossa(coords, -1, -1, 1))

    for(let i = 0; i < mosseEat.length; i++) {
        if (mosseEat[i].eat == true) {
            mosse.push(mosseEat[i])
        }
    }

    if(mosseLegali) {
        let mosseFinali = filtroMosseLegali(mosse, coordinate)

        for(let i = 0; i < mosseFinali.length; i++) {
            if(mosseFinali[i].y == 0) {
                mosseFinali[i].promozione = true
            }
        }

        displayMosse(mosseFinali)
        return mosseFinali
    }

    return mosse
}

function mossePedoneNero(coords, mosseLegali) {
    let mosse = []
    casellaCliccataMossa = Object.assign({}, coords)
    let coordinate = Object.assign({}, coords)
    let mosseEat = []

    if(coords.y == 1) {
        mosseEat = mosseEat.concat(calcolatoreDellaMossa(coords, 1, 0, 2))
        for(let i = 0; i < mosseEat.length; i++) {
            if (mosseEat[i].eat == false) {
                if(i == 1) {
                    mosseEat[i].enpassant = true
                }
                mosse.push(mosseEat[i])
            }
        }
    } else {
        mosseEat = mosseEat.concat(calcolatoreDellaMossa(coords, 1, 0, 1))
        for(let i = 0; i < mosseEat.length; i++) {
            if (mosseEat[i].eat == false) {
                mosse.push(mosseEat[i])
            }
        }
    }

    coords = Object.assign({}, coordinate)
    if(coords.y == 4) {
        if(scacchiera[coords.y][coords.x - 1] != undefined) {
            if(scacchiera[coords.y][coords.x - 1].pedina == 'BPE') {
                if(scacchiera[coords.y][coords.x - 1].enpassant) {
                    let move = {
                        y: 5,
                        x: coords.x - 1,
                        mangiaInEnPassant: true,
                        eat: true,
                        pedina: scacchiera[coordinate.y][coordinate.x].pedina.substring(1),
                        YpedinaMangiata: coords.y,
                        casellaDiPartenzaY: coordinate.y,
                        casellaDiPartenzaX: coordinate.x,
                    }
                    mosse.push(move)
                }
            }
        }
        
        if(scacchiera[coords.y][coords.x + 1] != undefined) {
            if(scacchiera[coords.y][coords.x + 1].pedina == 'BPE') {
                if(scacchiera[coords.y][coords.x + 1].enpassant) {
                    let move = {
                        y: 5,
                        x: coords.x + 1,
                        mangiaInEnPassant: true,
                        eat: true,
                        pedina: scacchiera[coordinate.y][coordinate.x].pedina.substring(1),
                        YpedinaMangiata: coords.y,
                        casellaDiPartenzaY: coordinate.y,
                        casellaDiPartenzaX: coordinate.x,
                    }
                    mosse.push(move)
                }
            }
        }
    }

    mosseEat = []

    coords = Object.assign({}, coordinate)
    mosseEat = mosseEat.concat(calcolatoreDellaMossa(coords, 1, 1, 1))

    coords = Object.assign({}, coordinate)
    mosseEat = mosseEat.concat(calcolatoreDellaMossa(coords, 1, -1, 1))

    for(let i = 0; i < mosseEat.length; i++) {
        if (mosseEat[i].eat == true) {
            mosse.push(mosseEat[i])
        }
    }

    if(mosseLegali) {
        let mosseFinali = filtroMosseLegali(mosse, coordinate)

        for(let i = 0; i < mosseFinali.length; i++) {
            if(mosseFinali[i].y == 7) {
                mosseFinali[i].promozione = true
            }
        }

        displayMosse(mosseFinali)
        return mosseFinali
    }

    return mosse
}

function mosseCavallo(coords, mosseLegali) {
    let mosse = []
    casellaCliccataMossa = Object.assign({}, coords)
    let coordinate = Object.assign({}, coords)

    mosse = mosse.concat(calcolatoreDellaMossa(coords, 2, -1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 2, 1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, -2, -1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, -2, 1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 1, -2, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, -1, -2, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 1, 2, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, -1, 2, 1))

    if(mosseLegali) {
        let mosseFinali = filtroMosseLegali(mosse, coordinate)
        displayMosse(mosseFinali)
        return mosseFinali
    }

    return mosse
}

function mosseAlfiere(coords, mosseLegali) {
    let mosse = []
    casellaCliccataMossa = Object.assign({}, coords)
    let coordinate = Object.assign({}, coords)

    mosse = mosse.concat(calcolatoreDellaMossa(coords, -1, -1, 8))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, -1, 1, 8))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 1, -1, 8))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 1, 1, 8))

    if(mosseLegali) {
        let mosseFinali = filtroMosseLegali(mosse, coordinate)
        displayMosse(mosseFinali)
        return mosseFinali
    }

    return mosse
}

function mosseTorre(coords, mosseLegali) {
    let mosse = []
    casellaCliccataMossa = Object.assign({}, coords)
    let coordinate = Object.assign({}, coords)

    mosse = mosse.concat(calcolatoreDellaMossa(coords, -1, 0, 8))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 0, 1, 8))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 1, 0, 8))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 0, -1, 8))

    if(mosseLegali) {
        let mosseFinali = filtroMosseLegali(mosse, coordinate)
        displayMosse(mosseFinali)
        return mosseFinali
    }

    return mosse
}

function mosseRegina(coords, mosseLegali) {
    let mosse = []
    casellaCliccataMossa = Object.assign({}, coords)
    let coordinate = Object.assign({}, coords)

    mosse = mosse.concat(mosseTorre(coords, mosseLegali))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(mosseAlfiere(coords, mosseLegali))

    if(mosseLegali) {
        displayMosse(mosse)
        return mosse
    }

    return mosse
}

function mosseRe(coords, mosseLegali) {
    let mosse = []
    casellaCliccataMossa = Object.assign({}, coords)
    let coordinate = Object.assign({}, coords)

    mosse = mosse.concat(calcolatoreDellaMossa(coords, -1, 0, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 0, 1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 1, 0, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 0, -1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, -1, -1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, -1, 1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 1, -1, 1))

    coords = Object.assign({}, coordinate)
    mosse = mosse.concat(calcolatoreDellaMossa(coords, 1, 1, 1))

    if(mosseLegali) {
        coords = Object.assign({}, coordinate)

        let backUpCasellaCliccata = Object.assign({}, casellaCliccataMossa)
        if(checkScacco(datiDiGioco.Turno) ==  false) {
            casellaCliccataMossa = Object.assign({}, backUpCasellaCliccata)
            let mosseArocco = checkArocco(coords)

            if (mosseArocco) {
                mosse = mosse.concat(mosseArocco)
            }
        }
        casellaCliccataMossa = Object.assign({}, backUpCasellaCliccata)

        let mosseFinali = filtroMosseLegali(mosse, coordinate)
        displayMosse(mosseFinali)
        return mosseFinali
    }

    return mosse
}

function calcolatoreDellaMossa(coords, spostamentoY, spostamentoX, ripetizioni) {
    let mosse = []
    let coordinate = Object.assign({}, coords)
    
    for(let i = 0; i < ripetizioni; i++) {
        coords.y = coords.y + spostamentoY
        coords.x = coords.x + spostamentoX
        if(coords.y < 0 || coords.x < 0 || coords.y > 7 || coords.x > 7) break
        if(scacchiera[coords.y][coords.x].pedina == '') {
            let mossa = {}
            mossa.y = coords.y
            mossa.x = coords.x
            mossa.eat = false
            mossa.pedina = scacchiera[coordinate.y][coordinate.x].pedina.substring(1)
            mossa.casellaDiPartenzaY = coordinate.y
            mossa.casellaDiPartenzaX = coordinate.x
            mosse.push(mossa)
        } else if (scacchiera[coords.y][coords.x].pedina != '') {
            if(scacchiera[coordinate.y][coordinate.x].pedina.charAt(0) != scacchiera[coords.y][coords.x].pedina.charAt(0)) {
                let mossa = {}
                mossa.y = coords.y
                mossa.x = coords.x
                mossa.eat = true
                mossa.pedina = scacchiera[coordinate.y][coordinate.x].pedina.substring(1)
                mossa.casellaDiPartenzaY = coordinate.y
                mossa.casellaDiPartenzaX = coordinate.x
                mosse.push(mossa)
                break
            } else {
                break
            }
        }
    }

    return mosse
}

function displayMosse(mosse) {
    if (nonColorare) return
    coloroScacchiera()
    mossePossibili = mosse.map(a => Object.assign({}, a))

    caselle[casellaCliccataMossa.y][casellaCliccataMossa.x].classList = datiDiGioco.casellaCliccata
    for(let i = 0; i < mosse.length; i++) {
        if(scacchiera[mosse[i].y][mosse[i].x].colore === datiDiGioco.chiaro) {
            caselle[mosse[i].y][mosse[i].x].classList = datiDiGioco.spostamentoCaselleChiaro
        }

        if(scacchiera[mosse[i].y][mosse[i].x].colore === datiDiGioco.scuro) {
            caselle[mosse[i].y][mosse[i].x].classList = datiDiGioco.spostamentoCaselleScuro
        }

        if(mosse[i].eat == true){
            caselle[mosse[i].y][mosse[i].x].classList = datiDiGioco.eat
        }
    }
}

function spostamentoFigura(coords) {
    if(coords.promozione) {
        if((datiDiGioco.coloreAI == datiDiGioco.turno && datiDiGioco.partitaContro == 'AI') || datiDiGioco.turnoAIvsAI) {
            scacchiera[coords.casellaDiPartenzaY][coords.casellaDiPartenzaX].pedina = datiDiGioco.turno + 'RG'
        } else{
            let nuovaFigura = prompt('TO - RG - AL - CA')
            scacchiera[coords.casellaDiPartenzaY][coords.casellaDiPartenzaX].pedina = datiDiGioco.turno + nuovaFigura
        }
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
    immagini[coords.casellaDiPartenzaY][coords.casellaDiPartenzaX].src = 'images/trasparente.png'
    disegnoPedine()
    // rimuove enpassant e arocco fattibile
    rimuoviEnPassant(datiDiGioco.Turno)

    if(datiDiGioco.turno == 'B') {
        datiDiGioco.turno = 'N'
        datiDiGioco.Turno = 'B'
        if(checkScacco(datiDiGioco.Turno) && checkWinner(datiDiGioco.turno)) {
            coloroScacchiera()
            gameOver(true, 'B')
            return console.log('PARTITA FINITA WIN B', datiDiGioco.Turno)
        }
        if (checkWinner(datiDiGioco.Turno) || checkTie()) {
            coloroScacchiera()
            gameOver()
            return console.log('PAREGGIO', datiDiGioco.Turno)
        }
    } else {
        datiDiGioco.turno = 'B'
        datiDiGioco.Turno = 'N'
        if(checkScacco(datiDiGioco.Turno) && checkWinner(datiDiGioco.turno)) {
            coloroScacchiera()
            gameOver(true, 'N')
            return console.log('PARTITA FINITA WIN N', datiDiGioco.Turno)
        }
        if (checkWinner(datiDiGioco.Turno) || checkTie()) {
            coloroScacchiera()
            gameOver
            return console.log('PAREGGIO', datiDiGioco.Turno)
        }
    }
    coloroScacchiera()
}

function filtroMosseLegali(mosse, coords) {
    let mosseLegali = []
    let backUpCasellaCliccata = Object.assign({}, casellaCliccataMossa)

    for(let i = 0; i < mosse.length; i++) {
        let backup = []
        for(let j = 0; j < 8; j ++) {
            let smolBackUp = []
            for(let o = 0; o < 8; o ++) {
                smolBackUp[o] = Object.assign({}, scacchiera[j][o])
            }
            backup.push(smolBackUp)
        }

        scacchiera[mosse[i].y][mosse[i].x].pedina = scacchiera[coords.y][coords.x].pedina
        scacchiera[coords.y][coords.x].pedina = ''

        if(checkScacco(datiDiGioco.Turno) == false) {
            mosseLegali.push(mosse[i])
        }

        for(let j = 0; j < 8; j ++) {
            for(let o = 0; o < 8; o ++) {
                scacchiera[j][o] = Object.assign({}, backup[j][o])
            }
        }
    }

    /*for(let i = 0; i < mosse.length; i++) {
        let backup = JSON.parse(JSON.stringify(scacchiera))

        scacchiera[mosse[i].y][mosse[i].x].pedina = scacchiera[coords.y][coords.x].pedina
        scacchiera[coords.y][coords.x].pedina = ''

        if(checkScacco(datiDiGioco.Turno) == false) {
            mosseLegali.push(mosse[i])
        }

        scacchiera = JSON.parse(JSON.stringify(backup))
    }*/

    casellaCliccataMossa = Object.assign({}, backUpCasellaCliccata)

    return mosseLegali
}

function checkScacco(turno, checkW) {
    let mosseSottoAttacco = []
    let RE
    for(let j = 0; j < 8; j ++) {
        for(let i = 0; i < 8; i ++) {
            if(scacchiera[j][i].pedina.charAt(0) != turno && scacchiera[j][i].pedina.substring(1) == 'RE') {
                RE = {
                    y: j,
                    x: i
                }
            }
        }
    }

    if(RE == undefined) {
        return false
    }

    for(let j = 0; j < 8; j ++) {
        for(let i = 0; i < 8; i ++) {
            if(scacchiera[j][i].pedina.charAt(0) == turno) {
                let coords = {
                    y: j,
                    x: i
                }
                if(scacchiera[j][i].pedina == 'NPE') {
                    mosseSottoAttacco = mosseSottoAttacco.concat(mossePedoneNero(coords, false))
                }
                switch(scacchiera[j][i].pedina.substring(1)) {
                    case 'RE':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseRe(coords, false))
                        break
                    case 'RG':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseRegina(coords, false))
                        break
                    case 'TO':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseTorre(coords, false))
                        break
                    case 'AL':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseAlfiere(coords, false))
                        break
                    case 'CA':
                        mosseSottoAttacco = mosseSottoAttacco.concat(mosseCavallo(coords, false))
                        break
                    case 'PE':
                        if(turno == 'N') break
                        mosseSottoAttacco = mosseSottoAttacco.concat(mossePedoneBianco(coords, false))
                        break
                    default:
                        console.error('errore in checkScacco')
                        break
                }
            }
        }
    }

    for(let i = 0; i < mosseSottoAttacco.length; i++) {
        if (mosseSottoAttacco[i].y == RE.y && mosseSottoAttacco[i].x == RE.x) {
            return true
        }
    }

    return false
}

function checkWinner(turno) {
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
                        console.error('errore in checkWinner')
                        break
                }
            }
        }
    }

    if (mosseSottoAttacco.length == 0) {
        return true
    }

    return false
}

function checkTie() {
    let tie = []
    for(let j = 0; j < scacchiera.length; j ++) {
        for(let i = 0; i < scacchiera[j].length; i ++) {
            if(scacchiera[j][i].pedina != '') {
                tie.push(scacchiera[j][i].pedina)
            }
        }
    }

    if (tie.length == 2) return true

    return false
}

function rimuoviEnPassant(turno) {
    for(let j = 0; j < scacchiera.length; j ++) {
        for(let i = 0; i < scacchiera[j].length; i ++) {
            if(scacchiera[j][i].enpassant && scacchiera[j][i].pedina.charAt(0) == turno) {
                scacchiera[j][i].enpassant = false
            }

            if(scacchiera[j][i].aroccoFattibile) {
                if(scacchiera[j][i].pedina.substring(1) != 'TO' && scacchiera[j][i].pedina.substring(1) != 'RE') {
                    scacchiera[j][i].aroccoFattibile = false
                }
            }
        }
    }
}

function enPassantHandler(coords) {
    scacchiera[coords.YpedinaMangiata][coords.x].pedina = ''
    scacchiera[coords.YpedinaMangiata][coords.x].enpassant = false
    immagini[coords.YpedinaMangiata][coords.x].src = 'images/trasparente.png'
}

function checkArocco(coords) {
    let backUpCasellaCliccata = Object.assign({}, casellaCliccataMossa)
    let coordinate = Object.assign({}, coords)

    if(checkScacco(datiDiGioco.Turno) == false && scacchiera[coords.y][coords.x].aroccoFattibile) {
        let mosse = []
        let mosseNonDefinitive = []


        if(scacchiera[coords.y][7].aroccoFattibile && scacchiera[coords.y][7].pedina.substring(1) == 'TO') {
            mosseNonDefinitive = mosseNonDefinitive.concat(calcolatoreDellaMossa(coords, 0, 1, 2))

            coords = Object.assign({}, coordinate)
            let mosseFinali = filtroMosseLegali(mosseNonDefinitive, coords)

            if(mosseFinali.length == 2) {
                for(let i = 0; i < mosseFinali.length; i++) {
                    if(i == 1) {
                        mosseFinali[i].arocco = true
                        mosseFinali[i].Ytorre = coords.y
                        mosseFinali[i].Xtorre = coords.x + 3
                        mosse.push(mosseFinali[i])
                    }
                }
            }
        }

        mosseNonDefinitive = []
        coords = Object.assign({}, coordinate)
        if(scacchiera[coords.y][0].aroccoFattibile && scacchiera[coords.y][0].pedina.substring(1) == 'TO') {
            mosseNonDefinitive = mosseNonDefinitive.concat(calcolatoreDellaMossa(coords, 0, -1, 3))
            
            coords = Object.assign({}, coordinate)
            let mosseFinali = filtroMosseLegali(mosseNonDefinitive, coords)

            if(mosseFinali.length == 3) {
                for(let i = 0; i < mosseFinali.length; i++) {
                    if(i == 1) {
                        mosseFinali[i].arocco = true
                        mosseFinali[i].Ytorre = coords.y
                        mosseFinali[i].Xtorre = 0
                        mosse.push(mosseFinali[i])
                    }
                }
            }
        }

        casellaCliccataMossa = Object.assign({}, backUpCasellaCliccata)
        return mosse
    }

    casellaCliccataMossa = Object.assign({}, backUpCasellaCliccata)
}

function aroccoHandler(coords) {
    if(coords.Xtorre == 0) {
        scacchiera[coords.Ytorre][0].pedina = ''
        scacchiera[coords.Ytorre][3].pedina = datiDiGioco.turno + 'TO'
        immagini[coords.Ytorre][0].src = 'images/trasparente.png'
    }

    if(coords.Xtorre == 7) {
        scacchiera[coords.Ytorre][7].pedina = ''
        scacchiera[coords.Ytorre][5].pedina = datiDiGioco.turno + 'TO'
        immagini[coords.Ytorre][7].src = 'images/trasparente.png'
    }
}

function gameOver(vittoria, colore) {
    let isB = colore == 'B'
    let color
    isB ? color = 'bianco' :  color = 'nero'
    datiDiGioco.partitaFinita = true

    if(vittoria) {
        titoloDelModal.textContent = 'Vittoria del ' + color
        openModal(modalFinePartita)
    } else {
        titoloDelModal.textContent = 'Pareggio'
        openModal(modalFinePartita)
    }
}

const closeModalButtons = document.querySelectorAll('[data-close-button]')
const modalFinePartita = document.getElementById('modal-fine-partita')
const titoloDelModal = document.getElementById('risultati')
const giocaAncora = document.getElementById('bottone-per-gioca-ancora')
const resetDelleImpostazioni = document.getElementById('bottone-per-reset')

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        closeModal(modalFinePartita)
    })
})

giocaAncora.addEventListener('click', () => {
    notReset()
    closeModal(modalFinePartita)
})

resetDelleImpostazioni.addEventListener('click', () => {
    reset()
    closeModal(modalFinePartita)
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
}