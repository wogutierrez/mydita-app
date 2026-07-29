import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  // Our notepad that remembers if we see "CATEGORIES" or "PRODUCTS"
  const [currentView, setCurrentView] = useState("CATEGORIES");
  // Our notepad that remembers which category row was clicked
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Our notepad basket that tracks our items array: starting perfectly empty []
  const [cart, setCart] = useState([]);
  // THE STICKY NOTE: Remembers the single last product clicked to show the clerk
  const [lastItemAdded, setLastItemAdded] = useState(null);

  const addToCart = (product) => {
    // Action 1: Write down the clicked product on our temporary sticky note memory
    setLastItemAdded(product);

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        // If it exists, loop through the list and add +1 to the quantity tag of ONLY that item
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it's brand new, keep all existing items and add the new product with a starting quantity of 1
        return [...currentCart, { ...product, quantity: 1 }];
      }
    });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col">
      {/* 1. HEADER CONTROL LAYER: Fixed tight height */}
      <header className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <h1 className="font-bold text-base tracking-wide">Mydita POS</h1>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] text-slate-400 font-medium">
            Local Mode
          </span>
        </div>
      </header>

      {/* 2. THE MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP PANEL: Compressed Live Tape Monitor (~10% Height to maximize button sizes below) */}

        <section className="h-[10%] bg-slate-850 border-b border-slate-700 flex items-center justify-between px-4 py-1 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Last Item Added
            </span>
            <div className="text-sm font-bold text-slate-200">
              {lastItemAdded ? (
                <span>
                  {cart.find((item) => item.id === lastItemAdded.id)
                    ?.quantity || 1}{" "}
                  × {lastItemAdded.name}
                </span>
              ) : (
                <span className="text-slate-500 italic font-normal">
                  Basket Empty
                </span>
              )}
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Order
            </span>
            {/* This pulls from our running calculation above */}
            <span className="text-2xl font-black text-emerald-400 leading-tight">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
        </section>

        {/* BOTTOM PANEL: Rebalanced, uniform touch environment */}
        <section className="flex-1 bg-slate-900 flex flex-col justify-between p-3 overflow-hidden">
          <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider shrink-0">
            {currentView === "CATEGORIES"
              ? "Select Category"
              : `Category: ${selectedCategory}`}
          </p>

          {/* GRID LAYER: Shifted to take exactly 65% of the remaining layout space */}
          <div className="h-[65%] grid grid-cols-3 grid-rows-3 gap-2 mb-2 overflow-hidden">
            {/* {CATEGORIES.slice(0, 9).map((category) => ( */}

            {(currentView === "CATEGORIES"
              ? CATEGORIES
              : PRODUCTS.filter(
                  (product) => product.category === selectedCategory
                )
            )
              .slice(0, 9)
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    if (currentView === "CATEGORIES") {
                      // ✅ 1. Save the category name to the correct selectedCategory notepad
                      setSelectedCategory(category.name);
                      // ✅ 2. Use the correct plural word "PRODUCTS" to match the rest of the app
                      setCurrentView("PRODUCTS");
                    } else {
                      // if we are already looking at a product, add it to the basket.
                      addToCart(category);
                    }

                    // // 1. Save the name of the clicked category to our state notepad
                    // setSelectedCategory(category.name);
                    // // 2. Flip the view state over to show products
                    // setCurrentView("PRODUCTS");
                  }}
                  className={`${category.color} w-full h-full rounded-2xl p-3 flex flex-col justify-end items-start font-black text-sm sm:text-base shadow-lg active:scale-95 transition-transform`}
                >
                  <span className="leading-tight break-words text-left">
                    {category.name}

                    {currentView === "PRODUCTS" &&
                      category.price !== undefined && (
                        <span className="block text-[11px] font-normal opacity-85 mt-0.5">
                          ${category.price.toFixed(2)}
                        </span>
                      )}
                  </span>
                </button>
              ))}
          </div>

          {/* PAGINATION ROW: Expanded into a thick, chunky row (~13% height) to match grid rows */}
          <div className="h-[13%] bg-slate-800 rounded-2xl flex items-center justify-between p-2 mb-2 border border-slate-700 shrink-0">
            <button className="h-full w-24 font-black text-slate-200 bg-slate-700 rounded-xl flex items-center justify-center active:bg-slate-600 active:scale-95 transition-transform shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <span className="text-sm font-black text-slate-300 tracking-wider uppercase">
              Page 1 of 2
            </span>
            <button className="h-full w-24 font-black text-slate-200 bg-slate-700 rounded-xl flex items-center justify-center active:bg-slate-600 active:scale-95 transition-transform shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>

          {/* PERSISTENT NAVIGATION BAR: Upgraded to a massive panel (~18% height) making the bottom keys as tall as the grid buttons */}
          <div className="h-[18%] grid grid-cols-3 gap-2 shrink-0">
            {/* Review & Pay Button (Shopping Cart + Checkmark) */}
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl flex flex-col items-center justify-center gap-1 shadow-xl active:scale-95 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <span className="text-[10px] uppercase tracking-wider">Pay</span>
            </button>

            {/* Home Menu Button (House Outline) */}
            <button className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-black rounded-2xl flex flex-col items-center justify-center gap-1 shadow-xl active:scale-95 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <span className="text-[10px] uppercase tracking-wider">Home</span>
            </button>

            {/* Back Button (Undo / Return Arrow) */}
            <button
              onClick={() => {
                if (currentView === "PRODUCTS") {
                  setCurrentView("CATEGORIES");
                  setSelectedCategory(null);
                }
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-2xl flex flex-col items-center justify-center gap-1 border border-slate-700 shadow-xl active:scale-95 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
              <span className="text-[10px] uppercase tracking-wider">Back</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// ====== PASTE THIS AT THE VERY BOTTOM OF YOUR FILE ======
// This is our official product list with prices and grid colors
const PRODUCTS = [
  {
    id: "p1",
    name: "Water Bottle",
    price: 1.0,
    category: "Drinks",
    color: "bg-blue-600"
  },
  {
    id: "p2",
    name: "Coca-Cola",
    price: 1.5,
    category: "Drinks",
    color: "bg-red-600"
  },
  {
    id: "p3",
    name: "Potato Chips",
    price: 2.0,
    category: "Snacks & Sweets",
    color: "bg-amber-600"
  },
  {
    id: "p4",
    name: "Chocolate Bar",
    price: 2.5,
    category: "Snacks & Sweets",
    color: "bg-yellow-600 text-slate-900"
  },
  {
    id: "p5",
    name: "Fresh Bread",
    price: 1.2,
    category: "Bakery",
    color: "bg-orange-600"
  },
  {
    id: "p6",
    name: "Empanada",
    price: 1.75,
    category: "Bakery",
    color: "bg-amber-700"
  }
];

const CATEGORIES = [
  { id: "cat1", name: "Drinks", color: "bg-blue-600" },
  { id: "cat2", name: "Snacks & Sweets", color: "bg-amber-600" },
  { id: "cat3", name: "Bakery", color: "bg-orange-600" },
  { id: "cat4", name: "Grains & Staples", color: "bg-emerald-600" },
  {
    id: "cat5",
    name: "Cooking & Dairy",
    color: "bg-yellow-600 text-slate-900"
  },
  { id: "cat6", name: "Canned Goods", color: "bg-teal-600" },
  { id: "cat7", name: "Prepared Food", color: "bg-rose-600" },
  { id: "cat8", name: "Meat & Fish", color: "bg-red-600" },
  { id: "cat9", name: "Home & Cleaning", color: "bg-purple-600" },
  { id: "cat10", name: "Personal Care", color: "bg-pink-600" }
];

export default App;
