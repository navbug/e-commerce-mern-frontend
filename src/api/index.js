import axios from "axios";
import { API_BASE_URL } from "../../config";

const CONFIG_OBJ = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

console.log(typeof CONFIG_OBJ.headers.Authorization);
// User API requests

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllUsers`, CONFIG_OBJ);
    if (response.status === 200) {
      return response.data.users;
    } else {
      console.error(`Error fetching users: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getUser/${id}`);
    if (response.status === 200) {
      return response.data.user;
    } else {
      console.error(`Error fetching user: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching user: ${error}`);
  }
};

export const updateWishlist = async (productId, userId, notExist) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/updateWishlist/${userId}`,
      { productId: productId, notExist: notExist }
    );
    if (response.status === 200) {
      return response.data.wishlist;
    } else {
      console.error("Failed to update wishlist:", response.status);
      throw new Error("Failed to update wishlist");
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteUser/${id}`,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error(`Error removing user: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error removing user: ${error}`);
  }
};

//Products API requests

export const getAllProducts = async (
  sort,
  filters,
  searchKeyword,
  category,
  page
) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("sort", sort);

    if (category) {
      queryParams.append("category", category);
    }
    if (searchKeyword) {
      queryParams.append("search", searchKeyword);
    }

    if (filters.price) {
      queryParams.append("price[gte]", String(filters.price.min));
      queryParams.append("price[lte]", String(filters.price.max));
    }
    if (filters.rating) {
      queryParams.append("rating", filters.rating);
    }
    if (filters.fastDelivery !== undefined) {
      queryParams.append("fastDelivery", filters.fastDelivery);
    }
    if (filters.inStock !== undefined) {
      queryParams.append("inStock", filters.inStock);
    }

    if (page) {
      queryParams.append("page", page);
      queryParams.append("limit", 6);
    }

    const response = await axios.get(
      `${API_BASE_URL}/products?${queryParams.toString()}`
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error fetching products: ${response.status}`);
      throw new Error("Error fetching products");
    }
  } catch (error) {
    console.error("Error occurred while getting all products", error);
    throw error;
  }
};

export const getAllProductsManage = async () => { //Admin
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error fetching products: ${response.status}`);
      throw new Error("Error fetching products");
    }
  } catch (error) {
    console.error("Error occurred while getting all products", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch product:", response.status);
      throw new Error("Failed to fetch product");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const addProduct = async (newProduct) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/addProduct`,
      newProduct,
      CONFIG_OBJ
    );
    if (response.status === 201) {
      return true;
    } else {
      console.error("Failed to add product:", response.status);
      throw new Error("Failed to add product");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedProduct) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updateProduct/${productId}`,
      updatedProduct,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error("Failed to update product:", response.status);
      throw new Error("Failed to update product");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteProduct/${id}`,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error("Error removing product:", response.status);
      throw new Error("Error removing product");
    }
  } catch (error) {
    console.error("Error occurred while deleting product", error);
    throw error;
  }
};

export const updateProductStock = async (productId, newStock) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/updateProductStock/${productId}`,
      { stock: newStock },
      CONFIG_OBJ
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error("Failed to process order:", response.status);
      throw new Error("Failed to process order");
    }
  } catch (error) {
    console.error("Error processing order:", error);
    throw error;
  }
};

export const addProductReview = async (productId, review) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/addReview/${productId}`,
      review
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error("Failed to add review:", response.status);
      throw new Error("Failed to add review");
    }
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const newOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/newOrder`, orderData);
    if (response.status === 201) {
      return true;
    } else {
      console.error("Failed to add order:", response.status);
      throw new Error("Failed to add order");
    }
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getAllOrders`,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch orders:", response.status);
      throw new Error("Failed to fetch orders");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getOrder/${orderId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch order:", response.status);
      throw new Error("Failed to fetch order");
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const processOrder = async (orderId, newStatus) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/processOrder/${orderId}`,
      { status: newStatus },
      CONFIG_OBJ
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error("Failed to process order:", response.status);
      throw new Error("Failed to process order");
    }
  } catch (error) {
    console.error("Error processing order:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteOrder/${orderId}`,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error("Failed to delete order:", response.status);
      throw new Error("Failed to delete order");
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
