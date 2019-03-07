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
            <el-container id="preview" class="images-thumbnail">
              <!-- <div v-for="image in url">
                <img v-if="image" :src="image" class="upload-image">
              </div>-->
              <vue-select-image
                ref="single-select-image"
                :data-images="dataImages"
                class="test"
                @onselectimage="onSelectImage"
              />
            </el-container>
            <label for="file-input" class="custom-file-upload">
              <i class="el-icon-upload"/> Choose Files
            </label>
            <input
              id="file-input"
              type="file"
              multiple="multiple"
              accept="image/x-png, image/jpeg"
              @change="onFileChange"
            >
            <el-button type="button" @click="submitUpload">Upload</el-button>
          </el-form-item>
          <el-form-item/>

          <el-form-item
            v-for="(attribute, index) in attributesList"
            :label="'Attribute '"
            :key="attribute.key"
            :prop="'attributes.' + index + '.name'"
            :rules="{
              required: true, message: 'attribute can not be null', trigger: 'blur'
            }"
            style="padding-left:15%"
          >
            <el-input
              v-if="attribute.fieldType === 'String'"
              v-model="attribute.name"
              class="input-field"
            />
            <el-switch
              v-if="attribute.fieldType === 'Boolean'"
              v-model="attribute.name"
              active-text="True"
              inactive-text="False"
            />
            <el-input-number
              v-if="attribute.fieldType === 'Number'"
              v-model="attribute.fieldType"
              :step="1"
              :min="0"
              @change="stockChanger"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ProductsForm')">Submit</el-button>
            <el-button @click="addAttribute">Add new Attribute</el-button>
            <el-button @click="resetForm('ProductsForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSelectedSubcategory, addProduct } from '@/api/products'
import axios from 'axios'
import VueSelectImage from '@/components/vue-select-image'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'AddProduct',
  components: { VueSelectImage },
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
      // Form Declaration
      ProductsForm: {
        active: true,
        isAuction: false,
        data: {
          name: '',
          category: '',
          subcategory: '',
          description: '',
          images: [],
          thumbnail: '',
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
      // Images Delcaration
      dataImages: [],
      url: [],
      values: [],
      images: [],
      filesToUpload: undefined,
      mediaLinks: [],
      arrayOfURL: [],
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
      attributesList: [],
      listSubcategories: [],
      selectedThumbnail: undefined,
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
      urlObject: {}
    }
  },
  created() {},

  methods: {
    // Get category based on Subcategory
    getCategory(value) {
      const obj = this.listSubcategories.filter(category => {
        return category.subcategory === value
      })
      this.getSubcategoryAttributes()

      this.ProductsForm.data.category = obj[0].category
    },
    // Show images thumbnails and remove duplicates
    onFileChange(e) {
      this.filesToUpload = e.target.files
      const file = e.target.files

      Object.entries(file).forEach(entry => {
        // get the name of the file, will be used as a key
        const ent = entry[1].name

        // push to an object all the data
        this.urlObject[ent] = URL.createObjectURL(entry[1])
      })

      this.url = new Set()

      Object.entries(this.urlObject).forEach((el, index) => {
        this.url.add({ id: index, value: el[1], name: el[0] })
      })

      this.images = [...this.url]

      this.images.forEach(value => {
        this.dataImages.push({
          id: value.id,
          src: value.value,
          alt: value.name
        })
      })

      this.dataImages = this.dataImages.filter(
        (thing, index, self) =>
          index === self.findIndex(t => t.alt === thing.alt)
      )
    },

    // Manipulate Stock Status via stock value
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
    async submitUpload() {
      const files = this.filesToUpload
      let dataLinks
      if (!files) {
        this.$notify.error({
          title: 'Error',
          message: 'Upload Failed',
          duration: 2000
        })
      } else {
        Object.entries(files).forEach(element => {
          const data = new FormData()
          data.append('image', element[1])

          const config = {
            header: {
              'Content-Type': 'multipart/form-data'
            }
          }

          dataLinks = axios
            .post('http://localhost:3000/api/images', data, config)
            .then(response => {
              this.mediaLinks.push(response.data)

              this.ProductsForm.data.images = this.mediaLinks
              this.$notify({
                title: 'success',
                message: 'Uploaded Successfully',
                type: 'success',
                duration: 2000
              })

              return this.mediaLinks
            })
            .catch(err => console.log(err))
        })
        return dataLinks
      }
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
    onSelectImage: function(data) {
      console.log('fire event onSelectImage: ', data)
      this.imageSelected = data
      this.dataImages.filter((selected, index) => {
        if (index === data.id) {
          this.selectedThumbnail = selected.id
        }
      })
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
      const that = this
      this.$refs[ProductsForm].validate(async valid => {
        if (valid) {
          const imagesLinks = await this.submitUpload()

          this.ProductsForm.data.thumbnail =
            imagesLinks[that.selectedThumbnail]

          await this.$notify({
            title: 'success',
            message: 'Submit Successfully',
            type: 'success',
            duration: 2000
          })

          addProduct(this.ProductsForm).then(
            // this.$router.push("/catalog/products"),
            console.log(this.ProductsForm)
          )

          // that.submitUpload();

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

    // get Subcategory Attributes
    getSubcategoryAttributes() {
      const obj = this.listSubcategories.filter(attributes => {
        return attributes.subcategory === this.ProductsForm.data.subcategory
      })
      this.attributesList = obj[0].attributes
    }
  }
}
</script>
<style scoped>
input[type="file"] {
  display: none;
}

.upload-image {
  width: 50%;
  height: 50%;
}
.test {
  display: contents;
}
</style>
