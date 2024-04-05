import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductListItem from "./ProductList";
import Search from "./Search";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ category: "", price: "" });
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/products"),
          axios.get("http://localhost:8000/api/categories"),
        ]);
        setProducts(productsResponse.data.products);
        setPages(productsResponse.data.pages);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:8000/api/products?page=${currentPage}&category=${filter.category}&price=${filter.price}&search=${search}`;
        const response = await axios.get(url);
        setProducts(response.data.products);
        setPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [currentPage, filter, search]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const updateCategoryFilter = (event) => {
    setFilter({ ...filter, category: event.target.value });
    setCurrentPage(1);
  };

  const updatePriceFilter = (event) => {
    setFilter({ ...filter, price: event.target.value });
    setCurrentPage(1);
  };

  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
        categories={categories}
        updateCategoryFilter={updateCategoryFilter}
        updatePriceFilter={updatePriceFilter}
      />
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="d-flex flex-wrap justify-content-center">
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="text-center page-numbers" style={{ marginTop: "50px" }}>
          Pages{" "}
          {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn ${
                page === currentPage ? "btn-secondary" : "btn-primary"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
