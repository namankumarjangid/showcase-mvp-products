export const sortProductsByName = (products, direction = 'asc') => {
  return products.slice().sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return direction === 'asc' ? -1 : 1;
    }
    if (nameA > nameB) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const sortProductsByPrice = (products, direction = 'asc') => {
  return products.slice().sort((a, b) => {
    return direction === 'asc' ? a.unitPrice - b.unitPrice : b.unitPrice - a.unitPrice;
  });
};

export const sortProductsBySold = (products, direction = 'asc') => {
  return products.slice().sort((a, b) => {
    return direction === 'asc' ? a.sold - b.sold : b.sold - a.sold;
  });
};

export const sortProductsByRevenue = (products, direction = 'asc') => {
  return products.slice().sort((a, b) => {
    const revenueA = a.unitPrice * a.sold;
    const revenueB = b.unitPrice * b.sold;
    return direction === 'asc' ? revenueA - revenueB : revenueB - revenueA;
  });
};
