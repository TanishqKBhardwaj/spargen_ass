import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { FiTrash2, FiUpload, FiPlus } from "react-icons/fi";
import {useNavigate} from "react-router-dom"

const AddProduct = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate=useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageInputs, setImageInputs] = useState([0]);
  const [localImages, setLocalImages] = useState({});

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
    if(!token){
      toast.warning("Please login first");
     navigate('/');
    }
    setCategories([
      "Action Figures",
      "Board Games",
      "Puzzles",
      "Educational Toys",
      "Dolls",
      "Remote Control Toys",
      "Outdoor Games",
      "Digital"
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    setLocalImages((prev) => ({ ...prev, [index]: file }));
  };

  const addImageInput = () => {
    setImageInputs((prev) => [...prev, prev.length ? Math.max(...prev) + 1 : 0]);
  };

  const removeImageInput = (index) => {
    setImageInputs((prev) => prev.filter((id) => id !== index));
    setLocalImages((prev) => {
      const newImages = { ...prev };
      delete newImages[index];
      return newImages;
    });
  };

  const uploadImages = async () => {
    if (Object.keys(localImages).length === 0) {
      toast.error("Please select images before uploading");
      return;
    }

    const formData = new FormData();
    Object.values(localImages).forEach((file) => {
      formData.append("images", file);
    });

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_PRODUCT_API}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prevForm) => ({
        ...prevForm,
        images: [...prevForm.images, ...res.data.imageUrls],
      }));


      toast.success("Images uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.images.length === 0) {
      toast.error("Please upload images first");
      return;
    }

    try {
      setLoading(true);

      const res= await axios.post(`${import.meta.env.VITE_PRODUCT_API}/create`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
       if(res.data.success)
      toast.success("Product added successfully");

      setForm({
        name: "",
        description: "",
        price: "",
        brand: "",
        category: "",
        countInStock: "",
        images: [],
      });
      setImageInputs([]);
      setLocalImages({});
      navigate('/admin');
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold border-l-8 border-amber-600 pl-2 mb-4 text-foreground">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-card p-6 rounded-lg shadow-lg"
      >
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-foreground">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="p-2 border rounded bg-background text-foreground"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-foreground">Brand</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="p-2 border rounded bg-background text-foreground"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-foreground">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="p-2 border rounded bg-background text-foreground"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-foreground">Count In Stock</label>
          <input
            type="number"
            name="countInStock"
            value={form.countInStock}
            onChange={handleChange}
            className="p-2 border rounded bg-background text-foreground"
            min={0}
            required
          />
        </div>

        <div className="col-span-2 flex flex-col">
          <label className="text-sm font-semibold mb-1 text-foreground">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="p-2 border rounded bg-background text-foreground"
            rows={4}
            required
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-foreground">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-2 border rounded bg-background text-foreground"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex flex-col">
          <label className="text-sm font-semibold mb-1 text-foreground">Upload Images</label>
          {imageInputs.map((id) => (
            <div key={id} className="mb-2 flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, id)}
                className="p-2 border rounded bg-background text-foreground flex-grow"
              />
              <button
                type="button"
                onClick={() => removeImageInput(id)}
                title="Remove image input"
                className="text-red-500 hover:text-red-700 transition"
              >
                <FiTrash2 size={20} />
              </button>
              {localImages[id] && (
                <img
                  src={URL.createObjectURL(localImages[id])}
                  alt={`preview-${id}`}
                  className="h-20 rounded shadow"
                />
              )}
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={addImageInput}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition disabled:opacity-50"
            >
              <FiPlus /> Add Image
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={uploadImages}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition disabled:opacity-50"
            >
              <FiUpload /> {loading ? "Uploading" : "Upload Images"}
            </button>
          </div>
        </div>

        <div className="col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-400 hover:bg-green-700 text-black px-6 py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
