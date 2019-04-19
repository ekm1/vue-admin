<template>
  <el-row :gutter="10" type="flex">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-card class="card-holder">
        <div id="center" class="app-container">
          <div class="filter-container">
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="handleCreate"
            >{{ $t('table.add') }}</el-button>
            <el-button
              v-waves
              :loading="downloadLoading"
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="handleDownload"
            >{{ $t('table.export') }}</el-button>
          </div>

          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            size="mini"
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column :label="$t('Start')" width="200" align="center">
              <template slot-scope="scope">
                <span>{{ moment(scope.row.dateCreated) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('End')" width="200" align="center">
              <template slot-scope="scope">
                <span>{{ moment(scope.row.dateEnds) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Name')" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.couponName.toUpperCase() }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Code')" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.couponCode.toUpperCase() }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Discount')" width="200" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.couponDiscount }}%</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Active-for')" width="100" align="center">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>
                    <b>City:</b>
                  </p>
                  <p>
                    <b>Addr:</b>
                  </p>
                  <p>
                    <b>Addr:</b>
                  </p>
                  <p>
                    <b>Zip:</b>
                  </p>
                  <p>
                    <b>Country:</b>
                  </p>

                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" v-if="scope.row.isForProduct === true">Product</el-tag>
                    <el-tag size="medium" v-if="scope.row.isForCategory === true">Category</el-tag>
                    <el-tag size="medium" v-if="scope.row.isForOrder === true">Category</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('table.actions')"
              align="center"
              width="230"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleUpdate(scope.row)"
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
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            class="pagination"
            @pagination="getList"
          />

          <el-dialog
            :title="textMap[dialogStatus]"
            :visible.sync="dialogFormVisible"
            class="dialog-size"
          >
            <el-row :gutter="10" type="flex">
              <el-col :xs="21" :sm="22" :md="20" :lg="16" :xl="16">
                <el-form
                  ref="couponForm"
                  :model="couponForm"
                  label-width="120px"
                  class="demo-dynamic"
                >
                  <el-form-item label="Name" required>
                    <el-input
                      v-validate="'required'"
                      name="Coupon Name"
                      v-model="couponForm.couponName"
                    />
                    <el-alert
                      v-if="errors.first('Coupon Name')"
                      :title="errors.first('Coupon Name')"
                      type="error"
                      show-icon
                      :closable="false"
                    ></el-alert>
                  </el-form-item>
                  <el-form-item label="Code" required>
                    <el-input
                      name="Coupon Code"
                      v-validate="'required'"
                      v-model="couponForm.couponCode"
                    />
                    <el-alert
                      v-if="errors.first('Coupon Code')"
                      :title="errors.first('Coupon Code')"
                      type="error"
                      show-icon
                      :closable="false"
                    ></el-alert>
                  </el-form-item>
                  <el-form-item label="Percentage" required>
                    <el-col :span="11">
                      <el-input-number
                        type="number"
                        v-model="couponForm.couponDiscount"
                        v-validate="'required'"
                        name="Discount"
                        :max="100"
                      ></el-input-number>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-progress
                        :text-inside="true"
                        :stroke-width="20"
                        style="margin-top:0.4rem"
                        :percentage="couponForm.couponDiscount"
                      ></el-progress>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Range" required>
                    <div class="block">
                      <el-date-picker
                        @change="modifyDate()"
                        v-model="temp.date"
                        type="daterange"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item label="Target">
                    <el-radio-group v-model="temp.active" size="mini" @change="couponState()">
                      <el-radio-button label="Products"></el-radio-button>
                      <el-radio-button label="Categories"></el-radio-button>
                      <el-radio-button label="Order"></el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="temp.active == 'Categories'" label="Categories">
                    <el-select
                      v-model="couponForm.activeCategories"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="Categories"
                      :remote-method="getCategories"
                      :loading="Loading"
                    >
                      <el-option
                        v-for="category in listCategories"
                        :key="category._id"
                        :label="category.category"
                        :value="category._id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="temp.active == 'Products'" label="Products">
                    <el-select
                      v-model="couponForm.activeProducts"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="Products"
                      :remote-method="getProducts"
                      :loading="Loading"
                    >
                      <el-option
                        v-for="product in listProducts"
                        :key="product._id"
                        :label="product.data.name"
                        :value="product._id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input-number
                      type="number"
                      label="Max Uses"
                      v-model="couponForm.count"
                      v-validate="'required'"
                      name="Discount"
                      :max="100"
                    ></el-input-number>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="submitForm('couponForm')">Submit</el-button>
                    <el-button @click="resetForm('couponForm')">Reset</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-dialog>

          <el-dialog
            :visible.sync="dialogPvVisible"
            title="Update Coupon"
            class="dialog-size"
            @click="updateForm('couponForm')"
          >
            <el-row :gutter="10" type="flex">
              <el-col :xs="21" :sm="22" :md="20" :lg="16" :xl="16">
                <el-form
                  ref="couponForm"
                  :model="couponForm"
                  label-width="120px"
                  class="demo-dynamic"
                >
                  <el-form-item label="Name" required>
                    <el-input
                      v-validate="'required'"
                      name="Coupon"
                      v-model="couponForm.couponName"
                    />
                    <el-alert
                      v-if="errors.first('Coupon')"
                      :title="errors.first('Coupon')"
                      type="error"
                      show-icon
                      :closable="false"
                    ></el-alert>
                  </el-form-item>
                  <el-form-item label="Code" required>
                    <el-input
                      name="Coupon"
                      v-validate="'required'"
                      v-model="couponForm.couponCode"
                    />
                    <el-alert
                      v-if="errors.first('Coupon')"
                      :title="errors.first('Coupon')"
                      type="error"
                      show-icon
                      :closable="false"
                    ></el-alert>
                  </el-form-item>
                  <el-form-item label="Percentage" required>
                    <el-col :span="11">
                      <el-input-number
                        type="number"
                        v-model="couponForm.couponDiscount"
                        v-validate="'required'"
                        :max="100"
                      ></el-input-number>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-progress
                        :text-inside="true"
                        :stroke-width="20"
                        style="margin-top:0.4rem"
                        :percentage="couponForm.couponDiscount"
                      ></el-progress>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Range" required>
                    <div class="block">
                      <el-date-picker
                        @change="modifyDate()"
                        v-model="temp.date"
                        type="daterange"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item label="Target">
                    <el-radio-group v-model="temp.active" size="mini" @change="couponState()">
                      <el-radio-button label="Products"></el-radio-button>
                      <el-radio-button label="Categories"></el-radio-button>
                      <el-radio-button label="Order"></el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="temp.active == 'Categories'" label="Categories">
                    <el-select
                      v-model="couponForm.activeCategories"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="Categories"
                      :remote-method="getCategories"
                      :loading="Loading"
                    >
                      <el-option
                        v-for="category in listCategories"
                        :key="category._id"
                        :label="category.category"
                        :value="category._id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="temp.active == 'Products'" label="Products">
                    <el-select
                      v-model="couponForm.activeProducts"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="Products"
                      :remote-method="getProducts"
                      :loading="Loading"
                    >
                      <el-option
                        v-for="product in listProducts"
                        :key="product._id"
                        :label="product.data.name"
                        :value="product._id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Max Uses">
                    <el-input-number
                      type="number"
                      v-model="couponForm.count"
                      v-validate="'required'"
                      name="Discount"
                      :max="100"
                    ></el-input-number>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="updateForm('couponForm')">Submit</el-button>
                    <el-button @click="resetForm('couponForm')">Reset</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-dialog>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
// TODO: Validation & on Enter Submit form.
import { getAllCoupons, createCoupon, updateCoupon } from "@/api/coupons";
import { searchProducts } from "@/api/products";
import * as moment from "moment";

import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import {
  searchByCategoryName,

} from "@/api/categories";

export default {
  name: "Coupons",
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
      couponForm: {

        dateCreated: null,
        dateEnds: null,
        isForCategory: true
      },

      tableKey: 0,
      list: null,
      total: 0,
      type: "success",
      icon: "el-icon-check",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        name: undefined,
        type: undefined,
        status: true
      },
      listProducts: [],
      listCategories: [],

      temp: {
        date: [],
        active: 'Orders'
      },
      SearchForm: {
        name: "",
        sortType: "desc",
        page: 1,
        isBundle: false,
        limit: 9999,
        status: true
      },
      Loading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit Coupon",
        create: "Create Coupon"
      },
      dialogPvVisible: false,
      pvData: [],
      showReviewer: false,
      downloadLoading: false
    };
  },
  // Get items on create
  created() {
    this.getList();
  },
  methods: {
    getList() {
      if (
        this.listQuery.name === undefined ||
        this.listQuery.name === "" ||
        this.listQuery.name === " "
      ) {
        this.listLoading = true;
        getAllCoupons(this.listQuery.page, this.listQuery.limit).then(response => {

          this.list = response.data.docs;
          this.total = response.data.total;
          this.listLoading = false;
        });
      } else {
        this.getFilerResults();
      }
    },
    getFilerResults() {
      this.listLoading = true;
      searchByCategoryName(
        this.listQuery.name,
        this.listQuery.page,
        this.listQuery.limit,
        this.listQuery.status
      ).then(results => {
        this.list = results.data.docs;
        this.total = results.data.total;
        this.listLoading = false;
      });
    },
    // Searching in the table
    handleFilter() {
      if (
        this.listQuery.name === undefined ||
        this.listQuery.name === "" ||
        this.listQuery.name === " "
      ) {
        this.listQuery.page = 1;
        this.getList();
      } else {
        this.listQuery.page = 1;
        this.getFilerResults();
      }
    },
    // Handle create method
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["couponForm"].clearValidate();
      });
    },

    // Add new attributes


    // Submit Dialog form for Adding
    submitForm(couponForm) {
      delete this.couponForm.active;

      this.$refs[couponForm].validate(valid => {
        if (valid) {
          createCoupon(this.couponForm)
            .then(this.getList())
            .catch(err => console.log(err));
          // this.resetForm('couponForm')

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
    //Get Products in order to add Coupon code on them
    getProducts(query) {
      if (query !== "" && query.length >= 3) {
        this.Loading = true;
        this.SearchForm.name = query;
        searchProducts(this.SearchForm).then(response => {
          this.listProducts = response.data.docs
        });
      } else {
        this.listProducts = [];
      }
      this.Loading = false;

    },
    getCategories(query) {
      if (query !== "" && query.length >= 3) {
        this.Loading = true;
        this.SearchForm.name = query;
        searchByCategoryName(
          this.SearchForm.name,
          this.SearchForm.page,
          this.SearchForm.limit,
          this.SearchForm.status
        ).then(response => {
          console.log(response.data.docs)
          this.listCategories = response.data.docs
        });
      } else {
        this.listCategories = [];
      }
      this.Loading = false;

    },

    //Add date to start and end date
    modifyDate() {
      if (this.temp.date != null) {
        this.temp.date.forEach((element, index) => {
          if (index === 0) {
            this.couponForm.dateCreated = element
          } else {
            this.couponForm.dateEnds = element
          }
        });
        delete this.couponForm.date

      } else {
        this.couponForm.dateCreated = null;
        this.couponForm.dateEnds = null
        delete this.couponForm.date

      }
    },
    couponState() {
      if (this.temp.active === 'Products') {
        this.couponForm.isForProduct = true;
        this.couponForm.isForCategory = false;
        this.couponForm.isForOrder = false;
      } else if (this.temp.active === 'Categories') {
        this.couponForm.isForCategory = true;
        this.couponForm.isForProduct = false;
        this.couponForm.isForOrder = false;

      } else {
        this.couponForm.isForOrder = true;
        this.couponForm.isForCategory = false;
        this.couponForm.isForProduct = false;
      }
      if (this.couponForm.isForProduct === true) {
        this.temp.active === 'Products'
      }
      console.log(this.temp.active)

    },

    // Edit Enitity
    updateForm(couponForm) {
      this.$refs[couponForm].validate(valid => {
        if (valid) {
          let id = this.couponForm._id
          updateCoupon(this.couponForm, id)
            .then(console.log(this.couponForm), this.getList())
            .catch(err => console.log(err));
          this.$notify({
            title: "success",
            message: "Coupon Successfully Updated",
            type: "success",
            duration: 2000
          });
          this.dialogPvVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // Reseting Dialog form
    resetForm(formName) {
      this.$refs[formName].resetFields();

    },

    // Handling update on edit
    handleUpdate(row) {
      console.log(row)
      this.temp.date.push(row.dateCreated, row.dateEnds)
      console.log(this.temp)
      this.couponForm = row;
      //   this.temp = Object.assign({}, row); // copy obj
      //   this.temp.timestamp = new Date(this.temp.timestamp);
      //   this.dialogStatus = "update";
      this.dialogPvVisible = true;
    },
    moment: function (date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },

    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["Category", "Subcategory", "ACTIVE"];
        const filterVal = ["category", "subcategory", "active"];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
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
.app-container {
  margin: 0 auto;
  max-width: 1271px;
}

.input-field {
  padding-bottom: 2%;
}
/*
.dialog-size {
  width: 50%;
  margin: 0 auto;
}
.select-size {
  width: 100%;
} */

.pagination {
  text-align: center;
}
.filter-container {
  text-align: center;
}
</style>
