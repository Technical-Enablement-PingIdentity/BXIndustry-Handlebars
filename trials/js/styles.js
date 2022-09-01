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

  // Compiled bxi css and bootstrap are added to the same file
  fs.writeFileSync(outputFile, compiledAppCss.css.toString());
  fs.appendFileSync(outputFile, compiledBootsrap.css.toString());
  console.info('Compiled scss written to file: ' + outputFile);
}