import axios from 'axios';

// Tạo instance axios với cấu hình sẵn
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

// Hàm GET để lấy dữ liệu từ API
export const apiGET = async (text) => {
  try {
    const res = await apiClient.get(text); 
    return res.data;
  } catch (error) {
    console.error("Lỗi Hàm GET API trong instance:", error);
  }
};

// Hàm POST để thêm dữ liệu vào API
export const apiADD = async (item,text) => {
  try {
    const res = await apiClient.post(text, item); 
    return res.data;
  } catch (error) {
    console.error("Lỗi Hàm GET API trong instance:", error);
  }
};

// Hàm DELETE để xóa dữ liệu vào API
export const apiDELETE = async (id,text) => {
  try {
    const res = await apiClient.delete(`/${text}/${id}`); 
    return res.data;
  } catch (error) {
    console.error("Lỗi Hàm DELETE API trong instance:", error);
  }
};

// export const apiEDIT = async (item,text) => {
//   try {
//     const res = await apiClient.put(`/${text}/${item.id}`, item); 
//     return res.data;
//   } catch (error) {
//     console.error("Lỗi Hàm PUT API trong instance:", error);
//   }
// }

export const apiEDIT = async (item,text) => {
  try {
    const res = await apiClient.put(`${text}/${item.id}`, item); 
    return res.data;
  } catch (error) {
    console.error("Lỗi Hàm PUT API trong instance:", error);
  }
}