export const safeParse = (string, defaultValue) => {
  try {
    return JSON.parse(string);
  } catch {
    return defaultValue || [];
  };
};

export const zipDSL = (dsl = []) => {
  return dsl.reduce((pre, cur) => {
    const { children = [], name, id, schemaValue } = cur;
    const zip = {
      name,
      id,
      children: children?.length ? zipDSL(children) : [],
      schemaValue
    };
    pre.push(zip);
    return pre;
  }, []);
};