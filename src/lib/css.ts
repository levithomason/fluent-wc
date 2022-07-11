//
// TODO: Tokens would come from the theme
//
export type Tokens = {
  brand: string;
};
export type TokenFunction = (tokens: Tokens) => string;

const tokens: Tokens = {
  brand: "cornflowerblue",
};

//
// CSS
//
export const css = (strings: TemplateStringsArray, ...fns: TokenFunction[]) => {
  return strings.reduce((acc, next, i) => {
    if (i < strings.length - 1) {
      return acc + next + fns[i](tokens);
    }

    // final string has no fn following it
    return acc + next;
  }, "");
};
