import React from "react";

const ProductList = ({ product }) => {
  const { category, price, name } = product;

  return (
    <div
      className="bg-light d-flex flex-column md-3 justify-content-center align-items-center text-align-center"
      style={{ width: "350px", height: "450px" }}
    >
      <div className="d-flex w-100 justify-content-between px-5 align-items-center mb-3">
        <p className="mb-0">
          {" "}
          Category: <strong>{category}</strong>
        </p>
        <h3 className="mb-0">${price}</h3>
      </div>
      <img
        src={"https://picsum.photos/250"}
        alt="product image"
        width="300"
        height="300"
      ></img>
      <h4 className="product-name">{name}</h4>
    </div>
  );
};

export default ProductList;
