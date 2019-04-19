<template>
  <div id="center" class="app-container">
    <el-row :gutter="10">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span>Card name</span>
            <el-button style="float: right; padding: 3px 0" type="text">Create Account</el-button>
          </div>
        </el-card>
        <el-dialog title="Warning" :visible.sync="centerDialogVisible" width="30%" center>
          <span>It should be noted that the content will not be aligned in center by default</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">Confirm</el-button>
          </span>
        </el-dialog>
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span>Card name</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "Groups",
  data() {
    return {
      centerDialogVisible: false

    }
  },
  created() { },
  methods: {}

}
</script>
