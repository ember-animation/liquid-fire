// Taken from https://github.com/emberjs/ember.js/blob/4a1010a490c09dc4d662d22b229523c8f8734f82/packages/ember-template-compiler/lib/plugins/transform-with-as-to-hash.js

/**
  An HTMLBars AST transformation that replaces all instances of

  ```handlebars
  {{#liquid-with foo.bar as bar}}
  {{/liquid-with}}
  ```

  with

  ```handlebars
  {{#liquid-with foo.bar as |bar|}}
  {{/liquid-with}}
  ```
*/

function TransformLiquidWithAsToHash() {
  this.syntax = null;
}

TransformLiquidWithAsToHash.prototype.transform = function TransformWithAsToHash_transform(ast) {
  var pluginContext = this;
  var walker = new pluginContext.syntax.Walker();

  walker.visit(ast, function(node) {
    if (pluginContext.validate(node)) {

      if (node.program && node.program.blockParams.length) {
        throw new Error('You cannot use keyword (`{{liquid-with foo as bar}}`) and block params (`{{liquid-with foo as |bar|}}`) at the same time.');
      }

      var removedParams = sexpr(node).params.splice(1, 2);
      var keyword = removedParams[1].original;
      node.program.blockParams = [keyword];
    }
  });

  return ast;
};

TransformLiquidWithAsToHash.prototype.validate = function TransformWithAsToHash_validate(node) {
  return node.type === 'BlockStatement' &&
    sexpr(node).path.original === 'liquid-with' &&
    sexpr(node).params.length === 3 &&
    sexpr(node).params[1].type === 'PathExpression' &&
    sexpr(node).params[1].original === 'as';
};

// For compatibility with pre- and post-glimmer
function sexpr(node) {
  if (node.sexpr) {
    return node.sexpr;
  } else {
    return node;
  }
}

module.exports = TransformLiquidWithAsToHash;
