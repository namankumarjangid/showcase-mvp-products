export const formatNumberAsInt = (amount) => {
  return parseFloat(Number(amount)).toLocaleString('en-IN');
};

export const formatNumberAsFloat = (amount) => {
  return parseFloat(Number(amount)).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
