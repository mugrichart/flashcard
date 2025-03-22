import randomGen from "../../../../../../utils/randomGen"
import shuffledNumbers from "../../../../../../utils/shuffleArray";

export default async (deck, card, format, quizType, quizLength, blankedWordFinder) => {
  if (!card || !format.content) return
        const AlreadyPicked = deck.findIndex((item) => item._id === card._id);
        const handleRandomize = async (max, howMany, alreadyUsed) => {
          try {
            const result = await randomGen(max, howMany, alreadyUsed); 
            return result;
          } catch (error) {
            console.error('Error in randomizer:', error);
          }
        };

        if (format.content.type === 'mcq') {
            const label0 = quizLength === 'short' ? 
                        (quizType === "example" ? 'Pick the right word/expression to fill in the blanks below' : 
                        (quizType === 'meaning' ? "What's the word for:" :`What is the ${quizType} of: `)) : 
                        (quizType === 'example'? 'Use the following word in the appropriate blanks': `What's the ${quizType} of`)
            const label1 = quizLength === 'short' ? (quizType === 'example'? card['blanked example']: card[quizType]) : 
                        (quizType === 'example'? blankedWordFinder(card.example, card['blanked example']): card.word)
            
            const corrOpt = (quizLength === 'long' || quizType === 'example') ? card[quizType] : card.word
            const dataArrHere = await handleRandomize(deck.length, deck.length >= 4 ? 3 : deck.length-1, AlreadyPicked)
            const options = shuffledNumbers([...new Set([...dataArrHere, AlreadyPicked])])
                                    .map(cardIndexHere => {
                                        return deck[cardIndexHere]
                                    })  

            return { label0, label1, corrOpt, options}
        }
        
        else if (format.content.type === 'guess') {
            const question = quizLength === 'short' ? (quizType === "example" ? card['blanked example'] : card[quizType]) : card.word
            const answer = quizLength === 'short' ? (quizType === "example" ? card.example : card.word) : card[quizType]
            return { question, answer }
        }

}