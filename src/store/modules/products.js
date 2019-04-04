const products = {
  state: {
    productDetails: []
  },
  mutations: {
    CHANGE(state, productDetails) {
      state.productDetails = productDetails
    },
    INVOICE(state, orderDetails) {
      state.orderDetails = orderDetails
    }
  },
  actions: {}
}

export default products
