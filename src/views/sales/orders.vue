<template>
  <el-row :gutter="4">
    <el-col
      :xs="{ span: 24 }"
      :sm="{ span: 11 }"
      :md="{ span: 9 }"
      :lg="{ span: 8 }"
      :xl="{ span: 5 }"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="header-text">Filters</span>
        </div>
        <div>
          <el-form
            ref="form"
            :model="searchForm"
            class="form"
            label-width="100px"
            label-position="left"
          >
            <el-form-item label="Product">
              <el-input v-model="searchForm.name" class="block" placeholder="Product"></el-input>
            </el-form-item>
            <el-form-item label="Category">
              <el-input v-model="searchForm.category" class="block" placeholder="Category"></el-input>
            </el-form-item>
            <el-form-item label="Subcategory">
              <el-input v-model="searchForm.subcategory" class="block" placeholder="Subcategory"></el-input>
            </el-form-item>
            <el-form-item label="Auction">
              <el-radio-group v-model="searchForm.isAuction" size="mini">
                <el-radio-button label="false">Inactive</el-radio-button>
                <el-radio-button label="unset">|</el-radio-button>
                <el-radio-button label="true">Active</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Stock Status">
              <el-radio-group v-model="searchForm.stock_status" size="mini">
                <el-radio-button label="false">Inactive</el-radio-button>
                <el-radio-button label="unset">|</el-radio-button>
                <el-radio-button label="true">Active</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-button
              type="primary"
              icon="el-icon-search"
              class="search"
              @click="SearchSubmit('searchForm')"
            >Search</el-button>
          </el-form>
        </div>
      </el-card>
    </el-col>

    <el-col
      :xs="{ span: 24 }"
      :sm="{ span: 13 }"
      :md="{ span: 15 }"
      :lg="{ span: 16 }"
      :xl="{ span: 19 }"
    >
      <el-card class="card-holder">
        <div id="center" class="app-container">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            fit
            ref="ordersTable"
            @row-click="goToInvoice"
            size="mini"
            class="table-class"
            align="center"
            highlight-current-row
            style="width: 100%;"
            @sort-change="sortChange(scope.row)"
          >
            <el-table-column :label="$t('Date')" sortable="custom" width="200px" align="center">
              <template slot-scope="scope">
                <i class="el-icon-time"/>

                <span>{{ scope.row.buyerDetails.name }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Name')" width="150px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.buyerDetails.name }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Payment')" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.totalPayment}} {{ scope.row.currency}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Proccessor')" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.gatewayVendor }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Address')" width="80px" align="center">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>
                    <b>City:</b>
                    {{ scope.row.buyerDetails.city }}
                  </p>
                  <p>
                    <b>Addr:</b>
                    {{ scope.row.buyerDetails.address }}
                  </p>
                  <p>
                    <b>Addr:</b>
                    {{ scope.row.buyerDetails.address2 }}
                  </p>
                  <p>
                    <b>Zip:</b>
                    {{ scope.row.buyerDetails.zip_code }}
                  </p>
                  <p>
                    <b>Country:</b>
                    {{ scope.row.buyerDetails.country }}
                  </p>

                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{scope.row.buyerDetails.country }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column type="expand" width="20px">
              <template slot-scope="props">
                <div v-for="product in props.row.orderdItems">
                  <div>
                    <p class="product-items">{{product.itemName}}</p>
                    <p class="product-items">{{product.itemQuantity}}</p>
                    <p class="product-items">{{product.itemPrice}}</p>
                    <hr>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Products')" width="80px" align="center">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag
                    type="success"
                    style="margin-left:10px"
                    size="medium"
                  >{{getQuantity(scope.row.orderdItems) }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Tracking')" width="120px" align="center">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.orderStatus === 'Shipped' || scope.row.orderStatus === 'Completed'"
                >
                  <span v-if="scope.row.trackingNumber !='' ">{{ scope.row.trackingNumber }}</span>
                  <span v-else>Not Available</span>
                </div>
                <div v-else="scope.row.orderStatus === 'Pending'">
                  <span>Not Available</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('table.actions')"
              align="center"
              width="300"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  type="info"
                  size="small"
                  v-bind:disabled="scope.row.orderStatus === 'Pending'"
                  @click.stop="changeOrderStatus(orderStatus[0],scope.row._id)"
                >{{ $t('Pending') }}</el-button>
                <el-button
                  type="success"
                  size="small"
                  v-bind:disabled="scope.row.orderStatus === 'Shipped'"
                  @click.stop="changeOrderStatus(orderStatus[1],scope.row._id)"
                >{{ $t('Shipped') }}</el-button>
                <el-button
                  type="primary"
                  size="small"
                  v-bind:disabled="scope.row.orderStatus === 'Completed'"
                  @click.stop="changeOrderStatus(orderStatus[2],scope.row._id)"
                >{{ $t('Completed') }}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="getOrdersQuery.page"
            :limit.sync="getOrdersQuery.limit"
            class="pagination"
            @pagination="getList"
          />
        </div>
      </el-card>
      <el-dialog title="Add Tracking" :visible.sync="centerDialogVisible" width="20%" center>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.trackingNumber" placeholder="Tracking Number"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">Submit</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>

import { getAllOrders, setTracking, updateStatus } from "@/api/orders";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";

import store from "../../store";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import * as moment from "moment";

export default {
  name: "Orders",
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
      setStatus: {
        id: '',
      },
      icon: "el-icon-check",
      orderStatus: [{ status: 'Pending', notes: 'Your order is Pending' }, { status: 'Shipped', notes: 'Your order has been Shipped' }, { status: 'Completed', notes: 'Your order is Delivered' }],
      listSubcategories: [],
      total: 0,

      listLoading: true,
      formInline: {
        trackingNumber: ''
      },
      getOrdersQuery: {
        page: 1,
        limit: 20,
        status: true,
        sortType: "desc"
      },
      centerDialogVisible: false,


      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      tableStatus: true,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Add Product"
      },
      dialogPvVisible: false,

      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList() {
      if (
        this.getOrdersQuery.name === undefined ||
        this.getOrdersQuery.name === "" ||
        this.getOrdersQuery.name === " "
      ) {
        this.listLoading = true;
        getAllOrders(this.getOrdersQuery).then(response => {
          this.list = response.data.results.docs;
          console.log(this.list);
          this.total = response.data.results.total;
          this.listLoading = false;
        });
      } else {
        this.getFilerResults();
      }
    },

    handleFilter() {
      if (
        this.getOrdersQuery.name === undefined ||
        this.getOrdersQuery.name === "" ||
        this.getOrdersQuery.name === " "
      ) {
        this.getOrdersQuery.page = 1;
        this.getList();
      } else {
        this.getOrdersQuery.page = 1;
        this.getFilerResults();
      }
    },
    sortChange(data) {
      if (data.order === "ascending") {
        this.getOrdersQuery.sortType = "asc";
      } else {
        this.getOrdersQuery.sortType = "desc";
      }
      this.getList();
    },
    getQuantity(items) {
      return items.length
    },
    sortByID(order) {
      if (order === "ascending") {
        this.getOrdersQuery.sort = "+id";
      } else {
        this.getOrdersQuery.sort = "-id";
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
    changeOrderStatus(data, row) {
      if (data.status === 'Shipped') {
        this.addTracking(row)
        this.setStatus.id = row

        updateStatus(this.setStatus.id, data)
      } else {
        this.setStatus.id = row
        console.log(this.setStatus.id, data)
        updateStatus(this.setStatus.id, data)
        this.getList()

      }
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
      this.searchForm.page = this.getOrdersQuery.page;
      this.searchForm.limit = this.getOrdersQuery.limit;
      this.searchForm.sortType = this.getOrdersQuery.sortType;
      this.searchForm.isBundle = this.getOrdersQuery.isBundle;

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
    goToInvoice(row) {
      store.commit("INVOICE", row);

      this.$refs.ordersTable.setCurrentRow('');


      this.$router.push({ path: `/sales/invoices/${row._id}` });

    },
    addTracking(row) {
      this.centerDialogVisible = true
      this.formInline.orderId = row


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
    submitForm(formInline) {

      console.log(this.formInline)
      setTracking(this.formInline).then(response => {
        console.log(response)
      })
      this.dialogFormVisible = false
      this.getList()
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
      this.getOrdersQuery.status = !this.getOrdersQuery.status;
      if (this.getOrdersQuery.status === true) {
        this.type = "success";
        this.icon = "el-icon-check";
      } else {
        this.type = "danger";
        this.icon = "el-icon-delete";
      }
      this.tableStatus = this.getOrdersQuery.status;
      this.getList();
    },
    // hideDescription(string) {
    //   return string.length > length
    //     ? string.substring(0, 30 - 3) + "..."
    //     : string;
    // },

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
  margin: 3%;
  float: right;
  width: 100%;
  min-width: 50px;
  max-width: 100px;
}
.box-card {
  margin-top: 13px;
  margin-left: 20px;
}
.product-items {
  display: inline-block;
}
.product-expand {
  margin: 10px;
}
</style>
