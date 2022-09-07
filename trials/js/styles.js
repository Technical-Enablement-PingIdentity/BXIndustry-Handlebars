import sass from 'sass';
import fs from 'fs';
import path from 'path';

export function compileStyles(verticals, bxiRepoBasePath, destinationFolder) {
  console.info('Compiling scss...');
  const compilationOptions = { style: 'compressed' }

  const compiledAppCss = sass.compile(path.join(bxiRepoBasePath, 'scss/index.scss'), compilationOptions);
  console.info('Compiled app scss');

  const compiledBootsrap = sass.compile('./trials-overrides.scss', compilationOptions);
  console.info('Compiled scoped bootstrap scss');

  // Compiled bxi css and bootstrap are added to the same file
  const completeCss = 
    compiledAppCss.css.toString() +
    compiledBootsrap.css.toString();

  verticals.forEach(vertical => {
    const outputFile = `${destinationFolder}/${vertical}/styles.css`;
    const verticalScssFile = `./scss/${vertical}.scss`;

    if (fs.existsSync(verticalScssFile)) {
      const compiledVerticalCss = sass.compile(`./scss/${vertical}.scss`, compilationOptions);
      
      // These are necessary because bundling for P1 uses webpack which will bundle ALL assets found in css
      // e.g., images for company would be added to all 15+ verticals, this would become problematic quickly
      console.info('Vertical specific scss found and compiled: ' + verticalScssFile);
      
      fs.writeFileSync(outputFile, completeCss + compiledVerticalCss.css.toString());
    } else {
      fs.writeFileSync(outputFile, completeCss);
    }
    
    console.info('Compiled scss written to file: ' + outputFile);
  });
}