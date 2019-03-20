import request from '@/utils/request'

export function getAllStoreSettings(softDelete) {
  return request({
    url: '/api/store/getAllSettings?softDelete=' + softDelete,
    method: 'get'
  })
}

export function addStore(data) {
  return request({
    url: '/api/store/createStoreSettings',
    method: 'post',
    data
  })
}

export function UpdateSettings(data) {
  return request({
    url: '/api/store/updateStoreSettings',
    method: 'post',
    data
  })
}

export function changeSelectedSettings(data) {
  return request({
    url: '/api/store/changeStatusToActive',
    method: 'post',
    data
  })
}

export function deleteStoreSettings(softDelete, settingsId) {
  return request({
    url: `/api/store/changeSettingsDelete?softDelete=${softDelete}&settingsId=${settingsId}`,
    method: 'get'
  })
}

// export function updateProduct(data, url) {
//   return request({
//     url: '/api/products/updateProduct',
//     method: 'post',
//     data
//   });
// }

// export function searchProducts(data) {
//   return request({
//     url: '/api/products/dynamicSearch',
//     method: 'post',
//     data
//   });
// }
// export function changeProductStatus(data, status) {
//   return request({
//     url:
//       '/api/products/changeStatus?id=' +
//       data +
//       '&status=' +
//       status +
//       '&field=active',
//     method: 'get'
//   });
// }
