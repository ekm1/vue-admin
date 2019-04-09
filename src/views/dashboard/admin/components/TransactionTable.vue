<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order ID" min-width="200">
      <template slot-scope="scope">#{{ scope.row._id }}</template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template
        slot-scope="scope"
      >{{ scope.row.totalPayment }}{{scope.row.currency | currencyFilter}}</template>
    </el-table-column>
    <el-table-column label="Status" width="102" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.orderStatus | statusFilter">{{ scope.row.orderStatus }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/transaction'
import { getAllOrders } from '@/api/orders'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        Shipped: 'success',
        Pending: 'info',
        Completed: '',
      }
      return statusMap[status]
    },
    currencyFilter(currency) {
      const currencyMap = {
        USD: '$',
        EUR: '€',
      }
      return currencyMap[currency]
    },

  },
  data() {
    return {
      list: null,
      getOrdersQuery: {
        page: 1,
        limit: 10,
        status: true,
        sortType: "desc"
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getAllOrders(this.getOrdersQuery).then(response => {
        this.list = response.data.results.docs
      })
    }
  }
}
</script>
