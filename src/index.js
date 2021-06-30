/**
 * Build styles
 */
require('./index.css').toString();

/**
 * @class WordQuote
 * @classdesc WordQuote Tool for Editor.js
 * @property {WordQuoteData} data - Tool`s input and output data
 * @propert {object} api - Editor.js API instance
 *
 * @typedef {object} WordQuoteData
 * @description WordQuote Tool`s input and output data
 * @property {string} text - wquote`s text
 * @property {string} caption - wquote`s caption
 * @property {string} tail - wquote`s tail
 * @property {'center'|'left'} alignment - wquote`s alignment
 *
 * @typedef {object} WordQuoteConfig
 * @description WordQuote Tool`s initial configuration
 * @property {string} wquotePlaceholder - placeholder to show in wquote`s text input
 * @property {string} captionPlaceholder - placeholder to show in wquote`s caption input
 * @property {string} tailPlaceholder - placeholder to show in wquote`s tail input
 * @property {'center'|'left'} defaultAlignment - alignment to use as default
 */
class WordQuote {
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
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"/></svg>',
      title: '摘录随评',
    };
  }

  /**
   * Empty WordQuote is not empty Block
   *
   * @public
   * @returns {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Allow to press Enter inside the WordQuote
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for wquote text
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_QUOTE_PLACEHOLDER() {
    return 'Enter a wquote';
  }

  /**
   * Default placeholder for wquote caption
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_CAPTION_PLACEHOLDER() {
    return 'Enter a caption';
  }

  
  /**
   * Default placeholder for wquote caption
   *
   * @public
   * @returns {string}
   */
   static get DEFAULT_TAIL_PLACEHOLDER() {
    return 'Enter a tail text';
  }

  /**
   * Allowed wquote alignments
   *
   * @public
   * @returns {{left: string, center: string}}
   */
  static get ALIGNMENTS() {
    return {
      left: 'left',
      center: 'center',
    };
  }

  /**
   * Default wquote alignment
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_ALIGNMENT() {
    return WordQuote.ALIGNMENTS.left;
  }

  /**
   * Allow WordQuote to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      /**
       * To create WordQuote data from string, simple fill 'text' property
       */
      import: 'text',
      /**
       * To create string from WordQuote data, concatenate text and caption
       *
       * @param {WordQuoteData} wquoteData
       * @returns {string}
       */
      export: function (wquoteData) {
        return wquoteData.caption ? `${wquoteData.text} — ${wquoteData.caption}` : wquoteData.text;
      },
    };
  }

  /**
   * Tool`s styles
   *
   * @returns {{baseClass: string, wrapper: string, wquote: string, input: string, caption: string, settingsButton: string, settingsButtonActive: string}}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-wquote',
      text: 'cdx-wquote__text',
      input: 'cdx-wquote-content',
      caption: 'cdx-wquote__caption',
      tail: 'cdx-wquote__tail',
      settingsWrapper: 'cdx-wquote-settings',
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Tool`s settings properties
   *
   * @returns {*[]}
   */
  get settings() {
    return [
      {
        name: 'left',
        icon: `<svg width="16" height="11" viewBox="0 0 16 11" xmlns="http://www.w3.org/2000/svg" ><path d="M1.069 0H13.33a1.069 1.069 0 0 1 0 2.138H1.07a1.069 1.069 0 1 1 0-2.138zm0 4.275H9.03a1.069 1.069 0 1 1 0 2.137H1.07a1.069 1.069 0 1 1 0-2.137zm0 4.275h9.812a1.069 1.069 0 0 1 0 2.137H1.07a1.069 1.069 0 0 1 0-2.137z" /></svg>`,
      },
      {
        name: 'center',
        icon: `<svg width="16" height="11" viewBox="0 0 16 11" xmlns="http://www.w3.org/2000/svg" ><path d="M1.069 0H13.33a1.069 1.069 0 0 1 0 2.138H1.07a1.069 1.069 0 1 1 0-2.138zm3.15 4.275h5.962a1.069 1.069 0 0 1 0 2.137H4.22a1.069 1.069 0 1 1 0-2.137zM1.069 8.55H13.33a1.069 1.069 0 0 1 0 2.137H1.07a1.069 1.069 0 0 1 0-2.137z"/></svg>`,
      },
    ];
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: WordQuoteData, config: WordQuoteConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly}) {
    const { ALIGNMENTS, DEFAULT_ALIGNMENT } = WordQuote;

    this.api = api;
    this.readOnly = readOnly;

    this.wquotePlaceholder = config.wquotePlaceholder || WordQuote.DEFAULT_QUOTE_PLACEHOLDER;
    this.captionPlaceholder = config.captionPlaceholder || WordQuote.DEFAULT_CAPTION_PLACEHOLDER;
    this.tailPlaceholder = config.tailPlaceholder || WordQuote.DEFAULT_TAIL_PLACEHOLDER;

    this.data = {
      text: data.text || '',
      caption: data.caption || '',
      tail: data.tail||'',
      alignment: Object.values(ALIGNMENTS).includes(data.alignment) && data.alignment ||
      config.defaultAlignment ||
      DEFAULT_ALIGNMENT,
    };
  }

  /**
   * Create WordQuote Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('blockwquote', [this.CSS.baseClass, this.CSS.wrapper]);    
    const caption = this._make('div', [this.CSS.input, this.CSS.caption], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.caption,
    });
    const wquote = this._make('div', [this.CSS.input, this.CSS.text], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.text,
    });
    const tail = this._make('div', [this.CSS.input, this.CSS.tail], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.tail,
    });

    wquote.dataset.placeholder = this.wquotePlaceholder;
    caption.dataset.placeholder = this.captionPlaceholder;
    tail.dataset.placeholder = this.tailPlaceholder;

    container.appendChild(caption);
    container.appendChild(wquote);
    container.appendChild(tail);

    return container;
  }

  /**
   * Extract WordQuote data from WordQuote Tool element
   *
   * @param {HTMLDivElement} wquoteElement - element to save
   * @returns {WordQuoteData}
   */
  save(wquoteElement) {
    const text = wquoteElement.querySelector(`.${this.CSS.text}`);
    const caption = wquoteElement.querySelector(`.${this.CSS.caption}`);
    const tail = wquoteElement.querySelector(`.${this.CSS.tail}`);

    return Object.assign(this.data, {
      text: text.innerHTML,
      caption: caption.innerHTML,
      tail: tail.innerHTML
    });
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      },
      caption: {
        br: true,
      },
      alignment: {},
    };
  }

  /**
   * Create wrapper for Tool`s settings buttons:
   * 1. Left alignment
   * 2. Center alignment
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = this._make('div', [ this.CSS.settingsWrapper ], {});
    const capitalize = str => str[0].toUpperCase() + str.substr(1);

    this.settings
      .map(tune => {
        const el = this._make('div', this.CSS.settingsButton, {
          innerHTML: tune.icon,
          title: `${capitalize(tune.name)} alignment`,
        });

        el.classList.toggle(this.CSS.settingsButtonActive, tune.name === this.data.alignment);

        wrapper.appendChild(el);

        return el;
      })
      .forEach((element, index, elements) => {
        element.addEventListener('click', () => {
          this._toggleTune(this.settings[index].name);

          elements.forEach((el, i) => {
            const { name } = this.settings[i];

            el.classList.toggle(this.CSS.settingsButtonActive, name === this.data.alignment);
          });
        });
      });

    return wrapper;
  };

  /**
   * Toggle wquote`s alignment
   *
   * @param {string} tune - alignment
   * @private
   */
  _toggleTune(tune) {
    this.data.alignment = tune;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}

module.exports = WordQuote;
