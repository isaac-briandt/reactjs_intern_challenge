import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const getToken = async () => {
  const accessToken = localStorage.getItem("token");
  return accessToken;
};

const setAuthHeader = async () => {
  const token = await getToken();
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const get = async (url, params) => {
  await setAuthHeader();
  return axiosInstance.get(url, { params });
};

export const post = async (url, data) => {
  await setAuthHeader();
  return axiosInstance.post(url, data);
};

export const put = async (url, data) => {
  await setAuthHeader();
  return axiosInstance.put(url, data);
};

export const patch = async (url, data) => {
  await setAuthHeader();
  return axiosInstance.patch(url, data);
};

export const remove = async (url) => {
  await setAuthHeader();
  return axiosInstance.delete(url);
};

export default axiosInstance;
