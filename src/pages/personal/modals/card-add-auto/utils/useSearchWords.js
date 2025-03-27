import axios from "axios";
import { useEffect, useState } from "react";

import { httpEndpoint } from '../../../../../../serverConfig'

export const useSearchWords = (trackedSearchValue, deckLang, delay=2000) => {
    const [searchWords, setSearchWords] = useState([])
    // const [debouncedValue, setDebouncedValue] = useState(searchValue)
    const [status, setStatus] = useState('idle') // idle  | loading | success | error

    // //console.log(deckLang)

    useEffect(() => {
        const timeout = setTimeout(() => {
            // setDebouncedValue(searchValue)
            if (!trackedSearchValue) setSearchWords([])
        }, delay)
        if (! (status === 'loading')) setStatus('idle')
        return () => clearTimeout(timeout)
    }, [trackedSearchValue]);

    const fetching = (searchValue) => {
        console.log(searchValue)
        if (searchValue)  {
            setStatus('loading')
            axios.get(`${ httpEndpoint }/words/search?language=${deckLang}&word=${searchValue}`)
                .then(res => {
                // console.log(res.data.searchWords)
                setSearchWords(res.data.searchWords)
                setStatus('success')      
            }) 
        }
        else {
            setSearchWords([])
            setStatus('error')  
        }    
    }

    // useEffect(() => {
    //     if (debouncedValue)  {
    //         console.log(deckLang)
    //         setLoading(true)
    //         axios.get(`${ httpEndpoint }/words/search?language=${deckLang}&word=${debouncedValue}`)
    //             .then(res => {
    //             // //console.log(res.data.searchWords)
    //             setSearchWords(res.data.searchWords)
    //             setLoading(false)      
    //         }) 
    //     }
    //     else {
    //         setSearchWords([])
    //         setLoading(false)  
    //     }    
        
    // }, [debouncedValue, deckLang])

    return [fetching, searchWords, status, setStatus]

}