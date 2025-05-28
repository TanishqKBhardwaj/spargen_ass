import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button"; // Or replace with plain <button>

// ✅ Custom debounce function
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const Product = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: "",
    brand: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    inStock: false,
  });

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get("search") || "";
    setFilters((prev) => ({
      ...prev,
      q: searchQuery,
    }));
  }, [location.search]);

  const buildQuery = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== false) {
        if (key === "inStock") {
          if (value) params.append("inStock", "true");
        } else {
          params.append(key, value);
        }
      }
    });
    return params.toString();
  };

  const fetchProducts = useCallback(
    debounce(async (filters) => {
      try {
        setLoading(true);
        const queryString = buildQuery(filters);
        const res = await fetch(
          `${import.meta.env.VITE_PRODUCT_API}?${queryString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }, 400),
    [token]
  );

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {/* Show/Hide Filters Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white text-gray-800 border-l-8 border-amber-600 pl-2 rounded-md ">Products</h1>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-700 transition"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-muted dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
          <input
            name="brand"
            type="text"
            value={filters.brand}
            onChange={handleInputChange}
            placeholder="Brand"
            className="border dark:border-gray-600 bg-white dark:bg-neutral-900 p-2 rounded"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="border dark:border-gray-600 bg-white dark:bg-neutral-900 p-2 rounded"
          >
            <option value="">All Categories</option>
            <option value="Action Figures">Action Figures</option>
            <option value="Board Games">Board Games</option>
            <option value="Puzzles">Puzzles</option>
            <option value="Educational Toys">Educational Toys</option>
            <option value="Dolls">Dolls</option>
            <option value="Remote Control Toys">Remote Control Toys</option>
            <option value="Outdoor Games">Outdoor Games</option>
            <option value="Digital">Digital</option>
          </select>
          <input
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="Min Price"
            className="border dark:border-gray-600 bg-white dark:bg-neutral-900 p-2 rounded"
          />
          <input
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="Max Price"
            className="border dark:border-gray-600 bg-white dark:bg-neutral-900 p-2 rounded"
          />
          <input
            name="minRating"
            type="number"
            value={filters.minRating}
            onChange={handleInputChange}
            placeholder="Min Rating"
            className="border dark:border-gray-600 bg-white dark:bg-neutral-900 p-2 rounded"
            min="0"
            max="5"
            step="0.1"
          />
          <label className="flex items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-1 text-gray-700 dark:text-gray-200">
            <input
              name="inStock"
              type="checkbox"
              checked={filters.inStock}
              onChange={handleInputChange}
            />
            In Stock Only
          </label>
        </div>
      )}

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <Card
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="cursor-pointer hover:shadow-lg transition rounded-lg overflow-hidden bg-white dark:bg-neutral-900"
            >
              <img
                src={product.images[0] || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold dark:text-white text-gray-800">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
                <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                  ${product.price}
                </p>
                <p className="text-yellow-500 text-sm mt-1">
                  ⭐ {product.rating} ({product.numReviews})
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Product;
