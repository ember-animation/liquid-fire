const CAPITALIZE_REGEX = /(^|\/)([a-z\u00C0-\u024F])/g;

export function capitalize(str) {
  return str.replace(CAPITALIZE_REGEX, (match) => match.toUpperCase());
}
