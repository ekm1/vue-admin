import request from '@/utils/request'

// Function to get all Products
export function getAllProducts(query) {
  return request({
    url: '/api/products/getProducts',
    method: 'get',
    params: query
  })
}
// Function to select Subcategories based on Name
export function getSelectedSubcategory(query) {
  return request({
    url: '/api/categories/getSubcategory?subcategory=' + query,
    method: 'get'
  })
}

export function searchByProductName(categoryName, page, limit) {
  return request({
    url:
      '/api/categories/getAllBySameCategory?name=' +
      categoryName +
      '&page=' +
      page +
      '&limit=' +
      limit,
    method: 'get'
  })
}

export function deleteProduct(subCategoryId, status) {
  return request({
    url:
      '/api/categories/changeSubcategoryStatus?id=' +
      subCategoryId +
      '&status=' +
      status,
    method: 'get'
  })
}

export function addProduct(data) {
  console.log('dataaaaaaa')
  console.log(data)
  return request({
    url: '/api/products/create',
    method: 'post',
    data
  })
}

export function updateProduct(data, url) {
  return request({
    url: '/api/products/updateProduct',
    method: 'post',
    data
  })
}

export function searchProducts(data) {
  return request({
    url: '/api/products/dynamicSearch',
    method: 'post',
    data
  })
}
export function changeProductStatus(data, status) {
  return request({
    url:
      '/api/products/changeStatus?id=' +
      data +
      '&status=' +
      status +
      '&field=active',
    method: 'get'
  })
}
