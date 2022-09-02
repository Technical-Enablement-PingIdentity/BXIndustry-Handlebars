
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

  // Remove onload js event to prevent errors
  htmlDocument = htmlDocument.replace(' onload="bxi.pageLoad()"', '');

  // Remove background-image from style attributes
  htmlDocument = htmlDocument.replace(/background-image: url\(.*\)+/g, '');

  // Clean up empty style tags from above replacement
  htmlDocument = htmlDocument.replace(/\s*style="\s*"+/g, '');

  return htmlDocument;
}