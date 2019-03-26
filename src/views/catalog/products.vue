<template>
  <el-row :gutter="10" type="flex" justify="center">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <div id="center" class="app-container">
        <div class="filter-container">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="centerDialogVisible = true"
          />

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
          <el-button
            v-model="showReviewer"
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
          @sort-change="sortChange"
        >
          <el-table-column :label="$t('Date')" sortable="custom" width="295px" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"/>

              <span>{{ moment(scope.row.date) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('Name')" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.data.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('Description')" width="300px" align="center">
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
          <el-table-column :label="$t('Type')" width="120px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.data.productType }}</span>
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
      <el-dialog
        :visible.sync="centerDialogVisible"
        :model="SearchForm"
        title="Search"
        width="20%"
        center
      >
        <el-form ref="SearchForm" :model="SearchForm" label-width="120px" class="demo-dynamic">
          <el-form-item prop="product" label="Product Name">
            <el-input v-model="SearchForm.name"/>
          </el-form-item>
          <el-form-item prop="category" label="Category">
            <el-input v-model="SearchForm.category"/>
          </el-form-item>
          <el-form-item prop="subcategory" label="Subcategory">
            <el-input v-model="SearchForm.subcategory"/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="SearchSubmit('SearchForm')">Submit</el-button>
            <el-button @click="resetForm('SearchForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
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
      SearchForm: {
        name: "",
        category: "",
        subcategory: ""
      },
      centerDialogVisible: false,
      value10: [],
      tableKey: 0,
      list: null,
      type: "success",
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
      this.listLoading = true;
      this.SearchForm.page = this.getProductsQuery.page;
      this.SearchForm.limit = this.getProductsQuery.limit;
      this.SearchForm.sortType = this.getProductsQuery.sortType;

      console.log(this.SearchForm);
      searchProducts(this.SearchForm).then(results => {
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
    // Handle Creating new Product
    handleCreate() {
      this.ProductsForm = this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ProductsForm"].clearValidate();
      });
    },

    searchSubcategory(query) {
      if (query !== "" && query.length >= 3) {
        this.loading = true;
        console.log(query);
        getSelectedSubcategory(query).then(response => {
          this.listSubcategories = response.data;
          console.log(response.data);
        });
      } else {
        this.listSubcategories = [];
      }
    },

    // Add new attributes
    addAttribute() {
      this.ProductsForm.attributes.push({
        required: true,
        name: ""
      });
    },
    // Submit Dialog form for Adding
    submitForm(ProductsForm) {
      this.$refs[ProductsForm].validate(valid => {
        if (valid) {
          console.log(this.ProductsForm);

          this.$notify({
            title: "success",
            message: "Successfully created new Category",
            type: "success",
            duration: 2000
          });

          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    moment: function(date) {
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
    changed: function(row) {
      store.commit("CHANGE", row);
    },
    getProduct: function(event) {
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
</style>
