<template>
  <div id="center" class="app-container">
    <el-row :gutter="10" type="flex">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ ProductsForm.data.name }}</span>
            <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Images</span>
            <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
          </div>
          <div class="bikini-grid1">
            <div class="bikini-img-container">
              <img
                id="bikini-display1"
                src="https://c1.staticflickr.com/1/823/27245062607_5f7ee01e31_b.jpg"
              >
              <img
                id="bikini-display2"
                src="https://c1.staticflickr.com/1/969/41214562765_aa18316183_b.jpg"
              >
              <img
                id="bikini-display3"
                src="https://c1.staticflickr.com/1/980/28242872048_1e6d11b6e9_b.jpg"
              >
              <img
                id="bikini-display4"
                src="https://c1.staticflickr.com/1/951/28242872018_542c529d4d_b.jpg"
              >
            </div>

            <div class="bikini-thumbnail">
              <img
                id="clickMe1"
                class="bikini-thumbnails"
                src="https://c1.staticflickr.com/1/823/27245062607_5f7ee01e31_b.jpg"
              >
              <img
                id="clickMe2"
                class="bikini-thumbnails"
                src="https://c1.staticflickr.com/1/969/41214562765_aa18316183_b.jpg"
              >
              <img
                id="clickMe3"
                class="bikini-thumbnails"
                src="https://c1.staticflickr.com/1/980/28242872048_1e6d11b6e9_b.jpg"
              >
              <img
                id="clickMe4"
                class="bikini-thumbnails"
                src="https://c1.staticflickr.com/1/951/28242872018_542c529d4d_b.jpg"
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSelectedSubcategory, updateProduct } from '@/api/products'
import axios from 'axios'
import store from '../../store'
import VueSelectImage from '@/components/vue-select-image'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'EditProduct',
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
          name: undefined,
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
      temp: [],
      // Images Delcaration
      dataImages: [],
      url: [],
      values: [],
      images: [],
      filesToUpload: [],
      mediaLinks: [],
      arrayOfURL: [],
      productUrl: this.$route.params.id,
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
      urlObject: {}
    }
  },
  watch: {
    dataImages: function() {
      var i = 0
      var entry1
      while (i < this.ProductsForm.data.images.length) {
        entry1 = this.ProductsForm.data.images[i]
        if (
          this.dataImages.some(function(entry2) {
            return entry1 === entry2.src
          })
        ) {
          // Found, progress to next
          ++i
        } else {
          // Not found, remove
          this.ProductsForm.data.images.splice(i, 1)
        }
      }
    }
  },
  created() {
    if (store.state.products.productDetails.length <= 0) {
      this.$router.push({ path: '/catalog/products' })
    } else {
      this.ProductsForm = store.state.products.productDetails
      this.attributesList = this.ProductsForm.data.specificProperties

      this.ProductsForm.data.images.forEach((image, index) => {
        this.dataImages[index] = { id: index, src: image }
        // if (this.ProductsForm.data.thumbnail === image) {
        //   this.onSelectImage(this.dataImages[index]);
        // }
      })
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

      this.images.forEach((value, index) => {
        if (this.ProductsForm.data.images.length >= 0) {
          this.dataImages.push({
            id: index,
            src: value.value,
            alt: value.name
          })
        } else {
          this.dataImages.push({
            id: this.ProductsForm.data.images.length + 1,
            src: value.value,
            alt: value.name
          })
        }
      })
    },

    // Manipulate Stock Status via stock value
    stockChanger() {
      if (this.ProductsForm.data.stock_level === 0) {
        this.ProductsForm.data.stock_status = false
      } else {
        this.ProductsForm.data.stock_status = true
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
      this.ProductsForm.data.specificProperties.forEach((value, index) => {
        if (value.fieldType === 'Number') {
          this.ProductsForm.data.specificProperties[
            index
          ].fieldValue = parseInt(value.fieldValue)
        }
      })

      const files = [...this.filesToUpload]

      // Remove elements if they dont exist in dataImages
      let dataLinks
      if (!files) {
        this.$notify.error({
          title: 'Error',
          message: 'Upload Failed',
          duration: 2000
        })
      } else {
        if (files.length >= 0) {
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
        }
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

              this.mediaLinks.forEach(image => {
                this.ProductsForm.data.images.push(image)
              })
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
    // Search Subcategory
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
    // Event for image selection
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
          const images = [...new Set(this.ProductsForm.data.images)]
          this.ProductsForm.data.images = images

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

          updateProduct(this.ProductsForm, this.productUrl).then(
            response => {}
          )

          // that.submitUpload();
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
      this.ProductsForm.data.specificProperties = []

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
</style>
