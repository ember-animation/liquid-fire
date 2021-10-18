import Component from '@ember/component';
import { getCodeSnippet } from 'ember-code-snippet';
import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';

import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-handlebars';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-css';

export default Component.extend({
  source: computed('name', function () {
    let { source, language } = getCodeSnippet(this.name);
    let grammar = Prism.languages[language];
    if (!grammar) {
      throw new Error(`missing language ${language}`);
    }
    return htmlSafe(Prism.highlight(source, grammar, language));
  }),
});
