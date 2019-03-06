import request from '@/utils/request'

export function searchByCategoryName(categoryName, page, limit, status) {
  return request({
    url:
      '/api/categories/getAllBySameCategory?name=' +
      categoryName +
      '&page=' +
      page +
      '&limit=' +
      limit +
      '&status=' +
      status,
    method: 'get'
  })
}

export function deleteSubCategory(subCategoryId, status) {
  return request({
    url:
      '/api/categories/changeSubcategoryStatus?id=' +
      subCategoryId +
      '&status=' +
      status,
    method: 'get'
  })
}

export function addCategory(data) {
  return request({
    url: '/api/categories/create',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/api/categories/update',
    method: 'post',
    data
  })
}
