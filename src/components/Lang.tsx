import React from 'react';
import './Lang.css';
import { Tooltip } from '@chakra-ui/react';

interface LangProps {
  isJapanese: boolean;
  isEnAvailable: boolean;
  isJaAvailable: boolean;
  filename: string;
}

export const Lang: React.FC<LangProps> = ({
  isJapanese,
  isEnAvailable,
  isJaAvailable,
  filename,
}) => {
  const linkToEn = `/blog/posts/${filename}`;
  const linkToJa = `/ja/blog/posts/${filename}`;
  return (
    <>
      <div className="lang">
        <Tooltip
          label="Sorry😢 English version is unavailable"
          isDisabled={isEnAvailable}
          placement="bottom"
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
          placement="bottom"
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
