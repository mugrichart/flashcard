

import React, { useEffect, useState } from 'react'
import "./Lobby.css"
import fetchAll from '../../../../../../api/http/deck/fetchAll'
import WebSocketService from '../../../../../../api/ws'
import fetchOne from '../../../../../../api/http/deck/fetchOne'

const Lobby = ({deck, setGameInfo, gameInfo}) => {
    console.log(deck)
    const [decks, setDecks] = useState([])

    useEffect(() => {
        fetchAll().then(data => {
            console.log(data)
            setDecks(data?.decks || [])
        })
    }, [])

    const selectDeck = (_deck) => {
        fetchOne(_deck._id).then(deck => {
            setGameInfo(prev => ({...prev, data: {...gameInfo.data, deck}}))
            WebSocketService.send("game/lobby", {...gameInfo, data: {...gameInfo.data, deck}})
        })
    }

  return (
    <div className='lobby'>
        <h2>{ deck?.deckName ? "The quiz will be on this deck" : "Pick a deck for this quiz"}
        </h2>
        {
            deck.deckName ? 
            <div className='deck'>{deck.deckName}</div> :
        
            <ul>
                {
                    decks.map(deck => 
                                <span className='deck' onClick={() => selectDeck(deck)}
                                >{deck.deckName}</span>
                            )
                }
            </ul>
        }
    </div>
  )
}

export default Lobby