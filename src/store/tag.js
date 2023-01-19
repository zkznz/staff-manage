
const state = {
    tagList: JSON.parse(localStorage.getItem("tagList")) || [
        {
            id: 0,
            name: '首页',
            path: '/home',
            code: 'home'
        }
    ]
};

const mutations = {
    ADD_TAG(state, menu) {
        if (state.tagList.findIndex(item => item.code == menu.code) == -1) {
            state.tagList.push(menu);
            localStorage.removeItem("tagList")
            localStorage.setItem("tagList", JSON.stringify(state.tagList))
        }
    },
    CLOSE_TAG(state, menu) {
        let res = state.tagList.findIndex(item => item.code == menu.code);
        state.tagList.splice(res, 1);
        localStorage.removeItem("tagList")
        localStorage.setItem("tagList", JSON.stringify(state.tagList))
    },
    CLEAR_TAG(state) {
        localStorage.removeItem("tagList")
        state.tagList = [{
            id: 0,
            name: '首页',
            path: '/home',
            code: 'home'
        }]
    }
}
export default {
    state, mutations
}