export const safeParse = (string, defaultValue) => {
  try {
    return JSON.parse(string);
  } catch {
    return defaultValue || [];
  };
};