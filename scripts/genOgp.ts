import nodeHtmlToImage from 'node-html-to-image';
import { embedTitle } from './embedTitle';
import fs from 'fs';
import grayMatter from 'gray-matter';

const OUTPUTPATH = process.cwd() + '/public/ogp/';

const POSTS_IN_ENGLISH = '/src/pages/blog/posts';
const POSTS_IN_JAPANESE = '/src/pages/ja/blog/posts';
const enArticles = process.cwd() + POSTS_IN_ENGLISH;
const jaArticles = process.cwd() + POSTS_IN_JAPANESE;

const genArticleOGP = async (path) => {
  const filenames = await fs.readdirSync(path);
  await Promise.all(
    filenames.map(async (filename) => {
      const filepath = path + '/' + filename;

      const fileData = await fs.readFileSync(filepath, {
        encoding: 'utf-8',
      });
      const { data } = grayMatter(fileData);
      const outputDir = data.lang != 'ja' ? OUTPUTPATH : OUTPUTPATH + `ja/`;
      if (
        fs.existsSync(outputDir + `${filename.replace(/\.[^/.]+$/, '')}.png`)
      ) {
        return Promise.resolve('already exists!! skip this.');
      }
      nodeHtmlToImage({
        output: outputDir + `${filename.replace(/\.[^/.]+$/, '')}.png`,
        html: embedTitle(data.title),
        puppeteerArgs: {
          defaultViewport: {
            width: 1200,
            height: 630,
          },
        },
      })
        .then(() =>
          console.log(`success:  ${filename.replace(/\.[^/.]+$/, '')}`)
        )
        .catch((e) => {
          console.error(e);
        });
    })
  );
};

(async () => {
  const startTime = performance.now();
  await genArticleOGP(enArticles);
  await genArticleOGP(jaArticles);
  const endTime = performance.now();
  console.log(endTime - startTime);
})();
