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
                      <el-input v-model="searchForm.buyerName" class="block" placeholder="Name"></el-input>
                    </el-form-item>
                    <el-form-item label="Order">
                      <el-input
                        v-model="searchForm.trackingNumber"
                        class="block"
                        placeholder="Tracking"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="Country">
                      <el-select
                        v-model="searchForm.country"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="Please enter a keyword"
                        :remote-method="remoteMethod"
                        :loading="Loading"
                      >
                        <el-option
                          v-for="item in options"
                          :key="item.label"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Order">
                      <el-radio-group v-model="searchForm.orderStatus" size="mini">
                        <el-radio-button size="mini" label="Pending">Pending</el-radio-button>
                        <el-radio-button size="mini" label="Shipped">Shipped</el-radio-button>
                        <el-radio-button size="mini" label="Completed">Completed</el-radio-button>
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

            <el-table-column :label="$t('Bill-to Name')" width="150px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.buyerDetails.name }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Grand Total')" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.totalPayment}}{{ scope.row.currency | currencyFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Proccessor')" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.gatewayVendor }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Ship-to')" width="80px" align="center">
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
            <el-table-column :label="$t('Tracking')" width="200px" align="center">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.orderStatus === 'Shipped' || scope.row.orderStatus === 'Completed'"
                >
                  <el-button
                    class="track-item"
                    size="mini"
                    type="success"
                    @click.stop="redirectToTracking(scope.row.trackingNumber)"
                    v-if="scope.row.trackingNumber !='' "
                  >
                    {{ scope.row.trackingNumber }}
                    <svg-icon icon-class="link"/>
                  </el-button>
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
import { country_list } from '@/filters/countries'

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
    currencyFilter(currency) {
      const currencyMap = {
        USD: '$',
        EUR: '€',
      }
      return currencyMap[currency]
    },
    typeFilter(type) {
      return true;
    }
  },
  data() {
    return {
      searchForm: {
        trackingNumber: "",
        buyerName: "",
        orderStatus: "",
      },
      centerDialogVisible: false,
      value10: [],
      tableKey: 0,
      value4: 'test',
      show3: false,
      options: [],

      list: null,
      type: "success",
      countryList: [],
      setStatus: {
        id: '',
      },
      icon: "el-icon-check",
      orderStatus: [{ status: 'Pending', notes: 'Your order is Pending' }, { status: 'Shipped', notes: 'Your order has been Shipped' }, { status: 'Completed', notes: 'Your order is Delivered' }],
      listSubcategories: [],
      total: 0,

      listLoading: true,
      Loading: true,
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



      showReviewer: false,
      tableStatus: true,
      dialogFormVisible: false,
      dialogStatus: "",

      dialogPvVisible: false,

      downloadLoading: false
    };
  },
  created() {
    this.getList();

  },
  mounted() {
    this.countryList = country_list.map(item => {
      return { value: item, label: item };
    });
  },
  methods: {
    getList() {
      const temp = new Set()
      if (
        this.getOrdersQuery.name === undefined ||
        this.getOrdersQuery.name === "" ||
        this.getOrdersQuery.name === " "
      ) {
        this.listLoading = true;
        getAllOrders(this.getOrdersQuery).then(response => {
          this.list = response.data.results.docs;
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
      console.log(data)
      // if (data.order === "ascending") {
      //   this.getOrdersQuery.sortType = "asc";
      // } else {
      //   this.getOrdersQuery.sortType = "desc";
      // }
      this.getList();
    },
    getQuantity(items) {
      return items.length
    },
    redirectToTracking(track) {      window.open(`https://track.aftership.com/${track}`, `_blank`);

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
      console.log(this.searchForm)

      this.listLoading = true;
      this.searchForm.page = this.getOrdersQuery.page;
      this.searchForm.limit = this.getOrdersQuery.limit;
      this.searchForm.sortType = this.getOrdersQuery.sortType;

      console.log(this.searchForm);
      getAllOrders(this.searchForm).then(results => {
        this.list = results.data.results.docs;
        this.total = results.data.results.total;
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
    //Get Countries from exported file
    remoteMethod(query) {
      if (query !== '') {
        this.Loading = true;

        this.Loading = false;
        this.options = this.countryList.filter(item => {
          return item.label.toLowerCase()
            .indexOf(query.toLowerCase()) > -1;
        });

      } else {
        this.options = [];
      }
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
    //Change Date Format
    moment: function (date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    //Handle download to Excel file
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
</style>
