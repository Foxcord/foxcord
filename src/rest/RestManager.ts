import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';
import { RestOptions } from '../utils/Interfaces';

export class RestManager {
  /**
   * Request
   * @param {string} url
   * @param {RestOptions} options
   * @returns {Promise<void>}
   */
  public async request(url: string, options: RestOptions): Promise<object | any> {
    const initOptions = {
      method: 'POST',
      headers: this._resolveHeadersContent(options.token),
      credentials: 'include',
      body: options.data ? options.data : null,
    };
    let returnedContent;
    switch (options.method?.toUpperCase()) {
      case 'GET':
        initOptions.method = 'GET';
        break;
      case 'PATCH':
        initOptions.method = 'PATCH';
        break;
      case 'DELETE':
        initOptions.method = 'DELETE';
        break;
      case 'PUT':
        initOptions.method = 'PUT';
        break;
    }
    if (initOptions.method === 'DELETE' || initOptions.method === 'PUT') {
      await fetch(url, { ...initOptions }).then(async (res) => {
        return;
      });
    }
    await fetch(url, { ...initOptions })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        returnedContent = JSON.stringify(json);
      })
      .catch((err) => console.error(err));
    return returnedContent;
  }

  public async postFile(url: string, files: string | string[], options: RestOptions): Promise<void> {
    let returnedContent;
    const form = new FormData();
    if (Array.isArray(files)) {
      files.forEach((element: any) => {
        const stats = fs.statSync(element);
        const fileStream = fs.createReadStream(element);
        form.append('file', fileStream, { knownLength: stats.size });
      });
    } else {
      const fileStream = fs.createReadStream(files);
      const stats = fs.statSync(files);
      form.append('file', fileStream, { knownLength: stats.size });
    }
    const initOptions = {
      method: 'POST',
      headers: this._resolveHeadersContent(options.token),
      credentials: 'include',
      body: form,
    };
    await fetch(url, { ...initOptions })
      .then((res) => res.json())
      .then((json) => {
        returnedContent = JSON.stringify(json);
      })
      .catch((err) => console.error(err));
    return returnedContent;
  }

  /**
   * Post a file (webhooks only)
   * @param {string} url
   * @param {string} file
   * @param {RestOptions} options
   * @returns {Promise<void>}
   */
  public async postWebhookFile(url: string, file: string, options: RestOptions): Promise<void> {
    let returnedContent;
    const form = new FormData();
    const parsedData = JSON.parse(options.data);
    const stats = fs.statSync(file);
    const fileStream = fs.createReadStream(file);
    form.append('file', fileStream, { knownLength: stats.size });
    form.append('username', parsedData.username);
    if (parsedData.avatar_url) form.append('avatar_url', parsedData.avatar_url);
    const initOptions = { method: 'POST', credentials: 'include', body: form };
    await fetch(url, { ...initOptions })
      .then((res) => res.json())
      .then((json) => {
        returnedContent = JSON.stringify(json);
      })
      .catch((err) => console.error(err));
    return returnedContent;
  }

  /**
   * @private
   * @ignore
   * @param {string} headersContent
   * @returns {object|any}
   */
  private _resolveHeadersContent(headersContent?: string): object | any {
    if (!headersContent) return { 'Content-Type': 'application/json' };
    return { Authorization: 'Bot ' + headersContent, 'Content-Type': 'application/json' };
  }
}
