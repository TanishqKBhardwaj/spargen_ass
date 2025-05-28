import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const token = useSelector((state) => state.auth.token);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  // Fetch wishlist items
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch wishlist");

      setWishlistItems(data.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchWishlist();
  }, [token]);

  // Remove product from wishlist
  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to remove product");

      setWishlistItems(data.data);
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <p className="p-4 text-gray-700 dark:text-gray-300">Loading wishlist...</p>;

  if (!wishlistItems.length)
    return <p className="p-4 text-gray-700 dark:text-gray-300">Your wishlist is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Wishlist</h1>
      {wishlistItems.map(({ product }) => (
        <Card
          key={product._id}
          className="flex items-center justify-between p-3 hover:shadow-lg hover:border-primary transition cursor-pointer group"
        >
          <div
            className="flex items-center gap-4 flex-1"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <img
              src={product.images?.[0] || "https://via.placeholder.com/80"}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md border"
            />
            <div>
              <h2 className="text-lg font-semibold group-hover:text-primary transition">
                {product.name}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">
                ${product.price}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.brand}</p>
            </div>
          </div>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleRemove(product._id)}
            disabled={removingId === product._id}
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default Wishlist;
