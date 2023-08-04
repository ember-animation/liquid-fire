import Component from '@glimmer/component';
import { getCodeSnippet } from 'ember-code-snippet';
import { htmlSafe } from '@ember/template';

import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-handlebars';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-css';

export default class CodeSnippetComponent extends Component {
  get source() {
    const { source, language } = getCodeSnippet(this.args.name);
    const grammar = Prism.languages[language];
    if (!grammar) {
      throw new Error(`missing language ${language}`);
    }
    return htmlSafe(Prism.highlight(source, grammar, language));
  }
}
