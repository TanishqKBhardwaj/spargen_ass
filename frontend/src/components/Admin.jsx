import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useSelector} from "react-redux"
import {toast} from "sonner";

const Admin = () => {
    const navigate = useNavigate();
    const {user,token}=useSelector((state)=>state.auth);
    useEffect(()=>{
        if(!user.isAdmin){
            toast.warning("Only admin entry allowed");
            navigate('/');
        }
    })
    

    const [filters, setFilters] = useState({
        q: "",
        brand: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        inStock: false,
        sort: "createdAt",
        order: "desc",
        page: 1,
        limit: 10,
    });

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                inStock: filters.inStock ? "true" : undefined,
            };
            Object.keys(params).forEach(
                (key) => (params[key] === "" || params[key] === undefined) && delete params[key]
            );
            const { data } = await axios.get(`${import.meta.env.VITE_PRODUCT_API}/`, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProducts(data.data);
            setTotalPages(data.pages);
            setTotalItems(data.total);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    fetchProducts();
  }, 500); //debouncing

  return () => clearTimeout(delayDebounceFn); 
}, [filters]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            page: 1,
        }));
    };

    const goToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setFilters((prev) => ({ ...prev, page: pageNum }));
        }
    };

    return (
  <div className="p-4 max-w-7xl mx-auto dark:bg-gray-900 dark:text-gray-100 min-h-screen">
    <div className="flex flex-col md:flex-row justify-between mb-4 items-start md:items-center gap-4 md:gap-0">
      <h1 className="text-2xl font-bold border-l-8 border-amber-600 pl-2 rounded-md">Admin - Products</h1>
      <button
        onClick={() => navigate("/admin/addProduct")}
        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
      >
        Add Product
      </button>
    </div>

    {/* Filter Box */}
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-6 space-y-3 transition-colors">
      {/* Grid changes for responsiveness: single column on small, 2 cols md, 3 cols lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="q"
          placeholder="Search keyword"
          value={filters.q}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={filters.brand}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="number"
          name="minRating"
          placeholder="Min Rating"
          step="0.1"
          min="0"
          max="5"
          value={filters.minRating}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <label className="flex items-center space-x-2 dark:text-gray-200">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock}
            onChange={handleChange}
            className="dark:bg-gray-700"
          />
          <span>In Stock Only</span>
        </label>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="createdAt">Sort by Created Date</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
          <option value="name">Sort by Name</option>
        </select>
        <select
          name="order"
          value={filters.order}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>

    {/* Table */}
    {loading ? (
      <div className="text-center py-10 dark:text-gray-200">Loading...</div>
    ) : (
      <>
        {/* Wrap table with horizontal scroll on small devices */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left whitespace-nowrap">Name</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left whitespace-nowrap">Brand</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left whitespace-nowrap">Category</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left whitespace-nowrap">Price</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left whitespace-nowrap">Rating</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left whitespace-nowrap">In Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 dark:text-gray-400 whitespace-nowrap">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    onClick={() => navigate(`/admin/product/${product._id}`)}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <td className="border border-gray-300 dark:border-gray-700 p-2 whitespace-nowrap">{product.name}</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 whitespace-nowrap">{product.brand}</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 whitespace-nowrap">{product.category}</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 whitespace-nowrap">${product.price}</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 whitespace-nowrap">{product.rating}</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 whitespace-nowrap">
                      {product.countInStock > 0 ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 items-center dark:text-gray-200 gap-3 sm:gap-0">
          <button
            onClick={() => goToPage(filters.page - 1)}
            disabled={filters.page <= 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:opacity-40 transition"
          >
            Prev
          </button>
          <span>
            Page {filters.page} of {totalPages} (Total: {totalItems} items)
          </span>
          <button
            onClick={() => goToPage(filters.page + 1)}
            disabled={filters.page >= totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      </>
    )}
  </div>
);

};

export default Admin;
