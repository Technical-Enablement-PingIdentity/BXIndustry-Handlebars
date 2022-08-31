import sass from 'sass';
import fs from 'fs';
import path from 'path';

export function compileStyles(bxiRepoBasePath, destinationFolder) {
  console.info('Compiling scss...');
  const outputFile = `${destinationFolder}/styles.css`;

  const compiledAppCss = sass.compile(path.join(bxiRepoBasePath, 'scss/index.scss'), { style: 'compressed' });
  console.info('Compiled app scss');

  const compiledBootsrap = sass.compile('./scoped-bootstrap.scss', { style: 'compressed' });
  console.info('Compiled scoped bootstrap scss');

  fs.writeFileSync(outputFile, compiledAppCss.css.toString());
  fs.appendFileSync(outputFile, compiledBootsrap.css.toString());
  console.info('Compile scss written to file: ' + outputFile);
}