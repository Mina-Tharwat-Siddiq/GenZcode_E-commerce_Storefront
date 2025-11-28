import axios from "axios";

const API
 = axios.create({
  baseURL: "https://node-eco.vercel.app/",
  withCredentials: true, // دا عشان نبعت الريفريش توكن اللى فى الكوكيز مع الريكويست
});

// هنا بعمل انترسبت لاى ريكويست واضيف فيه التوكن تلقائى
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/*
هنا هعمل فلو للريفريش لما الريكويست يرجع 401
هعمل قائمة بالريكويستات الحالية عشان ارجعلها بعدين وانفذها
لو حصل رد 401 هعمل ريفريش للتوكن وارجع انفذ الريكويستات اللى فى القايمة اللى عملتها
*/
let refreshing = false;
let queue = [];

API.interceptors.response
  .use(
    (res) => res,
    async (err) => {
      const original = err.config;

      // لو 401 ومش عامل ريفرش قبل كدا
      if (err.response?.status === 401 && !original._retry) {
        if (refreshing) {
          return new Promise((resolve) => {
            queue.push((token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(API(original));
            });
          });
        }

        original._retry = true;
        refreshing = true;

        try {
          const res = await API.post("api/auth/refresh");
          const newToken = res.data.accessToken;
          localStorage.setItem("token", newToken);

          queue.forEach((cb) => cb(newToken));
          queue = [];
          refreshing = false;

          original.headers.Authorization = `Bearer ${newToken}`;
          return API(original);
        } catch (e) {
          refreshing = false;
          queue = [];
          localStorage.removeItem("token");
          return Promise.reject(e);
        }
      }

      return Promise.reject(err);
    }
  )
  // .use((config) => {
  //   const token = localStorage.getItem("token");
  //   if (token) config.headers.Authorization = `Bearer ${token}`;
  //   return config;
  // });

//   دى فانكشنز جاهزة لكل الايندبوينتس اللى معانا
// AUTH
export const registerUser = async (data) => {
  const res = await API.post("api/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await API.post("api/auth/login", data);
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await API.post("api/auth/forgot-password", data);
  return res.data;
};

export const resetPassword = async (token, data) => {
  const res = await API.post(`api/auth/reset-password/${token}`, data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await API.post("api/auth/refresh");
  return res.data;
};

export const getMyInfo = async () => {
  const res = await API.get("api/auth/me");
  return res.data;
};

export const getAllUsers = async () => {
  const res = await API.get("api/auth/users");
  return res.data;
};

// PRODUCTS
export const addProduct = async (data) => {
  const res = await API.post("api/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await API.put(`api/products/${id}`, data);
  return res.data;
};

export const getAllProducts = async () => {
  const res = await API.get("api/products");
  return res.data;
};

export const getMyProducts = async () => {
  const res = await API.get("api/products/me");
  return res.data;
};

export const getSingleProduct = async (id) => {
  const res = await API.get(`api/products/${id}`);
  return res.data;
};

// ORDERS
export const addOrder = async (data) => {
  const res = await API.post("api/orders", data);
  return res.data;
};

export const checkoutOrder = async (id, data) => {
  const res = await API.post(`api/orders/${id}/checkout`, data);
  return res.data;
};

export const updateOrder = async (id, data) => {
  const res = await API.put(`api/orders/${id}`, data);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await API.get("api/orders");
  return res.data;
};

export const getMyOrders = async () => {
  const res = await API.get("api/orders/me");
  return res.data;
};

export const getSingleOrder = async (id) => {
  const res = await API.get(`api/orders/${id}`);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await API.delete(`api/orders/${id}`);
  return res.data;
};

// REVIEWS
export const addReview = async (productId, data) => {
  const res = await API.post(`api/reviews/${productId}`, data);
  return res.data;
};

export const getReviewsForProduct = async (productId) => {
  const res = await API.get(`api/reviews/${productId}`);
  return res.data;
};

// EXPORT DEFAULT
export default API;
