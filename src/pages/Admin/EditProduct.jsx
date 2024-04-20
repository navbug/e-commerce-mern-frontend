import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import axios from "axios";
import { toast } from "react-toastify";
import { getProductById, updateProduct } from "../../api";
import { FaUpload } from "react-icons/fa6";

const EditProduct = () => {
  const [image, setImage] = useState({ preview: "", data: "" });
  const [product, setProduct] = useState({});
  const [updatedProduct, setUpdatedProduct] = useState({});
  const { productId } = useParams();
  const navigate = useNavigate();

  const handleChange = (e, field) => {
    setUpdatedProduct({ ...updatedProduct, [field]: e.target.value });
  };

  const handleCheckboxChange = (e, field) => {
    setUpdatedProduct({ ...updatedProduct, [field]: e.target.checked });
  };

  const handleFileSelect = (event) => {
    event.preventDefault();
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setImage(img);
  };

  const handleFileUpload = async (e) => {
    let formData = new FormData();
    formData.append("file", image.data);

    const res = await axios.post(`${API_BASE_URL}/uploadFile`, formData);
    return res.data.fileName;
  };

  const addImage = async () => {
    const fileName = await handleFileUpload();
    const imageUrl = `${API_BASE_URL}/files/${fileName}`;

    return imageUrl;
  };

  const getProduct = async () => {
    try {
      const fetchedProduct = await getProductById(productId);
      
      setProduct(fetchedProduct);
      setUpdatedProduct(fetchedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error fetching product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await addImage();
      setUpdatedProduct((prevState) => ({ ...prevState, images: imageUrl }));
      await updateProduct(productId, { ...updatedProduct, images: imageUrl });

      setUpdatedProduct({});
      toast.success("Product updated successfully");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="w-full h-full bg-green-50 flex flex-col justify-center items-center">
      <div className="flex justify-center items-center">
        <div className="w-[70vw] flex justify-between items-center py-6">
          <h2 className="text-xl text-green-800 font-semibold">
            Update Product:{" "}
            <span className="text-red-600">{product.title}</span>
          </h2>
          <button
            onClick={handleUpdateProduct}
            className="flex w-[170px] justify-center items-center rounded-md bg-green-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-md hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 gap-2 duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
          >
            Update Product
          </button>
        </div>
      </div>

      {/* Product updatation form  */}
      <form className="mt-10 w-[800px] flex flex-col items-center text-green-700 font-semibold pb-6">
        <h1>Product Information</h1>
        <div class="mt-4 flex justify-start items-center gap-4">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            value={updatedProduct?.title}
            onChange={(e) => handleChange(e, "title")}
            className={`block w-[200px] md:w-[300px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6`}
          />
        </div>

        <div class="mt-4 flex justify-start items-center gap-4">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            name="category"
            value={updatedProduct?.category}
            onChange={(e) => handleChange(e, "category")}
            className={`block w-[200px] md:w-[300px]  rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6`}
          />
        </div>

        <div class="mt-4 flex justify-start items-center gap-4">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="price"
            value={updatedProduct?.price}
            onChange={(e) => handleChange(e, "price")}
            className={`block w-[130px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6`}
          />

          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            name="stock"
            value={updatedProduct?.stock}
            onChange={(e) => handleChange(e, "stock")}
            className={`block w-[130px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6`}
          />
        </div>

        <div class="mt-4 flex justify-start items-center gap-4">
          <label htmlFor="desc">Description:</label>
          <textarea
            name="desc"
            value={updatedProduct?.desc}
            onChange={(e) => handleChange(e, "desc")}
            rows={3}
            cols={30}
            className={`block w-[300px] rounded-md border-0 py-1.5 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6`}
          />
        </div>

        <div class="mt-4 flex justify-start items-center gap-4">
          <label htmlFor="fastDelivery">Fast Delivery:</label>
          <input
            type="checkbox"
            id="fastDelivery"
            name="fastDelivery"
            checked={updatedProduct?.fastDelivery}
            onChange={(e) => handleCheckboxChange(e, "fastDelivery")}
            className={`block w-6 h-6 rounded-md border-0 text-green-950 shadow-md ring-1 ring-inset ring-green-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bold-600 sm:text-md sm:leading-6`}
          />
        </div>

        <div class="mt-4 flex justify-start items-center gap-4">
          <div className="w-[250px] bg-green-100 backdrop-blur-md h-[150px] lg:h-[210px] 2xl:h-[220px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
            {!image.data ? (
              <label className="w-full cursor-pointer h-full">
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="flex items-center justify-center cursor-pointer flex-col gap-2">
                    <FaUpload className="text-2xl" />
                    <p className="text-lg text-txtLight">Product Image</p>
                  </div>
                </div>

                <input
                  type="file"
                  className="w-0 h-0"
                  accept=".jpeg,.jpg,.png,.webp,.svg"
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img
                  src={image.preview}
                  className="w-full h-full object-contain rounded-md"
                  loading="lazy"
                  alt="profile image"
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
