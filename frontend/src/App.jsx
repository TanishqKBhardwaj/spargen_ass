import Navbar from "./components/Navbar"
import { Typewriter } from 'react-simple-typewriter'
import {Routes,Route} from 'react-router-dom'
import Home from "./components/Home"
import Login from "./components/Login"
import { ThemeProvider } from "./components/ui/theme-provider"
import AddProduct from "./components/AddProduct"
import Admin from "./components/Admin"
import AdminProduct from "./components/AdminProduct"
import AdminEditProduct from "./components/AdminEditProduct"
import Product from "./components/Product"
import ProductDetails from "./components/ProductDetails"
import OrderPage from "./components/OrderPage"
import AllOrders from "./components/AllOrders";
import OrderDetails from "./components/OrderDetails"
import CartItems from "./components/CartItems"
import WishList from "./components/Wishlist"


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="max-w-7xl mx-auto space-y-4">
      <Navbar/>
      <div className="text-center font-bold text-3xl md:text-5xl">
      <Typewriter
            words={['Fun Starts Here!',
    'Unbox Joy Everyday!',
    'Toys for Every Age!',
    'Games That Spark Imagination!',
    'Playtime, Anytime!',
    'Your Toy Adventure Begins!',
    'Shop. Play. Repeat.',
    'From Classics to the Coolest New Toys!',
    'Build. Create. Explore.']}
            loop={5}
            cursor
            cursorStyle='_'
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
          </div>

        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Login />} />
        <Route path='/admin/addProduct' element={<AddProduct/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/admin/product/:id' element={<AdminProduct/>}/>
        <Route path='/admin/edit-product/:id' element={<AdminEditProduct/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>
        <Route path="/order/:productId" element={<OrderPage/>}/>
        <Route path="/allOrders" element={<AllOrders/>}/>
        <Route path="/orderDetails/:id" element={<OrderDetails />} />
        <Route path="/cart/" element={<CartItems />} />
        <Route path="/wishlist/" element={<WishList />} />
        

      </Routes>
      
    </div>
    </ThemeProvider>
  )
}

export default App
