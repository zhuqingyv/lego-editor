export const safeParse = (string, defaultValue) => {
  try {
    return JSON.parse(string);
  } catch {
    return defaultValue || [];
  };
};

export const zipDSL = (dsl = [], nameZip = false) => {
  // 名称压缩
  if (nameZip) return dsl.reduce((pre, cur) => {
    const { n, i, c, s, children = [], name, id, schemaValue } = cur;
    const zip = {
      n: n || name,
      i: i || id,
      c: zipDSL(c || children, nameZip),
      s: s || schemaValue
    };
    pre.push(zip);
    return pre;
  }, []);

  // 非名称压缩
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