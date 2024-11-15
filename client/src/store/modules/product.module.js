import { apiADD, apiDELETE, apiEDIT, apiGET } from "@/api/instance";

const moduleProduct = {
  // Đây là nơi khởi tạo các state của post Module
  state: {
    data: [],
  },

  // Chứa các hàm đồng bộ để cập nhật lại state
  mutations: {
    getProduct(state, payload) {
      state.data = payload;
    },
    addProduct(state, payload) {
      state.data.push(payload);
    },
    deleteProduct(state, payload) {
      state.data.push(payload);
    },
    editProduct(state, payload) {
      state.data.push(payload);
    },
  },

  // Chứa các hàm bất đồng bộ: gọi API tương tác với dữ liệu
  actions: {
    async apiGetProduct({ commit }) {
      try {
        const data = await apiGET("products"); // Sử dụng await để đợi API trả về
        commit("getProduct", data);
      } catch (error) {
        console.log("Error fetching Product data:", error);
      }
    },
    async apiAddProduct({ commit }, payload) {
      try {
        await apiADD(payload, "products"); // Đợi API thêm mới hoàn thành
        await commit("addProduct", payload);
        commit("getProduct");
      } catch (error) {
        console.log("Error adding Product:", error);
      }
    },
    async apiDeleteProduct({ commit }, payload) {
      try {
        await apiDELETE(payload, "products"); // Đợi API thêm mới hoàn thành
        await commit("deleteProduct", payload);
        commit("getProduct");
      } catch (error) {
        console.log("Error adding Product:", error);
      }
    },
    async apiEditProduct({ commit }, payload) {
      try {
        await apiEDIT(payload, "products"); // Đợi API thêm mới hoàn thành
        await commit("editProduct", payload);
        commit("getProduct");
      } catch (error) {
        console.log("Error adding Product:", error);
      }
    },
  },
};

export default moduleProduct;
