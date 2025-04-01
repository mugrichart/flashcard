import React from 'react'

const McqCard = ({correctOption, selectedItem, cardMotion, blankedWordFinder, cardFormat, optionArray, handleItemClick, card, quizLength, quizType}) => {
  // //console.log(optionArray)
  return (
    <div className={`common-card ${cardMotion}`}>
      <div className="common-head">
          <div className='label0'>{cardFormat?.label0 }</div>
          <div className='label1'>{ cardFormat?.label1 }</div>
          {/* { format.label2 && <div>{ format.label2 }</div> } */}
      </div>
  
      <div className="common-main"> 
        <div className="top">
          <div>{card.type}</div>
          <div>{card['language style']}</div>
        </div>
  
        <div className="middle">
          { optionArray && 
            optionArray.map(variation => quizLength === 'short' ? 
                                          (quizType !== 'example' ? {label: variation?.word, value: variation?.word} :
                                            {label: blankedWordFinder(variation?.example, variation['blanked example']), value: variation?.example}
                                          ) 
                                        :
                                          (
                                            quizType !== 'example' ? {label: variation && variation[quizType], value: variation && variation[quizType]} :
                                            {label: variation['blanked example'], value: variation?.example}
                                          )
            ).map((item, indexHere) => {
            return  <div key={indexHere} style={{border: (selectedItem?.value && correctOption === item?.value) ? '2px solid white' : '', backgroundColor: (selectedItem?.value && correctOption === item?.value) ? 'green': (selectedItem.value === item.value ? 'red': '')}} 
                      onClick={() => {handleItemClick(item, item?.value === correctOption)}}>{item?.label}
                  </div>
          })}
        </div>
      </div>
  
      <div className="common-foot">
        {/* { format.label3 && <div>{ format.label3 }</div> } */}
        {/* { format.label4 && <div>{ format.label4 }</div> } */}
      </div>
    </div>
  )}

export default McqCard
