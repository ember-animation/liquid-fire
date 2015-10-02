export function intBoundingRect($elt) {
  let rect = $elt[0].getBoundingClientRect();
  return {
    top: Math.round(rect.top),
    bottom: Math.round(rect.bottom),
    left: Math.round(rect.left),
    right: Math.round(rect.right)
  };
}
