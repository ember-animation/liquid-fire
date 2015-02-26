import moveOver from "./move-over";
export default function(opts) {
  return moveOver.call(this, 'y', -1, opts);
}
