<template>
  <div id="center" class="app-container">
    <el-row :gutter="10" type="flex">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header-text">Add Product</span>
            <div class="filter-container">
              <router-link :to="{ path: '/catalog/products' }">
                <el-button
                  class="filter-item"
                  style="float: right"
                  type="primary"
                  icon="el-icon-back"
                >
                  {{ $t("Back") }}
                </el-button>
              </router-link>
            </div>
          </div>
          <el-form
            ref="ProductsForm"
            :model="ProductsForm"
            label-width="120px"
            class="demo-dynamic"
          >
            <el-form-item prop="category" label="Product Name">
              <el-input v-model="ProductsForm.data.name" />
            </el-form-item>
            <el-form-item prop="description" label="Description">
              <el-input v-model="ProductsForm.data.description" type="textarea" rows="5" />
            </el-form-item>
            <el-form-item prop="price" label="Price">
              <el-input-number v-model="ProductsForm.data.price" :precision="2" :min="0" :step="1" />
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
                    v-for="(category, index) in listSubcategories"
                    :key="index"
                    :label="category.subcategory"
                    :value="category.subcategory"
                  />
                </el-select>
              </el-col>
              <el-col :span="11">
                <el-input v-model="ProductsForm.data.category" :disabled="true" />
              </el-col>
            </el-form-item>
            <el-form-item prop="subcategory" label="Stock">
              <el-input-number
                v-model="ProductsForm.data.stock_level"
                :step="1"
                :min="0"
                @change="stockChanger"
              />
            </el-form-item>

            <el-form-item>
              <el-container id="preview" class="images-thumbnail">
                <vue-select-image
                  ref="single-select-image"
                  :data-images="dataImages"
                  class="test"
                  @onselectimage="onSelectImage"
                />
              </el-container>
              <label for="file-input" class="custom-file-upload">
                <i class="el-icon-upload" /> Choose Files
              </label>
              <input
                id="file-input"
                type="file"
                multiple="multiple"
                accept="image/x-png, image/jpeg"
                @change="onFileChange"
              >
            </el-form-item>
            <el-form-item />
            <el-form-item
              v-for="(attribute, index) in attributesList"
              :key="attribute._id"
              :label="attribute.name "
              style="padding-left:15%"
            >
              <el-input
                v-if="attribute.fieldType === 'String'"
                v-model="ProductsForm.data.specificProperties[index].fieldValue"
                class="input-field"
              />
              <input
                v-if="attribute.fieldType === 'Boolean'"
                v-model="ProductsForm.data.specificProperties[index].fieldValue"
                type="checkbox"
                class="flipswitch"
              >

              <input
                v-if="attribute.fieldType === 'Number'"
                v-model="ProductsForm.data.specificProperties[index].fieldValue"
                type="number"
                class="input-number"
                min="0"
                step="1"
              >
              <el-select
                v-if="attribute.fieldType === 'List'"
                v-model="selectable"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Choose add your list"
                @change="makeSelectable(selectable,index)"
              >
                <el-option
                  v-for="item in selectableOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                :disabled="isDisabled"
                type="primary"
                @click="submitForm('ProductsForm')"
              >
                Submit
              </el-button>
              <el-button @click="resetForm('ProductsForm')">
                Reset
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSelectedSubcategory, addProduct, deleteImages } from '@/api/products'
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
        date: Date.now(),
        isBundle: false,
        data: {
          name: '',
          category: '',
          subcategory: '',
          description: '',
          images: [],
          thumbnail: '',
          price: 1,
          stock_level: 0,
          specificProperties: [],
          stock_status: false
        }
      },
      selectableOptions: [],
      selectable: '',
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

  computed: {
    isDisabled() {
      // evaluate whatever you need to determine disabled here...
      if (this.ProductsForm.data.images <= this.dataImages) {
        return true
      } else return false
    }
  },

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
      console.log(this.selectableOptions)

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
      this.submitUpload()
    },

    // Manipulate Stock Status via stock value
    stockChanger() {
      if (this.ProductsForm.data.stock_level === 0) {
        this.ProductsForm.data.stock_status = false
      } else {
        this.ProductsForm.data.stock_status = true
      }
    },
    makeSelectable(value, index) {
      this.ProductsForm.data.specificProperties[index].fieldValue = value
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
    submitUpload() {
      const files = [...this.filesToUpload]
      // Remove elements if they dont exist in dataImages
      var i = 0
      var entry1
      while (i < files.length) {
        entry1 = files[i]
        if (
          this.dataImages.some(function(entry2) {
            return entry1.name === entry2.alt
          })
        ) {
          // Found, progress to next
          ++i
        } else {
          // Not found, remove
          files.splice(i, 1)
        }
      }

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

          axios
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
      this.imageSelected = data
      this.dataImages.filter((selected, index) => {
        if (index === data.id) {
          this.selectedThumbnail = selected.id
        }
      })
    },

    // Submit Dialog form for Adding
    submitForm(ProductsForm) {
      this.$refs[ProductsForm].validate(valid => {
        if (valid) {
          this.ProductsForm.data.images.forEach((value, index) => {
            if (this.selectedThumbnail === index) {
              this.ProductsForm.data.thumbnail = value
            } else {
              this.ProductsForm.data.thumbnail = this.ProductsForm.data.images[0]
            }
          })

          this.$notify({
            title: 'success',
            message: 'Submit Successfully',
            type: 'success',
            duration: 2000
          })

          addProduct(this.ProductsForm).then(
            this.$router.push({ path: '/catalog/products' }),

            console.log(this.ProductsForm)
          )

          // that.submitUpload();
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      const uploadedImages = []
      this.ProductsForm.data.images.forEach(value => {
        const deleteImages = value.split('/')
        uploadedImages.push(deleteImages[7] + '/' + deleteImages[8].split('.')[0])
      })
      deleteImages(uploadedImages).then(response => {
        console.log(response.data)
      })
      Object.assign(this.$data, this.$options.data.call(this))
    },

    // get Subcategory Attributes
    getSubcategoryAttributes() {
      const obj = this.listSubcategories.filter(attributes => {
        return attributes.subcategory === this.ProductsForm.data.subcategory
      })
      this.attributesList = obj[0].attributes
      this.attributesList.forEach((obj, index) => {
        this.ProductsForm.data.specificProperties[index] = {
          name: obj.name,
          fieldType: obj.fieldType
        }
      })
    }
  }
}
</script>
<style scoped>
@import "./style.scss";

@media only screen and (min-width: 990px) {
  .box-card {
    position: relative;
    left: 50%;
  }
}
</style>
