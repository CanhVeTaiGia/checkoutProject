import { apiADD, apiEDIT, apiGET } from "@/api/instance";

const moduleOrder = {
  // Đây là nơi khởi tạo các state của post Module
  state: {
    data: [],
  },

  // Chứa các hàm đồng bộ để cập nhật lại state
  mutations: {
    getOrder(state, payload) {
      state.data = payload;
    },
    addOrder(state, payload) {
      state.data.push(payload);
    },
    editOrder(state, payload) {
      state.data.push(payload);
    },
  },

  // Chứa các hàm bất đồng bộ: gọi API tương tác với dữ liệu
  actions: {
    async apiGetOrder({ commit }) {
      try {
        const data = await apiGET('orders'); // Sử dụng await để đợi API trả về
        commit("getOrder", data);
      } catch (error) {
        console.log("Error fetching Order data:", error);
      }
    },
    async apiAddOrder({ commit }, payload) {
      try {
        await apiADD(payload,'orders'); // Đợi API thêm mới hoàn thành
        await commit("addOrder", payload);
        commit('getOrder')
      } catch (error) {
        console.log("Error adding Order:", error);
      }
    },
    async apiEditOrder({ commit }, payload) {
      try {
        await apiEDIT(payload,'orders'); // Đợi API thêm mới hoàn thành
        await commit("editOrder", payload);
        commit('getOrder')
      } catch (error) {
        console.log("Error adding Order:", error);
      }
    },
  },
};

export default moduleOrder;