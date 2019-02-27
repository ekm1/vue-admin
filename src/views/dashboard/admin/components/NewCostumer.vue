<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Costumer ID" min-width="200">
      <template slot-scope="scope">{{ scope.row.order_no | orderNoFilter }}</template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template slot-scope="scope">€{{ scope.row.price | toThousandFilter }}</template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/transaction'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
