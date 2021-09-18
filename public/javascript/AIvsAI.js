function AIcontroAI() {
    nonColorare = true
    let color = datiDiGioco.turno

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

    checkProseguimento()
}

function checkProseguimento() {
    if(datiDiGioco.partitaFinita) return

    d = depth == 3

    d ? depth = 2 : depth = 3
    setTimeout(AIcontroAI, 10)
}