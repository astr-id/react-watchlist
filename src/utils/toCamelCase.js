export const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
