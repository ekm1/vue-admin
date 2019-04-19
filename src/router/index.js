import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/sales',
    component: Layout,
    redirect: '/sales/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'Sales',
      icon: 'dollar',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'orders',
        component: () => import('@/views/sales/orders'),
        name: 'Orders',
        meta: {
          title: 'Orders',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'invoices/:id',
        component: () => import('@/views/sales/invoices'),
        name: 'Personal Invoice',
        hidden: true,

        meta: {
          title: 'Personal Invoice'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'transactions',
        component: () => import('@/views/sales/transactions'),
        name: 'Transactions',
        meta: {
          title: 'Transactions'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  {
    path: '/catalog',
    component: Layout,
    redirect: '/sales/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'Catalog',
      icon: 'package',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'categories',
        component: () => import('@/views/catalog/categories'),
        name: 'Categories',
        meta: {
          title: 'Categories'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'products',
        component: () => import('@/views/catalog/products'),
        name: 'Products',
        meta: {
          title: 'Products',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'bundles',
        component: () => import('@/views/catalog/bundles'),
        name: 'Bundles',
        meta: {
          title: 'Bundles',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'products/new',
        component: () => import('@/views/catalog/addproduct'),
        name: 'Add new Product',
        meta: {
          title: 'Add new Product',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'products/edit/:id',
        component: () => import('@/views/catalog/editproduct'),
        name: 'Edit Product',
        hidden: true,
        meta: {
          title: 'Edit Product',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'products/details/:id',
        component: () => import('@/views/catalog/productdetails'),
        name: 'Product Details',
        hidden: true,
        meta: {
          title: 'Product Details',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/promotions',
    component: Layout,
    redirect: '/promo/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'Promotions',
      icon: 'promo',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'coupons',
        component: () => import('@/views/promotions/coupons'),
        name: 'Coupons',
        meta: {
          title: 'Coupons'
        }
      }
    ]
  },
  {
    path: '/Customers',
    component: Layout,
    redirect: '/sales/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'Customers',
      icon: 'user',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/customers/users'),
        name: 'All Customers',
        meta: {
          title: 'All Customers'
        }
      },
      {
        path: 'users/groups',
        component: () => import('@/views/customers/groups'),
        name: 'Customers Group',
        meta: {
          title: 'Customers Group'
        }
      }
    ]
  },
  {
    path: '/reports',
    component: Layout,
    redirect: '/promo/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'Reports',
      icon: 'report',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'orders',
        component: () => import('@/views/reports/orders'),
        name: 'Orders',
        meta: {
          title: 'Orders'
        }
      },
      {
        path: 'products',
        component: () => import('@/views/reports/products'),
        name: 'Products',
        meta: {
          title: 'Products'
        }
      },
      {
        path: 'categories',
        component: () => import('@/views/reports/categories'),
        name: 'Categories',
        meta: {
          title: 'Categories'
        }
      },
      {
        path: 'users',
        component: () => import('@/views/reports/users'),
        name: 'Users',
        meta: {
          title: 'Users'
        }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings',
    children: [
      {
        path: '',
        component: () => import('@/views/settings/index'),
        name: 'Settings',

        meta: { title: 'Settings', icon: 'settings', affix: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },

  /** When your routing table is too long, you can split it into small modules**/

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
