<template>
  <div id="center" class="app-container">
    <el-row :gutter="10" type="flex">
      <el-col :xs="6" :sm="10" :md="12" :lg="12" :xl="12">
        <div class="filter-container">
          <router-link :to="{ path: '/catalog/products' }">
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-back"
            >{{ $t('Back') }}</el-button>
          </router-link>
        </div>

        <el-form ref="ProductsForm" :model="ProductsForm" label-width="120px" class="demo-dynamic">
          <el-form-item prop="category" label="Product Name">
            <el-input v-model="ProductsForm.data.name"/>
          </el-form-item>
          <el-form-item prop="description" label="Description">
            <el-input v-model="ProductsForm.data.description" type="textarea" rows="5"/>
          </el-form-item>
          <el-form-item prop="price" label="Price">
            <el-input-number v-model="ProductsForm.data.price" :precision="2" :min="0" :step="1"/>
          </el-form-item>
          <el-form-item prop="subcategory" label="Auction">
            <el-switch
              v-model="ProductsForm.isAuction"
              inactive-text="Inactive"
              active-text="Active"
            />
          </el-form-item>
          <el-form-item prop="subcategory" label="Subcategory">
            <el-col :span="11">
              <el-select
                v-model="ProductsForm.data.subcategory"
                :remote-method="searchSubcategory"
                filterable
                remote
                reserve-keyword
                placeholder="Please enter a Subcategory"
                @change="getCategory"
              >
                <el-option
                  v-for="(category,index) in listSubcategories"
                  :key="index"
                  :label="category.subcategory"
                  :value="category.subcategory"
                />
              </el-select>
            </el-col>
            <el-col :span="11">
              <el-input v-model="ProductsForm.data.category" :disabled="true"/>
            </el-col>
          </el-form-item>
          <el-form-item prop="subcategory" label="Stock">
            <el-input-number
              v-model="ProductsForm.data.stock"
              :step="1"
              :min="0"
              @change="stockChanger"
            />
          </el-form-item>

          <el-form-item>
            <div class="editor-container">
              <dropzone
                id="myVueDropzone"
                url="http://localhost:3000/api/images"
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
          <el-form-item>
            <input
              id="file-input"
              type="file"
              multiple="multiple"
              @change="filesToUploadEvent($event)"
            >
            <input type="button" value="Upload" @click="submitUpload">
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSelectedSubcategory } from '@/api/products'
import axios from 'axios'
import waves from '@/directive/waves' // Waves directive
import Dropzone from '@/components/Dropzone'

export default {
  name: 'Categories',
  components: { Dropzone },
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
        active: true,
        isAuction: false,
        data: {
          name: '',
          category: '',
          subcategory: '',
          description: '',
          price: 1,
          stock: 0,
          stockStatus: false
        },
        attributes: [
          {
            name: '',
            required: true
          }
        ]
      },
      filesToUpload: undefined,
      mediaLinks: [],
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
      list: null,
      listSubcategories: [],
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
      }
    }
  },
  created() {},

  methods: {
    // Get category based on Subcategory
    getCategory(value) {
      const obj = this.listSubcategories.filter(category => {
        return category.subcategory === value
      })

      this.ProductsForm.data.category = obj[0].category
    },
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    },
    stockChanger() {
      if (this.ProductsForm.data.stock === 0) {
        this.ProductsForm.data.stockStatus = false
      } else {
        this.ProductsForm.data.stockStatus = true
      }
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
    filesToUploadEvent(event) {
      this.filesToUpload = event.target.files
    },
    async submitUpload() {
      const files = this.filesToUpload

      Object.entries(files).forEach(element => {
        const data = new FormData()
        data.append('image', element[1])

        const config = {
          header: {
            'Content-Type': 'multipart/form-data'
          }
        }

        axios
          .post('http://localhost:3000/api/images', data, config)
          .then(response => {
            this.mediaLinks.push(response.data)
          })
          .catch(err => console.log(err))
      })
    },

    searchSubcategory(query) {
      if (query !== '' && query.length >= 3) {
        this.loading = true
        getSelectedSubcategory(query).then(response => {
          this.listSubcategories = response.data
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
    }
    // Handling update on edit
  }
}
</script>
<style scoped>
</style>
