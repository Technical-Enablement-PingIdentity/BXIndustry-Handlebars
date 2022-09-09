import fs from 'fs';
import path from 'path';

export function copyStaticAssets({bxiRepoBasePath, verticals, destinationFolder}) {
  console.info('Copying static assets...');
  verticals.forEach(vertical => {
    const source = path.join(bxiRepoBasePath, `public/${vertical}`);
    const destination = destinationFolder + '/' + vertical;
    fs.cpSync(source, destination, { recursive: true });
    console.info(`Copied assets for ${vertical} from ${source} to ${destination}`);
  });
}