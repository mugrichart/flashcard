import React, { useEffect, useState } from 'react';
import './CardAddManual.css';
import axios from 'axios';
import Spinner from 'react-spinner-material';

import { useSelector, useDispatch } from 'react-redux';
import { push } from '../../../../features/personal/deck/deckSlice';
import { useNavigate } from 'react-router-dom';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

const CardAddManual = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleRefresh = usePageRefreshHandle()

  const { _id: deckId, deckName } = useSelector(state => state.deck.openDeck)

  const [userId ] = useState(JSON.parse(localStorage.getItem('user')).userId)

  useEffect(() => {
    handleRefresh(deckId)
  }, [deckId])  
  
  const [status, setStatus] = useState('preSubmit');
  const [readytosubmit, setReadytosubmit] = useState(false);
  const formTemplate = {
    'root word': '',
    addedVariations: {
      noun: false, verb: false, adverb: false, adjective: false, 'phrasal verb': false, proverb: false, idiom: false
    },
    selectedVariationType: '',
    langStyles: ['formal', 'informal', 'colloquial', 'slang', 'jargon'],
    variations: []
  }
  const [ formContent, setFormContent ] = useState({...formTemplate})

  const [variation, setVariation] = useState('')
  const [meaning, setMeaning] = useState(''); // set current value
  const [langStyle, setLangStyle] = useState('');
  const [example, setExample] = useState('');
  const [wordReferenceInExample, setWordReferenceInExample] = useState('')
  const [synonym, setSynonym] = useState('');
  const [antonym, setAntonym] = useState('');
  const [errorMsg, setErrorMsg] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault()
    if (!checkAllFilled()) return
    addNewMeaning('submitting')
    
    if (readytosubmit) return submitting()
    setReadytosubmit(true);
  }

  useEffect(() => {
    let delay;
    if (['error', 'submitted'].includes(status)) {
      delay = setTimeout(() => {
        setStatus('preSubmit');
      }, 5000);
    }
    return () => clearTimeout(delay);
  }, [status])

  const submitting = () => {
    const API_BASE_URL = API_BASE_URL
    if (status === 'submitting') return
    setStatus('submitting'); console.log('sub')
    postingData(`${API_BASE_URL}/cards/${deckName}`, { userId, deckId, deckLang, mode: 'manual', content: {'root word': formContent['root word'], variations: formContent.variations}} )
      .then((data) => {
        afterSubmitReset();
        setReadytosubmit(false)
        console.log(data.deck._id)
        dispatch(push(data.deck))
        dispatch(id(data.deck._id))
        console.log(data.deck._id)
      })
      .catch(e => {
        console.log(e.message)
        setStatus('error'); setErrorMsg("Oops... Couldn't submit your card! Try again")})
  }

  const afterSubmitReset = () => {setFormContent({...formTemplate}); setReadytosubmit(false); setVariation(''); setMeaning(''); setExample(''); setWordReferenceInExample(''); setSynonym(''); setAntonym('')};

  useEffect(() => {
    if (readytosubmit) return submitting()
  }, [readytosubmit])

  const postingData = async(url, requestBody) => {
      try {
        const response = await axios.post(url, requestBody);
        setStatus('submitted');
        return response.data;
      } catch (err) {
        const {error, deck} = err.response.data
        console.log(deck?._id)
        if (deck?.id) dispatch(id(deck.id))
        setStatus('error');
        throw new Error(`Error making POST REQUEST in manual card: ${error}`)
      }
  }

  const addVariationHandle = (variationType, picked) => {
    if (picked) return
    const firstVariation = !Object.values(formContent.addedVariations).some(value => value === true) ;
    console.log(firstVariation)
    if ( firstVariation || checkAllFilled()) {
      if (!firstVariation) {
        addNewMeaning()
        setVariation('')
      }
  
      setFormContent(prev => ({...prev, selectedVariationType: variationType, addedVariations: {...prev.addedVariations, [variationType]: true}}))
    }
  }

  useEffect(() => {
    if (example && example.includes(variation)) setWordReferenceInExample(variation)
    else setWordReferenceInExample('')
  }, [example])

  const addNewMeaning = (tryingToSubmit) => {
    if (!checkAllFilled()) return
    const variationItem = {
      variationType: formContent.selectedVariationType,
      variationWord: variation,
      'language style': langStyle,
      meaning, example, wordReferenceInExample, synonym, antonym
    }
    if(!tryingToSubmit) {setMeaning(''); setExample(''); setWordReferenceInExample(''); setSynonym(''); setAntonym(''); setLangStyle('')}
    setFormContent(prev => ({...prev, langStyles: formTemplate.langStyles, variations: [...prev.variations, variationItem]}))
  }

  const checkAllFilled = () => {
    if (meaning && langStyle && example && synonym && antonym) return true;
    setStatus('error');
    setErrorMsg('Fill the blanks first!'); 
    return false
  }

  
  return (
    <div className='card-add-manual'>
      <form action="" onSubmit={handleSubmit}>
          <section className="buttons">
            <label htmlFor="" style={{display: 'flex', color: status === 'error' ? '#b32525' : '#6cb00c'}}>
              { status === 'error' && <>{errorMsg}</> } {/*☹ try again!*/}
              { status === 'submitting' && <><Spinner radius={20} color={"#b0b0ff"} stroke={2} visible={true} />submitting </> }
              { status === 'submitted' && '✅submitted'}
            </label>
            <input type="submit"/>
            <button onClick={() => navigate('../card/add/auto')}>Generate with AI</button>
          </section>
          <hr />
          <section>
            <div>
                <label htmlFor="root word">root word</label>
                <input className = "" type="text" placeholder="fill with the root word" value={formContent['root word']} onChange={e => {setFormContent((prev) => ({ ...prev, 'root word': e.target.value}))}} />
            </div>

            <div>
                <label htmlFor="">Pick a variation of the root word</label>
                <div className='labels'>
                  {Object.entries(formContent.addedVariations).map(([key, value], i) => <label key={i} style={{color: value == true ? 'red': 'black'}} onClick={() => addVariationHandle(key, value)}>{key}</label>)}
                </div>  
            </div>
          </section>
          <hr />
          <hr />
          <section className='variation'>
            {formContent.selectedVariationType && 
            <div>
                <label htmlFor="">The {formContent.selectedVariationType}</label>
                <input type="text" value={variation} placeholder={`enter the ${formContent.selectedVariationType}`} onChange={e => setVariation(e.target.value)}/>
            </div>}

            <div>
                <label htmlFor="">meaning</label>
                <input type="text" value={meaning} placeholder="enter the meaning" onChange={e => setMeaning(e.target.value)}/>
            </div>

            <div>
                <label htmlFor="">Select the language style</label>
                <div className='labels'>
                  {formContent.langStyles.map((style, i) => <label key={i} onClick={() => {setLangStyle(style); setFormContent(prev => ({...prev, langStyles: [style]}))}}>{style}</label>)}
                </div>
            </div>

            <div>
                <label htmlFor="">example</label>
                <input className = "" type="text" placeholder="example" value={example} onChange={e => setExample(e.target.value)}/>
            </div>

            {!example.includes(variation) && <div>
                <label htmlFor="">reference</label>
                <input className = "" type="text" placeholder="reference of the word in the example" value={wordReferenceInExample} onChange={e => setWordReferenceInExample(e.target.value)}/>
            </div>}

            <div>
                <label htmlFor="">synonym</label>
                <input className = "" type="text" value={synonym} placeholder="synonym" onChange={e => setSynonym(e.target.value)}/>
            </div>

            <div>
                <label htmlFor="">antonym</label>
                <input className = "" type="text" value={antonym} placeholder="antonym" onChange={e => setAntonym(e.target.value)}/>
            </div>
          </section>
          <hr />
          {/* <div>
            <label className='variations' onClick={addNewMeaning}>Add new meaning</label>
          </div> */}
          <section><p>Pick a new variation when done</p></section>
      </form>
    
    </div>
  )
}

export default CardAddManual

