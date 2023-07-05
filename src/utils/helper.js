export const sorting = (data, key, compareFunction) => {
  if (data?.length === 0) return [];
  return data?.sort((a, b) => compareFunction(a[key], b[key]));
};

export const compareNumber = (num1, num2) => {
  return num1 - num2;
};

export const compareTimestamp = (timestamp1, timestamp2) => {
  return timestamp1?.localeCompare(timestamp2);
};
