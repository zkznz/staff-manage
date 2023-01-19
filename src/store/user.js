import router, { resetRouter } from "@/router";
import store from "./index";
const state = {

};
const actions = {
    loginOut() {
        localStorage.clear();
        store.commit("CLEAR_MENU");
        store.commit("CLEAR_TAG");
        resetRouter();
        router.push("/login");
    }
};
const mutations = {

};
export default {
    state, actions, mutations
}