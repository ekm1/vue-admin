<template>
  <div id="center" class="app-container">
    <el-row :gutter="8">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 8 }"
        :lg="{ span: 8 }"
        :xl="{ span: 8 }"
      >
        <el-card class="box-card block">
          <div slot="header" class="clearfix">
            <span class="header-text">Create Bundles</span>
          </div>
          <el-form
            ref="ProductsForm"
            :model="ProductsForm"
            label-width="120px"
            class="demo-dynamic"
          >
            <el-form-item prop="products" label="Add Products">
              <el-col :span="11">
                <el-select
                  v-model="selectedProduct"
                  :remote-method="searchProductsforBundle"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="Product"
                  @input="getProductsBundle"
                >
                  <el-option
                    v-for="(product, index) in listProducts"
                    :key="index"
                    :label="product.data.name"
                    :value="product.data.name"
                  />
                </el-select>
              </el-col>
              <el-col :span="12">
                <div v-for="(tag,index) in tagProducts">
                  <el-form-item prop="category" :label="tag" class="tags">
                    <input
                      v-model="ProductsForm.data.products_items[index].productQuantity"
                      type="number"
                      class="input-product"
                      min="0"
                      step="1"
                    >
                  </el-form-item>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item prop="category" label="Bundle Name">
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
                    v-for="(category, index) in listSubcategories"
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
            </el-form-item>
            <el-form-item/>
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
              >Submit</el-button>
              <el-button @click="resetForm('ProductsForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 16 }"
        :lg="{ span: 16 }"
        :xl="{ span: 16 }"
      >
        <el-card class="block">
          <div slot="header" class="clearfix">
            <span class="header-text">Bundles List</span>
            <div class="filter-container"/>
          </div>
          <div class="filter-container">
            <el-button
              :type="type"
              :icon="icon"
              class="filter-item"
              circle
              style="margin-left:15px;"
              @click="handleStatus()"
            />
          </div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            fit
            class="table-class"
            align="center"
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column :label="$t('Name')" width="150px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Description')" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ hideDescription(scope.row.data.description) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Price')" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.price }}$</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Auction')" width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.isAuction }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Category')" width="140px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.category }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Stock')" width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.stock_level }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Stock Status')" width="120px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.stock_status }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.status')" width="64px" align="center">
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
                <router-link :to="{ name: 'Product Details',params:{id:scope.row._id}, }">
                  <el-button type="info" size="mini" @click="changed(scope.row)">{{ $t('Open') }}</el-button>
                </router-link>

                <el-button
                  type="primary"
                  size="mini"
                  @click="changed(scope.row)"
                >{{ $t('table.edit') }}</el-button>

                <el-button
                  v-if="scope.row.active === true"
                  size="mini"
                  type="danger"
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
            class="pagination"
            @pagination="getList"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getSelectedSubcategory,
  addProduct,
  deleteImages,
  searchProducts,
  getAllProducts,
  getDetails,
  updateProduct,
  changeProductStatus
} from "@/api/products";
import axios from "axios";
import VueSelectImage from "@/components/vue-select-image";
import waves from "@/directive/waves"; // Waves directive

import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Bundles",
  components: { VueSelectImage, Pagination },
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
        date: Date.now(),
        isBundle: true,
        data: {
          name: "",
          category: "",
          subcategory: "",
          description: "",
          images: [],
          thumbnail: "",
          price: 1,
          stock_level: 0,
          specificProperties: [],
          stock_status: false,
          products_items: []
        }
      },
      SearchForm: {
        name: "",
        sortType: "desc",
        page: 1,
        isBundle: false,
        limit: 9999
      },
      selectableOptions: [],
      selectable: "",
      // Images Delcaration
      dataImages: [],
      url: [],
      values: [],
      selectedProduct: "",
      tagProducts: [],
      images: [],
      total: 0,
      tableKey: 0,
      icon: 'el-icon-check',
      type: 'success',
      createOrEdit: false,
      filesToUpload: undefined,
      mediaLinks: [],
      productUrl: "",
      arrayOfURL: [],
      options: [
        {
          value: "String",
          label: "String"
        },
        {
          value: "Number",
          label: "Number"
        },
        {
          value: "Boolean",
          label: "Boolean"
        }
      ],
      listProducts: null,
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
        name: undefined,
        status: true,
        isBundle: true,
        sortType: "desc"
      },
      urlObject: {}
    };
  },
  computed: {
    isDisabled() {
      // evaluate whatever you need to determine disabled here... for Form Submitting
      if (this.ProductsForm.data.images <= this.dataImages) {
        return true;
      } else return false;
    }
  },

  created() {
    this.getList();
  },

  methods: {
    //Add Products to ProductsForm and Tags
    getProductsBundle(product) {
      this.listProducts.forEach(value => {
        if (value.data.name === product) {
          this.tagProducts.push(value.data.name);

          this.ProductsForm.data.products_items.push({
            productId: value._id.toString(),
            productQuantity: null
          });
        }
        const set = new Set(this.tagProducts);
        this.tagProducts = [...set];

        this.ProductsForm.data.products_items = this.uniqueValues(
          this.ProductsForm.data.products_items,
          "productId"
        );
        console.log(this.ProductsForm.data.products_items);
      });
      this.selectedProduct = "";
    },
    //Get all products names
    getList() {
      if (
        this.getProductsQuery.name === undefined ||
        this.getProductsQuery.name === "" ||
        this.getProductsQuery.name === " "
      ) {
        this.listLoading = true;
        getAllProducts(this.getProductsQuery).then(response => {
          console.log(response.data);
          this.list = response.data.docs;
          this.total = response.data.total;
          this.listLoading = false;
        });
      } else {
        this.getFilerResults();
      }
    },
    // Clear duplicates
    uniqueValues(arr, key) {
      var uniq = {};

      return arr.filter(
        obj => !uniq[obj.productId] && (uniq[obj.productId] = true)
      );
    },
    handleModifyStatus(row, status) {
      if (status === "deleted") {
        changeProductStatus(row._id, "false").then(res => {
          if (res.status) {
            this.$message({
              message: "success",
              type: "success"
            });
            this.list = this.list.filter(el => {
              return el._id !== row._id;
            });
            row.status = status;
          }
        });
      } else if (status === "activate") {
        changeProductStatus(row._id, "true").then(res => {
          if (res.status) {
            this.$notify({
              title: "success",
              message: "Successfully deleted Subcategory",
              type: "success",
              duration: 2000
            });
            this.list = this.list.filter(el => {
              return el._id !== row._id;
            });
            row.status = status;
          }
        });
      }
    },
    // Get category based on Subcategory
    getCategory(value) {
      const obj = this.listSubcategories.filter(category => {
        return category.subcategory === value;
      });
      this.getSubcategoryAttributes();

      this.ProductsForm.data.category = obj[0].category;
    },
    // Hide excess description
    hideDescription(string) {
      return string.length > length
        ? string.substring(0, 30 - 3) + "..."
        : string;
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
      this.submitUpload();
    },
    // Manipulate Stock Status via stock value
    stockChanger() {
      if (this.ProductsForm.data.stock_level === 0) {
        this.ProductsForm.data.stock_status = false;
      } else {
        this.ProductsForm.data.stock_status = true;
      }
    },
    //
    makeSelectable(value, index) {
      this.ProductsForm.data.specificProperties[index].fieldValue = value;
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
    // Submitting Image Upload

    async submitUpload() {
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
    // Search Products to add on the bundles
    searchProductsforBundle(query) {
      if (query !== "" && query.length >= 3) {
        this.loading = true;
        this.SearchForm.name = query;
        searchProducts(this.SearchForm).then(response => {
          this.listProducts = response.data.docs;
          console.log(this.listProducts);
        });
      } else {
        this.listProducts = [];
      }
    },
    // Search Subcategories
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
    onSelectImage: function (data) {
      this.imageSelected = data;
      this.dataImages.filter((selected, index) => {
        if (index === data.id) {
          this.selectedThumbnail = selected.id;
        }
      });
    },
    //Fires when EDIT Button is pressed
    async changed(row) {
      this.createOrEdit = true
      this.resetDefault();

      const response = await getDetails(row._id);
      this.productUrl = row._id

      response.data.items.forEach(value => {
        this.tagProducts.push(value.data.name);
      });

      this.ProductsForm = response.data.body;
      this.ProductsForm.data.images.forEach((image, index) => {
        this.dataImages.push({ id: index, src: image });
      });
      console.log(this.ProductsForm);
    },
    //Reset to Default Values
    resetDefault() {
      this.ProductsForm = {
        active: true,
        isAuction: false,
        date: Date.now(),
        isBundle: true,
        data: {
          name: "",
          category: "",
          subcategory: "",
          description: "",
          images: [],
          thumbnail: "",
          price: 1,
          stock_level: 0,
          specificProperties: [],
          stock_status: false,
          products_items: []
        }
      };
      this.tagProducts = [];
      this.dataImages = [];
    },

    // Submit Dialog form for Adding
    submitForm(ProductsForm) {
      this.$refs[ProductsForm].validate(async valid => {
        if (valid) {
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

          if (this.createOrEdit === true) {
            await updateProduct(this.ProductsForm, this.productUrl);
            this.getList()
          } else {

            await addProduct(this.ProductsForm);
            this.getList()
          }

          // that.submitUpload();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      const uploadedImages = [];
      this.ProductsForm.data.images.forEach(value => {
        const deleteImages = value.split("/");
        uploadedImages.push(
          deleteImages[7] + "/" + deleteImages[8].split(".")[0]
        );
      });
      deleteImages(uploadedImages).then(response => {
        console.log(response.data);
      });
      Object.assign(this.$data, this.$options.data.call(this));
      this.getList();
    },
    handleStatus() {
      this.getProductsQuery.status = !this.getProductsQuery.status;
      if (this.getProductsQuery.status === true) {
        this.type = "success";
        this.icon = "el-icon-check";
      } else {
        this.type = "danger";
        this.icon = "el-icon-delete";
      }
      this.tableStatus = this.getProductsQuery.status;
      this.getList();
    },

    // get Subcategory Attributes
    getSubcategoryAttributes() {
      const obj = this.listSubcategories.filter(attributes => {
        return attributes.subcategory === this.ProductsForm.data.subcategory;
      });
      this.attributesList = obj[0].attributes;
      this.attributesList.forEach((obj, index) => {
        this.ProductsForm.data.specificProperties[index] = {
          name: obj.name,
          fieldType: obj.fieldType
        };
      });
    }
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
      console.log(this.ProductsForm);
    }
  }
};
</script>
<style scoped>
@import "./style.scss";
@media only screen and (min-width: 990px) {
}
.tag {
  font-size: 17px;
  margin: 1%;
  display: inherit;
  flex-wrap: wrap;
}
.input-product {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;

  color: #606266;
  font-size: inherit;
  text-align: center;
  outline: 0;
  width: 60%;
  display: inline-flex;

  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.pagination {
  text-align: center;
}
.el-button + .el-button {
  margin-left: 0px;
}
.filter-container {
  text-align: center;
}
.tags {
  background-color: rgba(64, 158, 255, 0.1);
  display: inline-block;
  height: 32px;
  margin: 2px;
  padding-bottom: 34px;
  line-height: 30px;
  font-size: 14px;
  color: #409eff;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid rgba(64, 158, 255, 0.2);
  white-space: nowrap;
}
</style>
