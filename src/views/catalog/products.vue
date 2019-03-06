<template>
  <div id="center" class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.category')"
        v-model="getProductsQuery.name"
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
      <router-link :to="{ path: 'products/new' }">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
        >{{ $t('table.add') }}</el-button>
      </router-link>
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
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('Name')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.data.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Description')" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.data.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Price')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.data.price }}$</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Auction')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isAuction }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Category')" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.data.category }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Type')" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.data.productType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Stock')" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.data.stock_level }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Stock Status')" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.data.stock_status }}</span>
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
      :page.sync="getProductsQuery.page"
      :limit.sync="getProductsQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="dialog-size">
      <el-form ref="ProductsForm" :model="ProductsForm" label-width="120px" class="demo-dynamic">
        <el-form-item prop="category" label="Product Name">
          <el-input v-model="ProductsForm.category"/>
        </el-form-item>
        <el-form-item prop="description" label="Description">
          <el-input v-model="ProductsForm.subcategory" type="textarea"/>
        </el-form-item>
        <el-form-item prop="subcategory" label="Price">
          <el-input-number v-model="ProductsForm.price" :precision="2" :step="1"/>
        </el-form-item>

        <el-form-item prop="subcategory" label="Subcategory">
          <el-select
            v-model="ProductsForm.searchValue"
            :remote-method="searchSubcategory"
            filterable
            remote
            reserve-keyword
            placeholder="Please enter a Subcategory"
          >
            <el-option
              v-for="(category,index) in listSubcategories"
              :key="index"
              :label="category.subcategory"
              :value="category.subcategory"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <div class="editor-container">
            <dropzone
              id="myVueDropzone"
              url="https://httpbin.org/post"
              @dropzone-removedFile="dropzoneR"
              @dropzone-success="dropzoneS"
            />
          </div>
        </el-form-item>
        <el-form-item/>

        <el-form-item
          v-for="(attribute, index) in ProductsForm.attributes"
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
          <el-button type="primary" @click="submitForm('ProductsForm')">Submit</el-button>
          <el-button @click="addAttribute">Add new Attribute</el-button>
          <el-button @click="resetForm('ProductsForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPvVisible"
      title="Update Category"
      class="dialog-size"
      @click="updateForm('ProductsForm')"
    >
      <el-form ref="ProductsForm" :model="ProductsForm" label-width="120px" class="demo-dynamic">
        <el-form-item prop="category" label="Category">
          <el-input v-model="ProductsForm.category"/>
        </el-form-item>
        <el-form-item prop="subcategory" label="Subcategory">
          <el-input v-model="ProductsForm.subcategory"/>
        </el-form-item>

        <el-form-item
          v-for="(attribute, index) in ProductsForm.attributes"
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
            <el-option v-for="(item, index) in list" :key="index" :label="item" :value="item"/>
          </el-select>
          <el-checkbox
            :prop="'attributes.' + index + '.required'"
            v-model="attribute.required"
          >Required</el-checkbox>

          <el-button class="delete-btn" button @click.prevent="removeattribute(attribute)">Delete</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateForm('ProductsForm')">Update</el-button>
          <el-button @click="addAttribute">Add new Attribute</el-button>
          <el-button @click="resetForm('ProductsForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAllProducts, getSelectedSubcategory } from '@/api/products'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Dropzone from '@/components/Dropzone'

export default {
  name: 'Categories',
  components: { Pagination, Dropzone },
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
      ProductsForm: {
        price: 1,
        attributes: [
          {
            name: '',
            required: true
          }
        ],
        category: '',
        active: true,
        subcategory: '',
        searchValue: ''
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
      listSubcategories: [],
      total: 0,
      listLoading: true,
      getSubcategoriesQuery: {
        page: 1,
        limit: 999,
        status: true
      },
      getProductsQuery: {
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
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      tableStatus: true,
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
        create: 'Add Product'
      },
      dialogPvVisible: false,
      pvData: [],
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
  created() {
    this.getList()
  },
  methods: {
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    },
    getList() {
      if (
        this.getProductsQuery.name === undefined ||
        this.getProductsQuery.name === '' ||
        this.getProductsQuery.name === ' '
      ) {
        this.listLoading = true
        getAllProducts(this.getProductsQuery).then(response => {
          this.list = response.data.docs
          this.total = response.data.total
          this.listLoading = false
        })
      } else {
        this.getFilerResults()
      }
    },
    // getFilerResults() {
    //   this.listLoading = true
    //   searchByCategoryName(
    //     this.getProductsQuery.name,
    //     this.getProductsQuery.page,
    //     this.getProductsQuery.limit
    //   ).then(results => {
    //     this.list = results.data.docs
    //     this.total = results.data.total
    //     this.listLoading = false
    //   })
    // },
    // Searching in the table
    handleFilter() {
      if (
        this.getProductsQuery.name === undefined ||
        this.getProductsQuery.name === '' ||
        this.getProductsQuery.name === ' '
      ) {
        this.getProductsQuery.page = 1
        this.getList()
      } else {
        this.getProductsQuery.page = 1
        this.getFilerResults()
      }
    },
    // handleModifyStatus(row, status) {
    //   if (status === 'deleted') {
    //     deleteSubCategory(row._id, 'false').then(res => {
    //       if (res.status) {
    //         this.$message({
    //           message: 'success',
    //           type: 'success'
    //         })
    //         this.list = this.list.filter(el => {
    //           return el._id !== row._id
    //         })
    //         row.status = status
    //       }
    //     })
    //   } else if (status === 'activate') {
    //     deleteSubCategory(row._id, 'true').then(res => {
    //       if (res.status) {
    //         this.$notify({
    //           title: 'success',
    //           message: 'Successfully deleted Subcategory',
    //           type: 'success',
    //           duration: 2000
    //         })
    //         this.list = this.list.filter(el => {
    //           return el._id !== row._id
    //         })
    //         row.status = status
    //       }
    //     })
    //   }
    // },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.getProductsQuery.sort = '+id'
      } else {
        this.getProductsQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // Reset Modal form fields
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
        subcategory: '',
        price: 1
      })
      return reset
    },

    // Handle Creating new Product
    handleCreate() {
      this.ProductsForm = this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ProductsForm'].clearValidate()
      })
    },

    searchSubcategory(query) {
      if (query !== '' && query.length >= 3) {
        this.loading = true
        console.log(query)
        getSelectedSubcategory(query).then(response => {
          this.listSubcategories = response.data
          console.log(response.data)
        })
      } else {
        this.listSubcategories = []
      }
    },

    // Add new attributes
    addAttribute() {
      this.ProductsForm.attributes.push({
        required: true,
        name: ''
      })
    },
    // Submit Dialog form for Adding
    submitForm(ProductsForm) {
      this.$refs[ProductsForm].validate(valid => {
        if (valid) {
          console.log(this.ProductsForm)

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
    // updateForm(ProductsForm) {
    //   this.$refs[ProductsForm].validate(valid => {
    //     if (valid) {
    //       updateCategory(this.ProductsForm)
    //         .then(console.log(this.ProductsForm), this.getList())
    //         .catch(err => console.log(err))
    //       this.$notify({
    //         title: 'success',
    //         message: 'Successfully updated Category',
    //         type: 'success',
    //         duration: 2000
    //       })
    //       this.dialogPvVisible = false
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
    // Reseting Dialog form
    resetForm(formName) {
      this.$refs[formName].resetFields()
      while (this.ProductsForm.attributes.length > 0) {
        this.ProductsForm.attributes.pop()
      }
    },
    // Remove attribute dinamically
    removeattribute(item) {
      var index = this.ProductsForm.attributes.indexOf(item)
      if (index !== -1) {
        this.ProductsForm.attributes.splice(index, 1)
      }
    },
    // Handling update on edit
    handleUpdate(row) {
      this.ProductsForm = row
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogPvVisible = true
    },

    // updateData() {
    //   this.$refs['dataForm'].validate(valid => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp)
    //       tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
    //       updateArticle(tempData).then(() => {
    //         for (const v of this.list) {
    //           if (v.id === this.temp.id) {
    //             const index = this.list.indexOf(v)
    //             this.list.splice(index, 1, this.temp)
    //             break;
    //           }
    //         }
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: '成功',
    //           message: '更新成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },

    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
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
      this.getProductsQuery.status = !this.getProductsQuery.status
      this.tableStatus = this.getProductsQuery.status
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
.input-field {
  padding-bottom: 2%;
}
.filter-container {
  padding-left: 25%;
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
