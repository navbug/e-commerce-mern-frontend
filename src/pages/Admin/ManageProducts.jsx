import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { setProducts } from "../../redux/reducers/productsReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getAllProductsManage } from "../../api";
import { ClipLoader } from "react-spinners";

const ManageProducts = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(products);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = products?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleGetAllProducts = async () => {
    try {
      setLoading(true);
      const prods = await getAllProductsManage();
      dispatch(setProducts(prods.filteredProducts));
      setLoading(false);
    } catch (error) {
      console.log(`Error fetching products: ${error}`);
    }
  };

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const handleDeleteProduct = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      handleGetAllProducts();
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

  return (
    <div>
      <div className="main col-span-9 w-full flex-1">
        <div className="flex justify-between items-center p-3 max-w-[800px]">
          <h2 className="font-bold text-green-900">Manage products</h2>
          <button
            onClick={() => navigate(`/admin/addProduct`)}
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-1 px-2 rounded mr-2 flex w-[120px] justify-center items-center text-md  leading-6 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 gap-2 duration-150 transition-all hover:scale-[103%] active:scale-[97%]"
          >
            Add product
          </button>
        </div>
        {/* table  */}
        {loading ? (<div className="flex justify-center items-center">
            <span className="text-green-900 font-bold text-xl"><ClipLoader size={50}/></span>
          </div>) : (
          <div className="max-w-[800px]">
            <table className="min-w-[500px] w-full overflow-x-scroll divide-y divide-green-200 bg-green-200">
              {/* head */}
              <thead className="bg-green-300 text-green-800 font-bold">
                <tr className="pl-2">
                  <th>#</th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-green-800 tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-green-800 tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-green-800 tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold text-green-800 tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-green-50 divide-y divide-green-700">
                {/* rows */}
                {currentProducts?.map((product, index) => {
                  return (
                    <tr
                      onClick={() => navigate(`/products/${product._id}`)}
                      key={index}
                      className="cursor-pointer hover:bg-green-200 text-green-800 font-semibold"
                    >
                      <th>{indexOfFirstProduct + index + 1}</th>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12">
                            <img
                              className="w-full h-full rounded-full"
                              src={
                                product?.images
                                  ? product.images
                                  : "https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png"
                              }
                              alt="product image"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-green-900">
                              {product.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {`₹ ${product.price}`}
                      </td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex justify-start items-center gap-6">
                        <span onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/editProduct/${product._id}`);
                            }}>
                          <FaEdit
                            className="text-green-900"
                            size={26}
                          />
                        </span>
                        <span>
                          <MdDeleteForever
                            color="#ff0110"
                            size={30}
                            onClick={(e) => handleDeleteProduct(e, product._id)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 px-6 py-4">
              <button
                onClick={handlePreviousPage}
                className={`text-white font-bold py-2 px-4 rounded ${
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                } bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mr-2 flex w-[170px] justify-center items-center text-md  leading-6 shadow-md gap-2 duration-150 transition-all hover:scale-[103%] active:scale-[97%]`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                className={`text-white font-bold py-2 px-4 rounded ${
                  indexOfLastProduct >= products.length &&
                  "opacity-50 cursor-not-allowed"
                } bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mr-2 flex w-[170px] justify-center items-center text-md  leading-6 shadow-md gap-2  duration-150 transition-all hover:scale-[103%] active:scale-[97%]`}
                disabled={indexOfLastProduct >= products.length}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
