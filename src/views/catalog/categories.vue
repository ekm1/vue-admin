<template>
  <div id="center" class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.category')"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        checked
        style="margin-left:15px;"
        @change="handleStatus()"
      >{{ $t('active') }}</el-checkbox>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;display:table-caption;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.category')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.subcategory')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subcategory }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.active }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{ $t('table.edit') }}</el-button>

          <el-button
            v-if="scope.row.active === true"
            size="mini"
            type="delete"
            @click="handleModifyStatus(scope.row,'deleted')"
          >{{ $t('table.delete') }}</el-button>

          <el-button
            v-if="scope.row.active ===false"
            size="mini"
            type="success"
            @click="handleModifyStatus(scope.row,'activate')"
          >Activate</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="dialog-size">
      <el-form
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item prop="category" label="Category">
          <el-input v-model="dynamicValidateForm.category"/>
        </el-form-item>
        <el-form-item prop="subcategory" label="Subcategory">
          <el-input v-model="dynamicValidateForm.subcategory"/>
        </el-form-item>

        <el-form-item
          v-for="(attribute, index) in dynamicValidateForm.attributes"
          :label="'Attribute '"
          :key="attribute.key"
          :prop="'attributes.' + index + '.name'"
          :rules="{
            required: true, message: 'attribute can not be null', trigger: 'blur'
          }"
          style="padding-left:15%"
        >
          <el-input v-model="attribute.name" class="input-field"/>
          <el-select v-model="attribute.fieldType" class="select-size" placeholder="Select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-checkbox
            :prop="'attributes.' + index + '.required'"
            v-model="attribute.required"
          >Required</el-checkbox>

          <el-button @click.prevent="removeattribute(attribute)">Delete</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">Submit</el-button>
          <el-button @click="addAttribute">Add new Attribute</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPvVisible"
      title="Update Category"
      class="dialog-size"
      @click="updateForm('dynamicValidateForm')"
    >
      <el-form
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item prop="category" label="Category">
          <el-input v-model="dynamicValidateForm.category"/>
        </el-form-item>
        <el-form-item prop="subcategory" label="Subcategory">
          <el-input v-model="dynamicValidateForm.subcategory"/>
        </el-form-item>

        <el-form-item
          v-for="(attribute, index) in dynamicValidateForm.attributes"
          :label="'Attribute '"
          :key="attribute.key"
          :prop="'attributes.' + index + '.name'"
          :rules="{
            required: true, message: 'attribute can not be null', trigger: 'blur'
          }"
          style="padding-left:15%"
        >
          <el-input v-model="attribute.name" class="input-field"/>
          <el-select v-model="attribute.fieldType" placeholder="Select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-checkbox
            :prop="'attributes.' + index + '.required'"
            v-model="attribute.required"
          >Required</el-checkbox>

          <el-button class="delete-btn" button @click.prevent="removeattribute(attribute)">Delete</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateForm('dynamicValidateForm')">Update</el-button>
          <el-button @click="addAttribute">Add new Attribute</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// TODO: Validation & on Enter Submit form.
import { fetchList, fetchPv, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import {
  searchByCategoryName,
  deleteSubCategory,
  addCategory,
  updateCategory
} from '@/api/categories'

export default {
  name: 'Categories',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return true
    }
  },
  data() {
    return {
      dynamicValidateForm: {
        attributes: [
          {
            name: '',
            required: true
          }
        ],
        category: '',
        active: true,
        subcategory: ''
      },
      options: [
        {
          value: 'String',
          label: 'String'
        },
        {
          value: 'Number',
          label: 'Number'
        },
        {
          value: 'Boolean',
          label: 'Boolean'
        }
      ],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        name: undefined,
        type: undefined,
        status: true
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        name: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create Category'
      },
      dialogPvVisible: false,
      pvData: [],
      showReviewer: false,

      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  // Get items on create
  created() {
    this.getList()
  },
  methods: {
    getList() {
      if (
        this.listQuery.name === undefined ||
        this.listQuery.name === '' ||
        this.listQuery.name === ' '
      ) {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.docs
          this.total = response.data.total
          this.listLoading = false
        })
      } else {
        this.getFilerResults()
      }
    },
    getFilerResults() {
      this.listLoading = true
      searchByCategoryName(
        this.listQuery.name,
        this.listQuery.page,
        this.listQuery.limit,
        this.listQuery.status
      ).then(results => {
        this.list = results.data.docs
        this.total = results.data.total
        this.listLoading = false
      })
    },
    // Searching in the table
    handleFilter() {
      if (
        this.listQuery.name === undefined ||
        this.listQuery.name === '' ||
        this.listQuery.name === ' '
      ) {
        this.listQuery.page = 1
        this.getList()
      } else {
        this.listQuery.page = 1
        this.getFilerResults()
      }
    },
    // Handle status change
    handleModifyStatus(row, status) {
      if (status === 'deleted') {
        deleteSubCategory(row._id, 'false').then(res => {
          if (res.status) {
            this.$message({
              message: 'success',
              type: 'success'
            })
            this.list = this.list.filter(el => {
              return el._id !== row._id
            })
            row.status = status
          }
        })
      } else if (status === 'activate') {
        deleteSubCategory(row._id, 'true').then(res => {
          if (res.status) {
            this.$notify({
              title: 'success',
              message: 'Successfully deleted Subcategory',
              type: 'success',
              duration: 2000
            })
            this.list = this.list.filter(el => {
              return el._id !== row._id
            })
            row.status = status
          }
        })
      }
    },

    // Sorting change
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },

    // Sorting by ID
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // Reset Modal-Form values
    resetTemp() {
      const reset = (this.temp = {
        attributes: [
          {
            name: '',
            required: true
          }
        ],
        category: '',
        active: true,
        subcategory: ''
      })
      return reset
    },
    // Handle create method
    handleCreate() {
      this.dynamicValidateForm = this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dynamicValidateForm'].clearValidate()
      })
    },

    // Add new attributes

    addAttribute() {
      this.dynamicValidateForm.attributes.push({
        required: true,
        name: ''
      })
    },

    // Submit Dialog form for Adding
    submitForm(dynamicValidateForm) {
      this.$refs[dynamicValidateForm].validate(valid => {
        if (valid) {
          addCategory(this.dynamicValidateForm)
            .then(this.getList())
            .catch(err => console.log(err))
          // this.resetForm('dynamicValidateForm')

          this.$notify({
            title: 'success',
            message: 'Successfully created new Category',
            type: 'success',
            duration: 2000
          })

          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // Edit Enitity
    updateForm(dynamicValidateForm) {
      this.$refs[dynamicValidateForm].validate(valid => {
        if (valid) {
          updateCategory(this.dynamicValidateForm)
            .then(console.log(this.dynamicValidateForm), this.getList())
            .catch(err => console.log(err))
          this.$notify({
            title: 'success',
            message: 'Successfully updated Category',
            type: 'success',
            duration: 2000
          })
          this.dialogPvVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // Reseting Dialog form
    resetForm(formName) {
      this.$refs[formName].resetFields()
      while (this.dynamicValidateForm.attributes.length > 0) {
        this.dynamicValidateForm.attributes.pop()
      }
    },
    // Remove attribute dinamically
    removeattribute(item) {
      var index = this.dynamicValidateForm.attributes.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.attributes.splice(index, 1)
      }
    },
    // Handling update on edit
    handleUpdate(row) {
      this.dynamicValidateForm = row
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogPvVisible = true
    },

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Category', 'Subcategory', 'ACTIVE']
        const filterVal = ['category', 'subcategory', 'active']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    handleStatus() {
      this.listQuery.status = !this.listQuery.status
      this.tableStatus = this.listQuery.status
      this.getList()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
<style scoped>
.app-container {
  padding-left: 25%;
}

.input-field {
  padding-bottom: 2%;
}
/*
.dialog-size {
  width: 50%;
  margin: 0 auto;
}
.select-size {
  width: 100%;
} */
</style>
