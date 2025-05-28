import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ratingInput, setRatingInput] = useState(5);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState(null);

  const [showRatingInput, setShowRatingInput] = useState(false);

  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PRODUCT_API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProduct(data.product || data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleRatingSubmit = async () => {
    setRatingLoading(true);
    setRatingError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_PRODUCT_API}/rate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: ratingInput }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit rating");

      setProduct(data.data);
      toast.success("Rating submitted successfully!");
    } catch (err) {
      setRatingError(err.message);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddToCartLoading(true);
    setAddToCartError(null);

    try {
      const res = await fetch("http://localhost:5000/api/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product._id,
          quantity: quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      toast.success("Added to cart successfully!");
    } catch (err) {
      setAddToCartError(err.message);
    } finally {
      setAddToCartLoading(false);
    }
  };

  // New: Handle Add to Wishlist
  const handleAddToWishlist = async () => {
    if (!token) {
      toast.error("Please log in to add to wishlist");
      return;
    }

    setWishlistLoading(true);
    setWishlistError(null);

    try {
      const res = await fetch("http://localhost:5000/api/wishlist/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add to wishlist");

      if (data.message === "Product already in wishlist") {
        toast("Product already in wishlist");
      } else {
        toast.success("Added to wishlist successfully!");
      }
    } catch (err) {
      setWishlistError(err.message);
      toast.error(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBuyNow = () => {
    navigate(`/order/${product._id}`);
  };

  if (loading) return <p className="p-4 text-gray-700 dark:text-gray-300">Loading...</p>;
  if (!product) return <p className="p-4 text-red-600">Product not found.</p>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Images Carousel */}
      <div>
        <Carousel>
          <CarouselContent>
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <Card>
                    <CardContent className="flex items-center justify-center p-4">
                      <img
                        src={img}
                        alt={`product-${idx}`}
                        className="w-full h-96 object-contain"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <Card>
                  <CardContent className="flex items-center justify-center p-4">
                    <img
                      src="https://via.placeholder.com/300"
                      alt="placeholder"
                      className="w-full h-96 object-contain"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold dark:text-white">{product.name}</h1>
        <p className="text-gray-700 dark:text-gray-300">{product.description}</p>

        <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          ${product.price}
        </div>

        <div className="flex gap-4 flex-wrap text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>In Stock:</strong> {product.countInStock}</p>
          <p><strong>Rating:</strong> ⭐ {product.rating.toFixed(1)} ({product.numReviews} reviews)</p>
        </div>

        {/* Quantity Selector */}
        <div className="mt-4 flex items-center gap-2">
          <label htmlFor="quantity" className="font-medium dark:text-white">Quantity:</label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              size="icon"
            >
              <Minus />
            </Button>
            <input
              id="quantity"
              type="number"
              min={1}
              max={product.countInStock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 p-2 border rounded text-center dark:bg-gray-800 dark:text-white"
            />
            <Button
              variant="outline"
              onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
              size="icon"
            >
              <Plus />
            </Button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6 flex-wrap">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={handleAddToCart}
            disabled={addToCartLoading}
          >
            <ShoppingCart className="w-5 h-5" />
            {addToCartLoading ? "Adding..." : "Add to Cart"}
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
          >
            <Heart className="w-5 h-5" />
            {wishlistLoading ? "Adding..." : "Wishlist"}
          </Button>

          <Button variant="secondary" onClick={handleBuyNow}>
            Buy Now
          </Button>

          {!showRatingInput && (
            <Button variant="secondary" onClick={() => setShowRatingInput(true)}>
              Give Rating
            </Button>
          )}
        </div>

        {addToCartError && <p className="mt-2 text-red-600">{addToCartError}</p>}
        {wishlistError && <p className="mt-2 text-red-600">{wishlistError}</p>}

        {/* Rating input */}
        {showRatingInput && (
          <div className="mt-6">
            <label htmlFor="rating" className="block mb-2 font-semibold dark:text-white">
              Rate this product (1 to 5):
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setRatingInput((r) => Math.max(1, r - 1))}
                size="icon"
              >
                <Minus />
              </Button>
              <input
                id="rating"
                type="number"
                min={1}
                max={5}
                step={1}
                value={ratingInput}
                onChange={(e) => setRatingInput(Number(e.target.value))}
                className="w-16 p-2 border rounded text-center dark:bg-gray-800 dark:text-white"
              />
              <Button
                variant="outline"
                onClick={() => setRatingInput((r) => Math.min(5, r + 1))}
                size="icon"
              >
                <Plus />
              </Button>

              <Button
                onClick={handleRatingSubmit}
                disabled={ratingLoading}
              >
                {ratingLoading ? "Submitting..." : "Submit Rating"}
              </Button>
            </div>
            {ratingError && <p className="mt-2 text-red-600">{ratingError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
