<template>
  <div id="center" class="app-container">
    <el-row :gutter="10" type="flex">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header-text">Edit {{ ProductsForm.data.name }}</span>
            <div class="filter-container">
              <router-link :to="{ path: '/catalog/products' }">
                <el-button
                  class="filter-item"
                  style="float: right"
                  type="primary"
                  icon="el-icon-back"
                >{{ $t("Back") }}</el-button>
              </router-link>
            </div>
          </div>

          <el-form
            ref="ProductsForm"
            :model="ProductsForm"
            label-width="120px"
            class="demo-dynamic"
          >
            <el-form-item label="Product Name" required>
              <el-input v-validate="'required'" name="name" v-model="ProductsForm.data.name"/>
              <el-alert
                v-if="errors.first('name')"
                :title="errors.first('name')"
                type="error"
                show-icon
                :closable="false"
              ></el-alert>
            </el-form-item>
            <el-form-item label="Description" required>
              <el-input
                v-model="ProductsForm.data.description"
                name="description"
                v-validate="'required|min:10'"
                type="textarea"
                rows="5"
              />
              <el-alert
                v-if="errors.first('description')"
                :title="errors.first('description')"
                type="error"
                show-icon
                :closable="false"
              ></el-alert>
            </el-form-item>
            <el-form-item label="Price" required>
              <el-input-number
                v-validate="'required|min_value:0'"
                v-model="ProductsForm.data.price"
                :precision="2"
                name="price"
                :min="0"
                :step="1"
              />
              <el-alert
                v-if="errors.first('price')"
                :title="errors.first('price')"
                type="error"
                show-icon
                :closable="false"
              ></el-alert>
            </el-form-item>
            <el-form-item prop="subcategory" label="Auction">
              <el-switch
                v-model="ProductsForm.isAuction"
                inactive-text="Inactive"
                active-text="Active"
              />
            </el-form-item>
            <el-form-item label="Subcategory" required>
              <el-col :span="11">
                <el-select
                  v-model="ProductsForm.data.subcategory"
                  :remote-method="searchSubcategory"
                  filterable
                  v-validate="'required'"
                  remote
                  name="subcategory"
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
                <el-alert
                  v-if="errors.first('subcategory')"
                  :title="errors.first('subcategory')"
                  type="error"
                  show-icon
                  :closable="false"
                ></el-alert>
              </el-col>
              <el-col :span="11">
                <el-input v-model="ProductsForm.data.category" :disabled="true"/>
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
                <i class="el-icon-upload"/> Choose Files
              </label>
              <input
                id="file-input"
                type="file"
                multiple="multiple"
                accept="image/x-png, image/jpeg"
                @change="onFileChange"
              >
              <el-button type="primary" plain @click="submitUpload">Upload</el-button>
            </el-form-item>
            <el-form-item/>
            <el-form-item
              v-for="(attribute, index) in attributesList"
              :key="attribute._id"
              :label="attribute.name "
              :required="attribute.required"
              style="padding-left:15%"
            >
              <el-input
                :name="attribute.name"
                v-validate="requiredOrNot[index]"
                v-if="attribute.fieldType === 'String'"
                v-model="ProductsForm.data.specificProperties[index].fieldValue"
                class="input-field"
              />
              <input
                :name="attribute.name"
                v-validate="requiredOrNot[index]"
                v-if="attribute.fieldType === 'Boolean'"
                v-model="ProductsForm.data.specificProperties[index].fieldValue"
                type="checkbox"
                class="flipswitch"
              >

              <input
                :name="attribute.name"
                v-validate="requiredOrNot[index]"
                v-if="attribute.fieldType === 'Number'"
                v-model="ProductsForm.data.specificProperties[index].fieldValue"
                type="number"
                class="input-number"
                min="0"
                step="1"
              >
              <el-alert
                v-if="errors.first(attribute.name)"
                :title="errors.first(attribute.name)"
                type="error"
                show-icon
                :closable="false"
              ></el-alert>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ProductsForm')">Submit</el-button>
              <el-button @click="resetForm('ProductsForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSelectedSubcategory, updateProduct } from "@/api/products";
import axios from "axios";
import store from "../../store";
import VueSelectImage from "@/components/vue-select-image";
import waves from "@/directive/waves"; // Waves directive

export default {
  name: "EditProduct",
  components: { VueSelectImage },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return true;
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
          category: "",
          subcategory: "",
          description: "",
          images: [],
          thumbnail: "",
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
      requiredOrNot: [],
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
    };
  },
  watch: {
    dataImages: function () {
      var i = 0;
      var entry1;
      while (i < this.ProductsForm.data.images.length) {
        entry1 = this.ProductsForm.data.images[i];
        if (
          this.dataImages.some(function (entry2) {
            return entry1 === entry2.src;
          })
        ) {
          // Found, progress to next
          ++i;
        } else {
          // Not found, remove
          this.ProductsForm.data.images.splice(i, 1);
        }
      }
    },
    attributesList: function attributesList() {

      this.attributesList.forEach((value, index) => {
        if (value.required === true) {
          this.requiredOrNot[index] = 'required'
        } else {
          this.requiredOrNot[index] = ''
        }
      })
      console.log(this.requiredOrNot)
    }
  },
  created() {
    if (store.state.products.productDetails.length <= 0) {
      this.$router.push({ path: "/catalog/products" });
    } else {
      this.ProductsForm = store.state.products.productDetails;
      this.attributesList = this.ProductsForm.data.specificProperties;

      this.ProductsForm.data.images.forEach((image, index) => {
        this.dataImages[index] = { id: index, src: image };
        // if (this.ProductsForm.data.thumbnail === image) {
        //   this.onSelectImage(this.dataImages[index]);
        // }
      });
    }

  },

  methods: {
    // Get category based on Subcategory
    getCategory(value) {
      const obj = this.listSubcategories.filter(category => {
        return category.subcategory === value;
      });

      this.getSubcategoryAttributes();

      this.ProductsForm.data.category = obj[0].category;
    },
    // Show images thumbnails and remove duplicates
    onFileChange(e) {
      this.filesToUpload = e.target.files;
      const file = e.target.files;

      Object.entries(file).forEach(entry => {
        // get the name of the file, will be used as a key
        const ent = entry[1].name;

        // push to an object all the data
        this.urlObject[ent] = URL.createObjectURL(entry[1]);
      });

      this.url = new Set();

      Object.entries(this.urlObject).forEach((el, index) => {
        this.url.add({ id: index, value: el[1], name: el[0] });
      });

      this.images = [...this.url];

      this.images.forEach((value, index) => {
        if (this.ProductsForm.data.images.length >= 0) {
          this.dataImages.push({
            id: index,
            src: value.value,
            alt: value.name
          });
        } else {
          this.dataImages.push({
            id: this.ProductsForm.data.images.length + 1,
            src: value.value,
            alt: value.name
          });
        }
      });
    },

    // Manipulate Stock Status via stock value
    stockChanger() {
      if (this.ProductsForm.data.stock_level === 0) {
        this.ProductsForm.data.stock_status = false;
      } else {
        this.ProductsForm.data.stock_status = true;
      }
    },
    // Reset Modal form fields
    resetTemp() {
      const reset = (this.temp = {
        attributes: [
          {
            name: "",
            required: true
          }
        ],
        category: "",
        active: true,
        subcategory: "",
        price: 1
      });
      return reset;
    },
    async submitUpload() {
      this.ProductsForm.data.specificProperties.forEach((value, index) => {
        if (value.fieldType === "Number") {
          this.ProductsForm.data.specificProperties[
            index
          ].fieldValue = parseInt(value.fieldValue);
        }
      });

      const files = [...this.filesToUpload];

      // Remove elements if they dont exist in dataImages
      let dataLinks;
      if (!files) {
        this.$notify.error({
          title: "Error",
          message: "Upload Failed",
          duration: 2000
        });
      } else {
        if (files.length >= 0) {
          var i = 0;
          var entry1;
          while (i < files.length) {
            entry1 = files[i];
            if (
              this.dataImages.some(function (entry2) {
                return entry1.name === entry2.alt;
              })
            ) {
              // Found, progress to next
              ++i;
            } else {
              // Not found, remove
              files.splice(i, 1);
            }
          }
        }
        Object.entries(files).forEach(element => {
          const data = new FormData();
          data.append("image", element[1]);

          const config = {
            header: {
              "Content-Type": "multipart/form-data"
            }
          };

          dataLinks = axios
            .post("http://localhost:3000/api/images", data, config)
            .then(response => {
              this.mediaLinks.push(response.data);

              this.mediaLinks.forEach(image => {
                this.ProductsForm.data.images.push(image);
              });
              this.$notify({
                title: "success",
                message: "Uploaded Successfully",
                type: "success",
                duration: 2000
              });

              return this.mediaLinks;
            })
            .catch(err => console.log(err));
        });
        return dataLinks;
      }
    },
    // Search Subcategory
    searchSubcategory(query) {
      if (query !== "" && query.length >= 3) {
        this.loading = true;
        getSelectedSubcategory(query).then(response => {
          this.listSubcategories = response.data;
        });
      } else {
        this.listSubcategories = [];
      }
    },
    // Event for image selection
    onSelectImage: function (data) {
      this.imageSelected = data;
      this.dataImages.filter((selected, index) => {
        if (index === data.id) {
          this.selectedThumbnail = selected.id;
        }
      });
    },

    // Submit Dialog form for Adding
    async submitForm(ProductsForm) {
      await this.$validator.validateAll()
      this.$refs[ProductsForm].validate(valid => {
        if (valid && this.errors.items.length <= 0) {
          const images = [...new Set(this.ProductsForm.data.images)];
          this.ProductsForm.data.images = images;

          this.ProductsForm.data.images.forEach((value, index) => {
            if (this.selectedThumbnail === index) {
              this.ProductsForm.data.thumbnail = value;
            } else {
              this.ProductsForm.data.thumbnail = this.ProductsForm.data.images[0];
            }
          });

          this.$notify({
            title: "success",
            message: "Submit Successfully",
            type: "success",
            duration: 2000
          });

          updateProduct(this.ProductsForm, this.productUrl).then(
            response => { }
          );

          // that.submitUpload();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      while (this.ProductsForm.attributes.length > 0) {
        this.ProductsForm.attributes.pop();
      }
    },

    // get Subcategory Attributes
    getSubcategoryAttributes() {
      const obj = this.listSubcategories.filter(attributes => {
        return attributes.subcategory === this.ProductsForm.data.subcategory;
      });
      this.ProductsForm.data.specificProperties = [];

      this.attributesList = obj[0].attributes;
      this.attributesList.forEach((obj, index) => {
        this.ProductsForm.data.specificProperties[index] = {
          name: obj.name,
          fieldType: obj.fieldType
        };
      });
    }
  }
};
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
