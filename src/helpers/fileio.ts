import { readFile } from 'fs/promises';
import { logger } from './logger';
import axios from 'axios';

export const FILEIO_API_URL = 'https://file.io/';

export class FileIOClient {
  constructor(
    private apiURL: string | undefined,
    private apiKey: string | undefined
  ) {}

  /**
   * Upload a file to File.io that expires in 5 minutes and gets deleted after 1 download.
   *
   * @returns a URL to the file
   */
  async uploadTempFile(filepath: string, filename: string): Promise<string> {
    if (!this.apiURL || !this.apiKey) {
      throw new Error('Missing FILEIO configuration');
    }

    const fileContent = await readFile(filepath);
    const formData = new FormData();
    formData.append('file', new Blob([fileContent]), filename);
    formData.append('expires', new Date(Date.now() + 300 * 1000).toISOString()); // expires in 5 minutes
    formData.append('maxDownloads', '1');
    formData.append('autoDelete', 'true');

    const result = await axios.post(this.apiURL, formData, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      timeout: 120 * 1000, // 2 minutes
    });

    if (!result.data.success) {
      throw new Error(`upload failed: ${result.data.message}`);
    }
    return result.data.link;
  }
}

const FILEIO_API_KEY = process.env.FILEIO_API_KEY;
if (!FILEIO_API_KEY) {
  logger.warn('missing env variable FILEIO_API_KEY');
}
export const fileIOClient = new FileIOClient(FILEIO_API_URL, FILEIO_API_KEY);
