import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { spawn } from 'child_process';

const PRINTNANNY_TMP_DIR = process.env.PRINTNANNY_PI_ID || ".tmp";


export async function downloadToFile(outFile: string, swuUrl: string): Promise<string> {
  const file = fs.createWriteStream(outFile);
  return new Promise((resolve, reject) => {
    https.get(swuUrl, function (response) {
      response.pipe(file);
      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        console.log(`Finished downloading ${swuUrl} to ${outFile}`);
        resolve(outFile)
      });
    });
  })

}
/**
* Returns promise of downloaded filename
* @param url 
* @param version 
*/
export async function downloadUpdate(swuUrl: string): Promise<string> {
  const urlParts = swuUrl.split('/');
  const fileName = urlParts[urlParts.length - 1]
  const outFile = path.resolve(PRINTNANNY_TMP_DIR, fileName)
  // create outfile directories
  await fs.promises.mkdir(outFile, { recursive: true }).catch(console.error);
  return downloadToFile(outFile, swuUrl);
}

/**
* Apply software update via swupdate-client CLI
*/
export function applyUpdate(fileName: string): void {
  const cmd = spawn('swupdate', ['-v', '-i', fileName]);
  cmd.stdout.on('data', (data) => {
    console.log('swupdate: ', data)
  });
  cmd.stderr.on('data', (data) => {
    console.error('swupdate: ', data)
  });
  cmd.on('close', (code) => {
    console.log(`software update exited with ${code}`);
  });
}