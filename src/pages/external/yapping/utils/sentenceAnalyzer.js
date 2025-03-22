
export const getKeywords = (fullSentenceSplit, blankedSentenceSplit, currSentence) => {
    `
    This function takes arrays of words in a sentence and compares them with the ones in the sentence with blanks
    And uses that to retrieve the keywords
    `
    if (!(fullSentenceSplit?.length && blankedSentenceSplit)) return ''

    let sentIndex = 0
    let blankIndex = 0
    const missing = []
    // console.log('----------------------------started all over')
    // console.log(fullSentenceSplit, blankedSentenceSplit, sentIndex, currSentence)
    while (blankIndex < blankedSentenceSplit.length && sentIndex < fullSentenceSplit.length) {
        // console.log(fullSentenceSplit, blankedSentenceSplit, sentIndex, currSentence)
        const currWord = fullSentenceSplit[sentIndex]
        const currBlank = blankedSentenceSplit[blankIndex]
        if (currWord !== currBlank) {
            let cont = currWord
            // console.log(blankedSentenceSplit[blankIndex + 1], blankIndex+1)
            if (blankIndex + 1 === blankedSentenceSplit.length) cont = fullSentenceSplit.slice(sentIndex, fullSentenceSplit.length).join(' ')
            else {
                while ( !(blankedSentenceSplit[blankIndex+1] === fullSentenceSplit[sentIndex + 1] || sentIndex < fullSentenceSplit.length && ['_', '-', '['].includes(blankedSentenceSplit[blankIndex + 1][0]) )) {
                    // console.log('--------', cont, '/ ',  blankedSentenceSplit[blankIndex + 1], fullSentenceSplit[sentIndex + 1])
                    // console.log('---------', fullSentenceSplit, blankedSentenceSplit, sentIndex)
                    sentIndex++;
                    if (fullSentenceSplit[sentIndex]) {
                        cont += ' ' + fullSentenceSplit[sentIndex]
                        // console.log('...............yeah', cont)
                    }
                }
            }
            
            // console.log('bibiib............', cont, sentIndex, blankIndex)
            missing.push(cont)
        }
        // console.log('.....olol.....indices: ', sentIndex, blankIndex, fullSentenceSplit[sentIndex], blankedSentenceSplit[blankIndex])
        sentIndex++;
        blankIndex++;
    }
    return missing.map(word => {
        let done = false
        return word.split('').reverse().map(char => {
                if (['.', ',', ';', ']', '"', '!', '?', ')'].includes(char) && !done ){
                    return ''
                }
                else {
                    done = true
                    return char
                }
            }
        ).reverse().join('')
    })
  }

export const removeKeywords = (fullSentenceSplit, blankedSentenceSplit, currSentence) => {
    `
    This function takes arrays of words in a sentence and compares them with the ones in the sentence with blanks
    And uses that to remove the keywords from the sentence
    `
    if (!(fullSentenceSplit?.length && blankedSentenceSplit)) return ''

    let sentIndex = 0
    let blankIndex = 0
    const sent = []
    const corrSent = []
    while (blankIndex < blankedSentenceSplit.length && sentIndex < fullSentenceSplit.length) {
        // console.log(fullSentenceSplit, blankedSentenceSplit, sentIndex, currSentence)
        const currWord = fullSentenceSplit[sentIndex]
        const currBlank = blankedSentenceSplit[blankIndex]
        if (currWord !== currBlank) {
            let cont = currWord
            if (blankIndex + 1 === blankedSentenceSplit.length) cont = fullSentenceSplit.slice(sentIndex, fullSentenceSplit.length).join(' ')
            else {
                while ( !(blankedSentenceSplit[blankIndex + 1] === fullSentenceSplit[sentIndex + 1] || ['_', '-', '['].includes(blankedSentenceSplit[blankIndex + 1][0]) ) && sentIndex < fullSentenceSplit.length) {
                    sentIndex++;
                    if (fullSentenceSplit[sentIndex]) cont += ' ' + fullSentenceSplit[sentIndex]
                }
            }
            corrSent.push(cont)
            let dashed = cont.split('').map(char => ['.', ',', ';', ']', '"', '!', '?', ')'].includes(char) ? char : '_').join('')
            const many = dashed.length - 5
            for (let i = 0; i < Math.abs(many); i++) dashed = many > 0 ? dashed.replace('_', '', i) : '_' + dashed
            sent.push(dashed)
        }

        else {
            sent.push(currBlank);
            corrSent.push(currWord)
        }

        sentIndex++;
        blankIndex++;
    }
    return [sent, corrSent]
}
