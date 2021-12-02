import React from 'react';
import './Lang.css';

interface LangProps {
  isJaVer: boolean;
  isLangAvailable?: boolean;
}

export const Lang: React.FC<LangProps> = ({ isJaVer, isLangAvailable }) => {
  return (
    <>
      <div className="lang">
        <p className={!isJaVer && 'current_lang'}>en</p>
        <p> / </p>
        <p className={isJaVer && 'current_lang'}>ja</p>
      </div>
    </>
  );
};
