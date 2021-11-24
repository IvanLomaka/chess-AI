const arrayCaselleIniziale = document.querySelectorAll('[data-casella]')
const arrayImmaginiIniziale = document.querySelectorAll('[data-immagine]')
const giocaOffline = document.getElementById('gioca-offline')
const giocaControAI = document.getElementById('play-vs-ai')
const AIvsAI = document.getElementById('ai-vs-ai')
const startGame = document.getElementById('start-game')
const settingsBeforeGame = document.getElementById('settings-before-game')
const socket = io()

const immagini = [
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8)
]

const caselle = [
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8)
]

let datiDiGioco = {
    turno: 'B',
    Turno: 'N',
    tipoPedine: 'classic',
    scuro: 'blu',
    chiaro: 'grigio',
    spostamentoCaselleChiaro: 'spostamento-caselle-grigio',
    spostamentoCaselleScuro: 'spostamento-caselle-blu',
    eat: 'spostamento-caselle-rosso',
    casellaCliccata: 'casella-cliccata',
    partitaContro: 'offline',
    coloreAI: 'N',
    turnoAIvsAI: false,
    partitaFinita: false,
    usePython: false,
}

let table = [
    ['NTO','NCA','NAL','NRG','NRE','NAL','NCA','NTO'],
    ['NPE','NPE','NPE','NPE','NPE','NPE','NPE','NPE'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['BPE','BPE','BPE','BPE','BPE','BPE','BPE','BPE'],
    ['BTO','BCA','BAL','BRG','BRE','BAL','BCA','BTO']
]
/*
let table = [
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','BAL','','','NPE',''],
    ['','','','','','','BRE',''],
    ['','BPE','BPE','NRE','NPE','','',''],
    ['','','BTO','NCA','BCA','','','BRG'],
    ['','','','','','','',''],
    ['NCA','BCA','','','','','','']
]*/

let scacchiera = [
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8)
]

for(let j = 0; j < scacchiera.length; j++) {
    for(let i = 0; i < scacchiera[j].length; i++) {
        let spazio = {
            pedina: table[j][i],
            colore: '',
        }

        if(spazio.pedina.substring(1) == 'PE') {
            spazio.enpassant = false
        }

        if(spazio.pedina.substring(1) == 'RE' || spazio.pedina.substring(1) == 'TO') {
            spazio.aroccoFattibile = false
        }

        scacchiera[j][i] = spazio
    }
}

function avvio() {
    formattazioneIn2d()
    coloroScacchiera()
    disegnoPedine()

    if(datiDiGioco.turnoAIvsAI) {
        setTimeout(AIcontroAI, 5000)
        return
    }

    if(datiDiGioco.partitaContro === 'AI') {
        arrayImmaginiIniziale.forEach(element => {
            element.addEventListener('click', mossaControAi)
        })

        if(datiDiGioco.coloreAI == 'B') {
            setTimeout(mossaAI, 500)
        }
    }

    if(datiDiGioco.partitaContro === 'offline') {
        arrayImmaginiIniziale.forEach(element => {
            element.addEventListener('click', mossaOffline)
        })
    }
}

function disegnoPedine() {
    for(let j = 0; j < scacchiera.length; j++) {
        for(let i = 0; i < scacchiera[j].length; i++) {
            if(scacchiera[j][i].pedina != '') {
                immagini[j][i].src = 'images/' + datiDiGioco.tipoPedine + '/' + scacchiera[j][i].pedina + '.png'
            }
        }
    }
}

function coloroScacchiera() {
    let coloroCasella = true // true = chiaro
    let cambio = 0

    for(let j = 0; j < scacchiera.length; j++) {
        for(let i = 0; i < scacchiera[j].length; i++) {
            
            if(coloroCasella) {
                caselle[j][i].className = datiDiGioco.chiaro
                scacchiera[j][i].colore = datiDiGioco.chiaro
            } else {
                caselle[j][i].className = datiDiGioco.scuro
                scacchiera[j][i].colore = datiDiGioco.scuro
            }

            cambio ++

            if(cambio === 8) {
                cambio = 0
            } else {
                coloroCasella = !coloroCasella
            }
        }
    }
}

function formattazioneIn2d() {
    let numero = 0
    for(let j = 0; j < caselle.length; j ++) {
        for(let i = 0; i < caselle[j].length; i ++) {
            caselle[j][i] = arrayCaselleIniziale[numero]
            numero ++
        }
    }

    numero = 0
    for(let j = 0; j < immagini.length; j ++) {
        for(let i = 0; i < immagini[j].length; i ++) {
            immagini[j][i] = arrayImmaginiIniziale[numero]
            numero ++
        }
    }
}

giocaOffline.addEventListener('click', button => {
    datiDiGioco = {
        turno: 'B',
        Turno: 'N',
        tipoPedine: 'classic',
        scuro: 'blu',
        chiaro: 'grigio',
        spostamentoCaselleChiaro: 'spostamento-caselle-grigio',
        spostamentoCaselleScuro: 'spostamento-caselle-blu',
        eat: 'spostamento-caselle-rosso',
        casellaCliccata: 'casella-cliccata',
        partitaContro: 'offline',
        coloreAI: 'N',
        turnoAIvsAI: false,
        partitaFinita: false,
        usePython: false,
    }
})

giocaControAI.addEventListener('click', button => {
    datiDiGioco = {
        turno: 'B',
        Turno: 'N',
        tipoPedine: 'classic',
        scuro: 'blu',
        chiaro: 'grigio',
        spostamentoCaselleChiaro: 'spostamento-caselle-grigio',
        spostamentoCaselleScuro: 'spostamento-caselle-blu',
        eat: 'spostamento-caselle-rosso',
        casellaCliccata: 'casella-cliccata',
        partitaContro: 'AI',
        coloreAI: 'N',
        turnoAIvsAI: false,
        partitaFinita: false,
        usePython: false,
    }
})

AIvsAI.addEventListener('click', button => {
    datiDiGioco = {
        turno: 'B',
        Turno: 'N',
        tipoPedine: 'classic',
        scuro: 'blu',
        chiaro: 'grigio',
        spostamentoCaselleChiaro: 'spostamento-caselle-grigio',
        spostamentoCaselleScuro: 'spostamento-caselle-blu',
        eat: 'spostamento-caselle-rosso',
        casellaCliccata: 'casella-cliccata',
        partitaContro: 'AI',
        coloreAI: 'N',
        turnoAIvsAI: true,
        partitaFinita: false,
        usePython: false,
    }
})

startGame.addEventListener('click', button => {
    avvio()
    settingsBeforeGame.style.display = 'none'
})