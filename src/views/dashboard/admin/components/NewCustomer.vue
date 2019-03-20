<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Name" min-width="200">
      <template slot-scope="scope">{{ scope.row.name }} {{ scope.row.lastname }}</template>
    </el-table-column>
    <el-table-column label="Email" width="195" align="center">
      <template slot-scope="scope">{{ scope.row.email }}</template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getLatestUsers } from '@/api/users'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      limit: 10
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getLatestUsers(this.limit).then(response => {
        this.list = response.data
      })
    }
  }
}
</script>
