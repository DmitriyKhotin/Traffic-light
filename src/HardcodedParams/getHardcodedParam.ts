const queryParams = new URLSearchParams(document.location.search);

queryParams.forEach((value, key) => {
  /* eslint-disable */
  console.warn(`Get HARDCODED PARAMS ${key} = ${value}`);
});

export const getHardcodedParam = (key: string) => queryParams.get(key);
