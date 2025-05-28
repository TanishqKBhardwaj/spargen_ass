import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import {useSelector} from "react-redux";

const AdminProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); 
  const  {user,token} = useSelector((state)=>state.auth)
  useEffect(()=>{
   if(!user.isAdmin){
    toast.warning("Admin access only");
    navigate('/');
   }
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_PRODUCT_API}/${id}`);
        setProduct(res.data.product);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_PRODUCT_API}/delete/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      toast.success('Product deleted');
      navigate('/admin');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = () => {
    navigate(`/admin/edit-product/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="bg-card shadow-md rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Carousel */}
        <div className="w-full relative">
          {product.images.length > 0 ? (
            <Carousel className="relative w-full">
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center">
                      <img
                        src={img}
                        alt={`product-${index}`}
                        className="h-72 w-full object-cover rounded-xl shadow"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 
                           bg-black/70 text-white rounded-full p-2
                           hover:bg-black/90 transition shadow-xl"
                aria-label="Previous image"
              />
              <CarouselNext
                className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 
                           bg-black/70 text-white rounded-full p-2
                           hover:bg-black/90 transition shadow-xl"
                aria-label="Next image"
              />
            </Carousel>
          ) : (
            <p className="text-muted-foreground italic">No images available</p>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3 border-l-8 border-amber-600 pl-2 rounded-md">{product.name}</h1>
            <p className="text-muted-foreground mb-5">{product.description}</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-foreground">
              <p><span className="font-semibold">Brand:</span> {product.brand}</p>
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              <p><span className="font-semibold">Price:</span> ₹{product.price}</p>
              <p><span className="font-semibold">Stock:</span> {product.countInStock}</p>
              <p><span className="font-semibold">Rating:</span> {product.rating}</p>
              <p><span className="font-semibold">Reviews:</span> {product.numReviews}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>

            {/* Alert Dialog for Delete */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this product.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                    onClick={() => {
                      handleDelete();
                      setOpen(false);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
