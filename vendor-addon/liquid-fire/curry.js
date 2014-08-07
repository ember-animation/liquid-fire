export default function curry(animationName) {
  var curriedArgs= Array.prototype.slice.apply(arguments, [1]);
  return function() {
    var innerHandler = this.lookup(animationName),
        args = Array.prototype.slice.apply(arguments);
    args.splice.apply(args, [2, 0].concat(curriedArgs));
    return innerHandler.apply(this, args);
  };
}
