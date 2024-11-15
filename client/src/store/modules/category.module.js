import { apiADD, apiDELETE, apiEDIT, apiGET } from "@/api/instance";

const moduleCategory = {
  // Đây là nơi khởi tạo các state của post Module
  state: {
    data: [],
  },

  // Chứa các hàm đồng bộ để cập nhật lại state
  mutations: {
    getCategory(state, payload) {
      state.data = payload;
    },
    addCategory(state, payload) {
      state.data.push(payload);
    },
    deleteCategory(state, payload) {
      state.data.push(payload);
    },
    editCategory(state, payload) {
      state.data.push(payload);
    },
  },

  // Chứa các hàm bất đồng bộ: gọi API tương tác với dữ liệu
  actions: {
    async apiGetCategory({ commit }) {
      try {
        const data = await apiGET('classify'); // Sử dụng await để đợi API trả về
        commit("getCategory", data);
      } catch (error) {
        console.log("Error fetching category data:", error);
      }
    },
    async apiAddCategory({ commit }, payload) {
      try {
        await apiADD(payload,'classify'); // Đợi API thêm mới hoàn thành
        await commit("addCategory", payload);
        commit('getCategory')
      } catch (error) {
        console.log("Error adding category:", error);
      }
    },
    async apiDeleteCategory({ commit }, payload) {
      try {
        await apiDELETE(payload,'classify'); // Đợi API thêm mới hoàn thành
        await commit("deleteCategory", payload);
        commit('getCategory')
      } catch (error) {
        console.log("Error adding category:", error);
      }
    },
    async apiEditCategory({ commit }, payload) {
      try {
        await apiEDIT(payload,'classify'); // Đợi API thêm mới hoàn thành
        await commit("editCategory", payload);
        commit('getCategory')
      } catch (error) {
        console.log("Error adding category:", error);
      }
    },
  },
};

export default moduleCategory;