<template>
  <el-row :gutter="4">
    <el-col
      :xs="{ span: 24 }"
      :sm="{ span: 24 }"
      :md="{ span: 24 }"
      :lg="{ span: 24 }"
      :xl="{ span: 24 }"
    >
      <el-card class="card-holder">
        <div id="center" class="app-container">
          <div class="filter-container">
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

            <el-button class="filter-item" @click="show3 = !show3" type="primary">
              <i class="fas el-icon-fa-caret-down"></i> Filters
            </el-button>
            <el-button
              v-model="showReviewer"
              :type="type"
              :icon="icon"
              class="filter-item"
              circle
              style="margin-left:15px;"
              @click="handleStatus()"
            />

            <transition name="el-fade-in-linear">
              <div v-show="show3" class="container">
                <el-form
                  ref="form"
                  :model="searchForm"
                  class="form"
                  :inline="true"
                  size="mini"
                  label-position="top"
                >
                  <el-form-item label="Client">
                    <el-input v-model="searchForm.name" class="block" placeholder="Type a name"></el-input>
                  </el-form-item>
                  <el-form-item label="Category">
                    <el-input v-model="searchForm.category" class="block" placeholder="Category"></el-input>
                  </el-form-item>
                  <el-form-item label="Subcategory">
                    <el-input
                      v-model="searchForm.subcategory"
                      class="block"
                      placeholder="Subcategory"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Auction">
                    <el-radio-group v-model="searchForm.isAuction" size="mini">
                      <el-radio-button size="mini" label="false">Inactive</el-radio-button>
                      <el-radio-button size="mini" label="unset">|</el-radio-button>
                      <el-radio-button size="mini" label="true">Active</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="Stock Status ">
                    <el-radio-group v-model="searchForm.stock_status" size="mini">
                      <el-radio-button size="mini" label="false">Inactive</el-radio-button>
                      <el-radio-button size="mini" label="unset">|</el-radio-button>
                      <el-radio-button size="mini" label="true">Active</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      icon="el-icon-search"
                      class="search"
                      size="mini"
                      @click="SearchSubmit('searchForm')"
                    >Apply</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </transition>
          </div>

          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            fit
            highlight-current-row
            size="mini"
            class="table-class"
            align="center"
            style="width:100%;"
            @sort-change="sortChange"
          >
            <el-table-column :label="$t('Date')" sortable="custom" width="200" align="center">
              <template slot-scope="scope">
                <i class="el-icon-time"/>

                <span>{{ moment(scope.row.date) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Name')" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Description')" width="100" align="center">
              <template slot-scope="scope">
                <span>{{ hideDescription(scope.row.data.description) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Price')" width="100" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.price }}$</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Auction')" width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.isAuction }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Category')" width="140" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.category }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Stock')" width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.stock_level }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Stock Status')" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.data.stock_status }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.status')" width="64" align="center">
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
                <router-link :to="{ name: 'Edit Product',params:{id:scope.row._id}, }">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="changed(scope.row)"
                  >{{ $t('table.edit') }}</el-button>
                </router-link>

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
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {
  getAllProducts,
  getSelectedSubcategory,
  searchProducts,
  changeProductStatus
} from "@/api/products";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";

import store from "../../store";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import * as moment from "moment";

export default {
  name: "Categories",
  components: { Pagination },
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
      ProductsForm: {
        price: 1,
        attributes: [
          {
            name: "",
            required: true
          }
        ],
        category: "",
        active: true,
        subcategory: "",

        searchValue: "",
        isBundle: false
      },

      searchForm: {
        category: "",
        subcategory: "",
        name: "",
        isAuction: "unset",
        stock_status: "unset"
      },
      centerDialogVisible: false,
      value10: [],
      tableKey: 0,
      list: null,
      type: "success",
      show3: false,
      icon: "el-icon-check",
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
        isBundle: false,
        status: true,
        sortType: "desc"
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      tableStatus: true,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        name: "",
        type: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Add Product"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "name is required", trigger: "blur" }]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList() {
      if (
        this.getProductsQuery.name === undefined ||
        this.getProductsQuery.name === "" ||
        this.getProductsQuery.name === " "
      ) {
        this.listLoading = true;
        getAllProducts(this.getProductsQuery).then(response => {
          this.list = response.data.docs;
          this.total = response.data.total;
          this.listLoading = false;
        });
      } else {
        this.getFilerResults();
      }
    },

    handleFilter() {
      if (
        this.getProductsQuery.name === undefined ||
        this.getProductsQuery.name === "" ||
        this.getProductsQuery.name === " "
      ) {
        this.getProductsQuery.page = 1;
        this.getList();
      } else {
        this.getProductsQuery.page = 1;
        this.getFilerResults();
      }
    },
    sortChange(data) {
      if (data.order === "ascending") {
        this.getProductsQuery.sortType = "asc";
      } else {
        this.getProductsQuery.sortType = "desc";
      }
      this.getList();
    },
    sortByID(order) {
      if (order === "ascending") {
        this.getProductsQuery.sort = "+id";
      } else {
        this.getProductsQuery.sort = "-id";
      }
      this.handleFilter();
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
    // Search form
    SearchSubmit() {
      Object.keys(this.searchForm).forEach(
        key =>
          (this.searchForm[key] == null ||
            this.searchForm[key] == "" ||
            this.searchForm[key] == "unset") &&
          delete this.searchForm[key]
      );

      this.listLoading = true;
      this.searchForm.page = this.getProductsQuery.page;
      this.searchForm.limit = this.getProductsQuery.limit;
      this.searchForm.sortType = this.getProductsQuery.sortType;
      this.searchForm.isBundle = this.getProductsQuery.isBundle;

      console.log(this.searchForm);
      searchProducts(this.searchForm).then(results => {
        this.list = results.data.docs;
        this.total = results.data.total;
        this.listLoading = false;
      });
      this.centerDialogVisible = false;
    },
    handleModifyStatus(row, status) {
      if (status === "deleted") {
        changeProductStatus(row._id, "false").then(res => {
          if (res.status) {
            this.$notify({
              title: "delete",
              message: `${row.data.name} Successfully Deleted`,
              type: "warning",
              duration: 2000
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
              message: `${row.data.name} Successfully Activated`,
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
    // Handle Creating new Product
    handleCreate() {
      this.ProductsForm = this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ProductsForm"].clearValidate();
      });
    },

    moment: function (date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    // Reseting Dialog form
    resetForm(formName) {
      this.$refs[formName].resetFields();
      while (this.ProductsForm.attributes.length > 0) {
        this.ProductsForm.attributes.pop();
      }
    },
    // Remove attribute dinamically
    removeattribute(item) {
      var index = this.ProductsForm.attributes.indexOf(item);
      if (index !== -1) {
        this.ProductsForm.attributes.splice(index, 1);
      }
    },
    // Handling update on edit
    changed: function (row) {
      store.commit("CHANGE", row);
    },
    getProduct: function (event) {
      console.log(event);
      this.$router.push({ name: "ProductDetails" });
    },

    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["DATE", "Product Name", "CATEGORY", "SUBCATEGORY"];
        const filterVal = ["date", "Name", "category", "subcategory"];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
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
    hideDescription(string) {
      return string.length > length
        ? string.substring(0, 30 - 3) + "..."
        : string;
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style scoped>
.input-field {
  padding-bottom: 2%;
}
.filter-container {
  text-align: center;
}

.pagination {
  text-align: center;
}

@media (max-width: 900px) {
  .box-card {
    margin-right: 20px;
  }
}

.search {
  margin: 1rem;
  float: right;
  width: 100%;
  min-width: 50px;
  max-width: 100px;
  position: relative;
  top: 0.8rem;
}
.el-button + .el-button {
  margin-left: 0;
}
.box-card {
  margin-top: 13px;
  margin-left: 20px;
}
</style>

