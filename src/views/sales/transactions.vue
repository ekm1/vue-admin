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
            <div>
              <el-input
                :placeholder="$t('Search by name')"
                style="width: 200px;"
                class="filter-item"
              />
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
              >{{ $t('table.search') }}</el-button>
              <el-button class="filter-item" @click="show3 = !show3" type="primary">
                <i class="fas el-icon-fa-caret-down"></i> Filters
              </el-button>

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
                    <el-form-item label="Order">
                      <el-input v-model="searchForm.category" class="block" placeholder="Type id"></el-input>
                    </el-form-item>
                    <el-form-item label="Subcategory">
                      <el-input
                        v-model="searchForm.subcategory"
                        class="block"
                        placeholder="Subcategory"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="Order">
                      <el-radio-group v-model="searchForm.isAuction" size="mini">
                        <el-radio-button size="mini" label="false">Inactive</el-radio-button>
                        <el-radio-button size="mini" label="unset">|</el-radio-button>
                        <el-radio-button size="mini" label="true">Active</el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Stock ">
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
          </div>
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

            <el-table-column :label="$t('Transaction #')" width="150px" align="center">
              <template slot-scope="scope">
                <span>#{{ scope.row.transactionId }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Proccessor')" width="150px" align="center">
              <template slot-scope="scope">
                <!-- <i class="fas el-icon-fa-cc-stripe"></i> -->

                <span>{{ scope.row.gatewayVendor }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Order #')" width="200px" align="center">
              <template slot-scope="scope">
                <span>#{{scope.row._id}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Bill-to')" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.buyerDetails.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Status')" width="80px" align="center">
              <template slot-scope="scope">
                <span>Paid</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Grand Total')" width="120px" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.totalPayment}} {{scope.row.currency}}</span>
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
      show3: false,
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

    // Reset Modal form fields
    changeOrderStatus(data, row) {
      if (data.status === 'Shipped') {

        this.setStatus.id = row

        updateStatus(this.setStatus.id, data)
        this.getList()

        this.addTracking(row)

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
    goToInvoice(row) {
      store.commit("INVOICE", row);

      this.$refs.ordersTable.setCurrentRow('');


      this.$router.push({ path: `/sales/invoices/${row._id}` });

    },
    addTracking(row) {
      this.centerDialogVisible = true
      this.formInline.orderId = row


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


    // Handling update on edit



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
.pagination {
  text-align: center;
}

@media (max-width: 900px) {
  .box-card {
    margin-right: 0.5rem;
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
.box-card {
  margin-top: 1rem;
  margin-left: 1.2rem;
}
.product-items {
  display: inline-block;
}
.product-expand {
  margin: 0.75rem;
}

.container {
  margin-top: 0.75rem;
}
</style>
