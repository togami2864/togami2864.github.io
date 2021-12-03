import React, { useState } from 'react';

export const LangSelector: React.FC = ({ initLang, translation }) => {
  const [lang, setLang] = useState(initLang);
  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
    const newLang = e.target.value == 'ja' ? '/ja' : '';
    const actualDest = window.location.pathname.replace(
      /\/([a-z]{2}-?[A-Z]{0,2})\//,
      '/'
    );
    if (translation === '') {
      window.location.pathname = newLang;
    } else {
      window.location.pathname = newLang + actualDest;
    }
  };

  return (
    <select onChange={changeLang} value={lang}>
      <option value="en" defaultValue>
        🇺🇸
      </option>
      <option value="ja">🇯🇵</option>
    </select>
  );
};
