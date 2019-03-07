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
  return request({
    url: '/api/products/create',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/api/categories/update',
    method: 'post',
    data
  })
}
