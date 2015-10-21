export default function isBrowser() {
  return (typeof window !== 'undefined') && window && (typeof document !== 'undefined') && document;
}