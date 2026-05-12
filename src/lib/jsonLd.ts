// Safely serialise an object for injection into a <script type="application/ld+json"> tag.
// JSON.stringify does not escape < > & for HTML context — a value like </script><script>
// would break out of the enclosing tag. Unicode escapes are valid JSON and inert as HTML.
export function safeJsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
