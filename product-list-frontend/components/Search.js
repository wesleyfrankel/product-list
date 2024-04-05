import React from "react";

const Search = ({
  search,
  setSearch,
  categories,
  updateCategoryFilter,
  updatePriceFilter,
}) => {
  return (
    <div className="form-group d-flex search-bar">
      <input
        className="form-control w-50"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      <select
        className="form-select w-25"
        onChange={updateCategoryFilter}
        aria-label="Choose a category"
      >
        <option value="">Choose a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        className="form-select w-25"
        aria-label="Sort by Price"
        onChange={updatePriceFilter}
      >
        <option value="">Sort by Price</option>
        <option value="high-to-low">High to Low</option>
        <option value="low-to-high">Low to High</option>
      </select>
    </div>
  );
};

export default Search;
