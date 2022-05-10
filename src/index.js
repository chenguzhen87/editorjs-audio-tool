import './index.css';

const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" class=".codex-editor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';

/**
 * @typedef {object} AudioEditorData
 * @prop {string} url - audio file url
 * @prop {string} type - mimeType of audio file
 */

/**
 * @typedef {object} AudioEditorConfig
 * @prop {string} endpointUrl - url to upload to
 * @prop {bool} dowloadable - set if audio display have download button
 * @prop {function(object) object} requestParser - function to edit upload request
 * @prop {function(object) string} respondParser - function to edit upload respond
 * @prop {function()} onDelete - this function is called after deleted
 */

/**
 * @class AudioEditor
 * @classdesc Audio tool for Editor.js
 */
class AudioEditor {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'Audio',
      icon: icon
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: AudioEditorData, config: AudioEditorConfig, api: object, readOnly: boolean}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, config, api, block, readOnly }) {
    /**
     * @property {boolean} readOnly - use to specify if this block is read only
     */
    this.readOnly = readOnly;
    /**
     * @property {AudioEditorConfig} config - use for custom AudioEditor behavior
     */
    this.config = {
      endpointUrl: config.endpointUrl || null,
      dowloadable: config.dowloadable || false,
      requestParser: config.requestParser || null,
      respondParser: config.respondParser || null,
      field: config.field || 'file',
      types: config.types || 'audio/*',
      onDelete: config.onDelete || null
    };
    /**
     * @property {AudioEditorData} data - object that use for render ui
     */
    this.data = {
      url: data.url || null,
      type: data.type || null
    };
    /**
     * @property {object} api - Editor.js API instance
     */
    this.api = api;
    /**
     * @property {object} block - use for custom AudioEditor behavior
     */
    this.block = block;
    this._initUploadElement();
  }

  _initUploadElement = () => {
    const uploadButton = document.createElement('input');
    uploadButton.setAttribute('type', 'file');
    uploadButton.setAttribute('accept', this.config.types);
    uploadButton.onchange = this._updateUrl;
    /**
     * @property {object} block - use for custom AudioEditor behavior
     */
    this.uploadButton = uploadButton;
  };

  _updateUrl = async () => {
    const file = this.uploadButton.files[0];
    const { type } = file;
    this.button.parentNode.classList.add(
      'editerjs-audio-loading',
      this.api.styles.loader
    );

    let body = new FormData();
    body.append(this.config.field, file);

    let request = {
      method: 'POST',
      body
    };

    if (this.config.requestParser !== null) {
      request = this.config.requestParser(request, this.block);
    }
    let respond = await fetch(this.config.endpointUrl, request);

    if (this.config.respondParser !== null) {
      this.api.blocks.update(this.block.id, {
        url: await this.config.respondParser(respond, this.block),
        type
      });
    } else {
      let url = (await respond.json()).url;
      this.api.blocks.update(this.block.id, { url, type });
    }
  };

  _createUploadButton = () => {
    const button = document.createElement('div');
    button.classList.add('cdx-button');
    button.innerHTML =
      this.config.buttonContent ||
      `${icon} ${this.api.i18n.t('Select an Audio')}`;
    button.onclick = () => {
      this.uploadButton.click();
    };

    this.button = button;

    return button;
  };

  _createAudioPlayer = () => {
    const player = document.createElement('audio');
    const source = document.createElement('source');
    player.setAttribute('controls', '');
    if (!this.config.downloadable) {
      player.setAttribute('controlsList', 'nodownload');
    }
    player.classList.add('editerjs-audio-conent__audio-player');
    source.setAttribute('src', this.data.url);
    source.setAttribute('type', this.data.type);
    player.appendChild(source);
    return player;
  };

  _createAudioUrlInvalidAlert() {
    const button = document.createElement('div');
    button.classList.add('cdx-button');
    button.innerHTML = `${this.api.i18n.t('Audio url file is invalid')}`;
    return button;
  }

  /**
   * Create AudioEditor element
   *
   * @returns {Element}
   */
  render = () => {
    if (this.readOnly) {
      if (typeof this.data.url !== 'string') {
        return this._createAudioUrlInvalidAlert();
      } else {
        return this._createAudioPlayer();
      }
    } else {
      if (typeof this.data.url !== 'string') {
        this.uploadButton.click();
        return this._createUploadButton();
      } else {
        return this._createAudioPlayer();
      }
    }
  };

  removed() {
    if (this.config.onDelete !== null) {
      this.config.onDelete(this.block);
    }
  }

  /**
   * Extract AudioEditor data
   *
   * @param {HTMLDivElement} AudioEditorElement - element to save
   * @returns {AudioEditorData}
   */
  save() {
    return this.data;
  }
}

export default AudioEditor;
