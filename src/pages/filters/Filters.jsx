import React from 'react';

import { MuiCheckbox, MuiAutoComplete } from '../../components/MuiComponents';

const languages = [{value: 'english', label: 'english'}, {value: 'french', label: 'french'} , {value: 'spanish', label: 'spanish'}]

export const LanguageSelect = ({ selectedLanguage, setSelectedLanguage }) => <MuiAutoComplete label='Language' options={languages} selectedValue={selectedLanguage} setSelectedValue={setSelectedLanguage} nullOption={{label: '', value: ''}}/>

const Filters = ({ myCardsOnly, selectedLanguage, setMyCardsOnly, setSelectedLanguage }) => { //{ onTypeChange, onLanguageChange, languages }

  return (
          <>
              <MuiCheckbox label={`My cards only`} checkedValue={myCardsOnly} 
                callback={() => setMyCardsOnly(!myCardsOnly)}
              />
              <LanguageSelect selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
          </>
  )
};

export default Filters;
