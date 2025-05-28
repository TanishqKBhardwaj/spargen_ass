import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const categories = [
  { name: "Action Figures", image: "/categories/action-figures.jpg" },
  { name: "Board Games", image: "/categories/board-games.jpg" },
  { name: "Educational Toys", image: "/categories/educational-toys.jpg" },
  { name: "Puzzles", image: "/categories/puzzles.jpg" },
  { name: "Dolls", image: "/categories/dolls.jpg" },
  { name: "Remote Control Toys", image: "/categories/rc-toys.jpg" },
  { name: "Outdoor Games", image: "/categories/outdoor-games.jpg" },
];

// Sample product data for featured, best sellers, and new arrivals
const products = [
  {
    id: 1,
    name: "Super Robot Action Figure",
    image: "/products/robot.jpg",
    price: "$29.99",
  },
  {
    id: 2,
    name: "Magic Castle Board Game",
    image: "/products/board-game.jpg",
    price: "$49.99",
  },
  {
    id: 3,
    name: "STEM Learning Kit",
    image: "/products/stem-kit.jpg",
    price: "$39.99",
  },
  {
    id: 4,
    name: "Puzzle Adventure",
    image: "/products/puzzle.jpg",
    price: "$19.99",
  },
  {
    id: 5,
    name: "Remote Control Race Car",
    image: "/products/rc-car.jpg",
    price: "$59.99",
  },
];

// Sample customer reviews
const reviews = [
  {
    id: 1,
    name: "Emily R.",
    rating: 5,
    comment:
      "My kids absolutely love the action figures! Great quality and super detailed.",
  },
  {
    id: 2,
    name: "James P.",
    rating: 4,
    comment: "The board games are fantastic family fun. Highly recommend!",
  },
  {
    id: 3,
    name: "Sophia L.",
    rating: 5,
    comment: "Excellent educational toys that keep my kids engaged for hours.",
  },
];

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* HERO BANNER */}
      <section className="relative rounded-lg overflow-hidden shadow-lg bg-gradient-to-r from-amber-400 via-red-400 to-pink-500 text-white">
        <img
          src="/hero/toys-banner.jpg"
          alt="Toys Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative px-8 py-24 md:py-32 flex flex-col items-start max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Discover Joyful Playtime with Our Toys & Games
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-xl drop-shadow-md">
            Handpicked toys that spark imagination and fun for all ages.
          </p>
          <a
            href="/product"
            className="inline-block bg-white text-amber-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-amber-100 transition"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* BROWSE CATEGORIES CAROUSEL */}
      <section>
        <h2 className="text-3xl font-bold mb-6 border-l-8 border-amber-500 pl-4">
          Browse Categories
        </h2>

        <Carousel className="relative w-full max-w-6xl mx-auto">
          <CarouselContent>
            {categories.map((category, index) => (
              <CarouselItem
                key={index}
                className="p-2 basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-black">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="text-foreground absolute top-1/2 left-2 -translate-y-1/2 z-10 block sm:block" />
          <CarouselNext className="text-foreground absolute top-1/2 right-2 -translate-y-1/2 z-10 block sm:block" />
        </Carousel>
      </section>

      {/* FEATURED PRODUCTS */}
      <section>
        <h2 className="text-3xl font-bold mb-6 border-l-8 border-amber-500 pl-4">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-2 font-bold text-amber-600">{product.price}</p>
                <button className="mt-4 w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section>
        <h2 className="text-3xl font-bold mb-6 border-l-8 border-amber-500 pl-4">
          Best Sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* For demo, reuse products */}
          {products
            .slice(0, 4)
            .map((product) => (
              <div
                key={`best-${product.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 font-bold text-amber-600">{product.price}</p>
                  <button className="mt-4 w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section>
        <h2 className="text-3xl font-bold mb-6 border-l-8 border-amber-500 pl-4">
          New Arrivals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Reuse products for demo */}
          {products
            .slice(1, 5)
            .map((product) => (
              <div
                key={`new-${product.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 font-bold text-amber-600">{product.price}</p>
                  <button className="mt-4 w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section>
        <h2 className="text-3xl font-bold mb-6 border-l-8 border-amber-500 pl-4">
          Customer Reviews
        </h2>

        <div className="space-y-8 max-w-4xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6 text-gray-900"
            >
              <div className="flex items-center mb-2">
                <h4 className="font-semibold text-lg">{review.name}</h4>
                <div className="ml-4 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-amber-500" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.463a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.388 2.463c-.785.57-1.84-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L3.607 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="italic">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="bg-amber-500 rounded-lg p-10 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Subscribe to our newsletter for exclusive offers and new arrivals.
        </p>
        <form className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="p-3 rounded text-gray-900 flex-grow focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-amber-600 font-bold px-6 rounded hover:bg-amber-100 transition"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Toyland. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.318v21.364C0 23.41.59 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.658-4.788 1.325 0 2.466.099 2.799.143v3.243l-1.922.001c-1.506 0-1.797.717-1.797 1.767v2.317h3.59l-.467 3.622h-3.123V24h6.116C23.41 24 24 23.41 24 22.682V1.318C24 .59 23.41 0 22.675 0z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557a9.833 9.833 0 01-2.828.775 4.93 4.93 0 002.164-2.724 9.865 9.865 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.936 13.936 0 011.671 3.15a4.918 4.918 0 001.523 6.562 4.903 4.903 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.085 4.919 4.919 0 004.59 3.417A9.867 9.867 0 010 21.543 13.941 13.941 0 007.548 24c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm0 2h8.5a3.75 3.75 0 013.75 3.75v8.5a3.75 3.75 0 01-3.75 3.75h-8.5a3.75 3.75 0 01-3.75-3.75v-8.5A3.75 3.75 0 017.75 4zm8.75 2.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
