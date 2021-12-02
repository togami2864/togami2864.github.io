import React from 'react';
import './Lang.css';
import { Tooltip } from '@chakra-ui/react';

interface LangProps {
  isJapanese: boolean;
  isEnAvailable: boolean;
  isJaAvailable: boolean;
  title: string;
}

export const Lang: React.FC<LangProps> = ({
  isJapanese,
  isEnAvailable,
  isJaAvailable,
  title,
}) => {
  const linkToEn = `/blog/posts/${title}`;
  const linkToJa = `/ja/blog/posts/${title}`;
  return (
    <>
      <div className="lang">
        <Tooltip
          label="Sorry😢 English version is unavailable"
          isDisabled={isEnAvailable}
        >
          <a
            href={linkToEn}
            className={
              !isEnAvailable
                ? 'lang_unavailable'
                : !isJapanese
                ? 'current_lang'
                : null
            }
          >
            en
          </a>
        </Tooltip>
        <p>/</p>
        <Tooltip
          label="Sorry😢 Japanese version is unavailable"
          isDisabled={isJaAvailable}
        >
          <a
            href={linkToJa}
            className={
              !isJaAvailable
                ? 'lang_unavailable'
                : isJapanese
                ? 'current_lang'
                : null
            }
          >
            ja
          </a>
        </Tooltip>
      </div>
    </>
  );
};
