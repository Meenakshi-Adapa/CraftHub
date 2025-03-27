import React, { useState } from 'react';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  return (
    <div className="products-container">
      {products.length === 0 ? (
        <div className="no-products">
          <h2>No Products Available</h2>
          <p>Artists haven't posted any products yet. Check back soon!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-actions">
                <button className="add-to-cart">Add to Cart</button>
                <button className="contact-artist">Contact Artist</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;