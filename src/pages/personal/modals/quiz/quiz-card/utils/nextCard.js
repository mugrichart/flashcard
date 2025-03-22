

export default (setQuizDone, btmProSize, setBtmProSize, delayId, cardTime, quizType, deckLearnChunk, setCard, changeCard, setSelectedItem) => {
    if (btmProSize == 0) return
    delayId = setTimeout(() => {
      setQuizDone(() => {
        if (btmProSize < 100) {
              const nextCard = deckLearnChunk[Math.round(btmProSize * deckLearnChunk.length/100)] // in case it doesn't have a synonym for ex
              console.log(deckLearnChunk)
              if (!nextCard[quizType]) return setBtmProSize(prev =>  Math.round((Math.round(prev*deckLearnChunk.length/100) + 1) * 100/deckLearnChunk.length) )
              setCard(deckLearnChunk[Math.round(btmProSize * deckLearnChunk.length/100)]);
              changeCard('>')
              setSelectedItem({})
              return false
        } else {
              return true
        }
      })
    }, 3000)
}