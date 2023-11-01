
/**
 * Apply any string manipulations necessary to the html document before
 * writing to file
 * 
 * @param {string} htmlDocument Compiled html document
 */
export function htmlManipulations(htmlDocument) {
  const tagReplacements = {
    body: 'div',
    header: 'div',
  };

  for (let replacement in tagReplacements) {
    const newTag = tagReplacements[replacement];

    // Replace opening tag, keeping any following attributes
    htmlDocument = htmlDocument.replace(`<${replacement}`, `<${newTag}`);

    // Replace closing tag
    htmlDocument = htmlDocument.replace(`</${replacement}>`, `</${newTag}>`);

    console.log(`Tag replacement finished, ${replacement} converted to ${newTag}`);
  }

  // Remove onload and onclick js event to prevent errors
  htmlDocument = htmlDocument.replace(/\sonload=".*?"/, '');
  htmlDocument = htmlDocument.replace(/onclick="bxi.logout\(\)"/, 'id="bxi-log-out"');
  htmlDocument = htmlDocument.replace(/\sonclick=".*?"/, '');

  // Replace Log Out buttons with Sign Out
  htmlDocument = htmlDocument.replace(/\>Log Out\<\/button>/, '>Sign Out</button>');

  // Remove background-image from style attributes
  htmlDocument = htmlDocument.replace(/background-image: url\(.*\)+/g, '');

  // Clean up empty style tags from above replacement
  htmlDocument = htmlDocument.replace(/\s*style="\s*"+/g, '');

  const currentYear = new Date().getFullYear();

  // Replace {{currentYear}} with current year and {{lastYear}} with last year
  htmlDocument = htmlDocument.replace(/{{currentYear}}/g, currentYear);
  htmlDocument = htmlDocument.replace(/{{lastYear}}/g, currentYear -1);

  return htmlDocument;
}