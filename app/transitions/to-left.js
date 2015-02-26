import moveOver from "./move-over";
export default function(opts) {
  return moveOver.call(this, 'x', -1, opts);
}
