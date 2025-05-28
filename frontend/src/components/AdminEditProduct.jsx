import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";

const EditProduct = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageInputs, setImageInputs] = useState([]);
  const [localImages, setLocalImages] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    countInStock: "",
    images: [],
  });

  useEffect(() => {
    if (!token) {
      toast.warning("Please login first");
      navigate("/");
      return;
    }

    setCategories([
      "Action Figures",
      "Board Games",
      "Puzzles",
      "Educational Toys",
      "Dolls",
      "Remote Control Toys",
      "Outdoor Games",
      "Digital",
    ]);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_PRODUCT_API}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const p = res.data.product;
        setProduct(p);

        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          brand: p.brand || "",
          category: p.category || "",
          countInStock: p.countInStock || "",
          images: p.images || [],
        });

        setImageInputs(p.images.map((_, idx) => idx));
        setLocalImages({});
      } catch (err) {
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      setLocalImages((prev) => ({ ...prev, [idx]: file }));
    }
  };

  const addImageInput = () => {
    setImageInputs((prev) => [...prev, prev.length]);
  };

  const removeImageInput = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
    setImageInputs((prev) => prev.filter((_, i) => i !== idx));
    setLocalImages((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  const uploadImages = async () => {
    const uploadedUrls = [...form.images];

    for (const [idxStr, file] of Object.entries(localImages)) {
      const idx = parseInt(idxStr);
      const formData = new FormData();
      formData.append("images", file);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_PRODUCT_API}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        uploadedUrls[idx] = res.data.imageUrls[0];
      } catch (err) {
        toast.error(`Image upload failed for input ${idx + 1}`);
        return null;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrls = await uploadImages();

      if (!imageUrls) {
        toast.warning("Image upload failed");
        return;
      }

      const payload = { ...form, images: imageUrls };

      await axios.put(`${import.meta.env.VITE_PRODUCT_API}/update/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product updated successfully");
      navigate("/admin");
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold border-l-8 border-amber-600 pl-2 mb-4 text-foreground">
        Edit Product
      </h1>

      {loading ? (
        <p>Loading product details...</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmOpen(true);
          }}
          className="grid grid-cols-2 gap-4 bg-card p-6 rounded-lg shadow-lg"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="col-span-2 p-2 rounded border"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="col-span-2 p-2 rounded border"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="p-2 rounded border"
          />
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="p-2 rounded border"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-2 rounded border col-span-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="countInStock"
            value={form.countInStock}
            onChange={handleChange}
            placeholder="Stock Count"
            className="col-span-2 p-2 rounded border"
          />

          <div className="col-span-2">
            <label className="font-medium">Product Images</label>
            {imageInputs.map((idx) => (
              <div key={idx} className="flex items-center gap-2 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, idx)}
                />
                {form.images[idx] && !localImages[idx] && (
                  <img
                    src={form.images[idx]}
                    alt={`img-${idx}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                {localImages[idx] && (
                  <img
                    src={URL.createObjectURL(localImages[idx])}
                    alt={`preview-${idx}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <button type="button" onClick={() => removeImageInput(idx)}>
                  <FiTrash2 className="text-red-600" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 flex items-center gap-2 text-blue-600"
              onClick={addImageInput}
            >
              <FiPlus /> Add Image
            </button>
          </div>

          <button
            type="submit"
            className="col-span-2 mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded"
          >
            Update Product
          </button>
        </form>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update the product with the new information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditProduct;
