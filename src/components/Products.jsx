import React, { useEffect, useState } from 'react';
import { formatNumberAsFloat, formatNumberAsInt } from '../utils/formatNumber';
import { sortProductsBySold, sortProductsByPrice, sortProductsByRevenue, sortProductsByName } from '../utils/sorting';
import Arrow from './Arrow';
import SearchIcon from './SearchIcon';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortConfigs, setSortConfigs] = useState({
    column: 'name',
    direction: 'asc',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Promise.all([
          fetch('/data/branch1.json'),
          fetch('/data/branch2.json'),
          fetch('/data/branch3.json'),
        ]);
        const data = await Promise.all(response.map((res) => res.json()));

        const mergedProducts = {};
        data.forEach((branch) => {
          branch.products.forEach((product) => {
            if (mergedProducts[product.id]) {
              mergedProducts[product.id].sold += product.sold;
            } else {
              mergedProducts[product.id] = { ...product };
            }
          });
        });

        const mergedProductsArray = Object.values(mergedProducts);
        const alphabeticallySortedProducts = sortProductsByName(mergedProductsArray);
        setProducts(alphabeticallySortedProducts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSort = (column) => {
    setSortConfigs((prevSortConfigs) => {
      if (prevSortConfigs.column === column) {
        return {
          column,
          direction: prevSortConfigs.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        return {
          column,
          direction: 'asc',
        };
      }
    });
  };

  const sortedProducts = () => {
    const { column, direction } = sortConfigs;

    let sortedProducts = [...products];

    switch (column) {
      case 'name':
        sortedProducts = sortProductsByName(sortedProducts, direction);
        break;
      case 'price':
        sortedProducts = sortProductsByPrice(sortedProducts, direction);
        break;
      case 'sold':
        sortedProducts = sortProductsBySold(sortedProducts, direction);
        break;
      case 'revenue':
        sortedProducts = sortProductsByRevenue(sortedProducts, direction);
        break;
      default:
        break;
    }

    sortedProducts = sortedProducts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return sortedProducts;
  };

  const filteredProducts = sortedProducts().filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProductCount = filteredProducts.length;

  const filteredTotalSold = filteredProducts.reduce((acc, product) => {
    return acc + product.sold;
  }, 0);

  const filteredTotalPrice = filteredProducts.reduce((acc, product) => {
    return acc + product.unitPrice;
  }, 0);

  const filteredTotalRevenue = filteredProducts.reduce((acc, product) => {
    return acc + product.sold * product.unitPrice;
  }, 0);

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="relative">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search product"
          value={searchQuery}
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      {!loading && !error && (
        <table className="content-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Product Name
                {sortConfigs.column === 'name' && <Arrow direction={sortConfigs.direction === 'asc' ? 'up' : 'down'} />}
              </th>
              <th onClick={() => handleSort('price')}>
                Product Price
                {sortConfigs.column === 'price' && (
                  <Arrow direction={sortConfigs.direction === 'asc' ? 'up' : 'down'} />
                )}
              </th>
              <th onClick={() => handleSort('sold')}>
                Sold Products
                {sortConfigs.column === 'sold' && <Arrow direction={sortConfigs.direction === 'asc' ? 'up' : 'down'} />}
              </th>
              <th onClick={() => handleSort('revenue')}>
                Total Revenue
                {sortConfigs.column === 'revenue' && (
                  <Arrow direction={sortConfigs.direction === 'asc' ? 'up' : 'down'} />
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts().map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>₹{product.unitPrice}</td>
                <td>{formatNumberAsInt(product.sold)}</td>
                <td>₹{formatNumberAsFloat(product.unitPrice * product.sold)}</td>
              </tr>
            ))}
            <tr className="active-row">
              <td>{filteredProductCount}</td>
              <td>{'₹' + formatNumberAsFloat(filteredTotalPrice)}</td>
              <td>{formatNumberAsInt(filteredTotalSold)}</td>
              <td>{'₹' + formatNumberAsFloat(filteredTotalRevenue)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
