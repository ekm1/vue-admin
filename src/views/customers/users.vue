<template>
  <el-row :gutter="10" type="flex">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-card class="card-holder">
        <div id="center" class="app-container">
          <div class="filter-container">
            <el-input
              v-model="listQuery.name"
              :placeholder="$t('Search by name')"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >{{ $t('table.search') }}</el-button>

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
            border
            fit
            size="mini"
            highlight-current-row
            style="width: 100%;"
            @sort-change="sortChange"
          >
            <el-table-column :label="$t('Register date')" width="200px" align="center">
              <template slot-scope="scope">
                <span>{{ moment(scope.row.register_date) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Full name')" width="150px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }} {{ scope.row.lastname }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Email')" width="160px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Role')" width="110px" align="center">
              <template slot-scope="scope">
                <div v-for=" role in scope.row.roles">
                  <span>{{ role }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Country')" width="160px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.address.country_id }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('City')" width="160px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.address.city }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Phone')" width="160px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.address.telephone }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Street name')" width="160px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.address.street }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('House/Apartment number')" width="200px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.address.apartment }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Postal Code')" width="140px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.address.postcode }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.actions')"
              align="center"
              width="150px"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.isActive === true"
                  size="small"
                  type="danger"
                  @click="handleModifyStatus(scope.row,'deleted')"
                >{{ $t('Deactivate') }}</el-button>

                <el-button
                  v-if="scope.row.isActive ===false"
                  size="small"
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
            width="30%"
          >
            <el-row :gutter="10" type="flex">
              <el-col :xs="21" :sm="22" :md="20" :lg="16" :xl="24">
                <el-form
                  ref="dynamicValidateForm"
                  :model="dynamicValidateForm"
                  class="demo-dynamic"
                >
                  <h4>Basic Info</h4>
                  <el-form-item prop="category">
                    <el-input
                      v-model="dynamicValidateForm.category"
                      :placeholder="$t('First name')"
                    />
                  </el-form-item>
                  <el-form-item prop="category">
                    <el-input
                      v-model="dynamicValidateForm.category"
                      :placeholder="$t('Last name')"
                    />
                  </el-form-item>
                  <el-form-item prop="subcategory">
                    <el-input
                      v-model="dynamicValidateForm.subcategory"
                      :placeholder="$t('Email')"
                      name="email"
                      type="text"
                    />
                  </el-form-item>
                  <el-form-item prop="subcategory">
                    <el-input
                      v-model="dynamicValidateForm.password"
                      :placeholder="$t('login.password')"
                      type="password"
                      name="password"
                      auto-complete="on"
                      @keyup.enter.native="handleLogin"
                    />
                  </el-form-item>
                  <el-form-item prop="subcategory">
                    <el-input
                      v-model="dynamicValidateForm.password"
                      :placeholder="$t('Confirm Password')"
                      type="password"
                      name="password"
                      auto-complete="on"
                      @keyup.enter.native="handleLogin"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="submitForm('dynamicValidateForm')">Submit</el-button>
                    <el-button @click="resetForm('dynamicValidateForm')">Reset</el-button>
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
import { getAllUsers, searchByName, deleteSubCategory } from "@/api/users";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
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
      dynamicValidateForm: {
        attributes: [
          {
            name: "",
            required: true
          }
        ],
        category: "",
        active: true,
        subcategory: ""
      },
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
      tableKey: 0,
      list: null,
      type: "success",
      icon: "el-icon-check",
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        active: true,
        roles: ["user"],
        status: true
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
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
        create: "Create User"
      },
      dialogPvVisible: false,
      pvData: [],
      showReviewer: false,

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
  // Get items on create
  created() {
    this.getList();
  },
  watch: {
    list() {
      this.list.forEach((value, index1) => {
        if (value.addresses.length > 0) {
          value.addresses.forEach(value => {
            if (value.defaultAddress === true) {
              this.list[index1].address = value;
            }
          });
        } else {
          this.list[index1].address = {
            city: "N/A",
            country_id: "N/A",
            telephone: "N/A",
            postcode: "N/A",
            street: "N/A",
            apartment: "N/A"
          };
        }
      });
      console.log(this.list);
    }
  },

  methods: {
    getList() {
      if (
        this.listQuery.name === undefined ||
        this.listQuery.name === "" ||
        this.listQuery.name === " "
      ) {
        this.listLoading = true;
        getAllUsers(this.listQuery).then(response => {
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
      searchByName(
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
    moment: function(date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },

    // Handle status change
    handleModifyStatus(row, status) {
      if (status === "deleted") {
        row.isActive = false;

        deleteSubCategory(row).then(res => {
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
        row.isActive = true;

        deleteSubCategory(row).then(res => {
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

    // Sorting change
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },

    // Sorting by ID
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    // Reset Modal-Form values
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
        subcategory: ""
      });
      return reset;
    },
    // Handle create method
    handleCreate() {
      this.dynamicValidateForm = this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dynamicValidateForm"].clearValidate();
      });
    },

    // Add new attributes

    addAttribute() {
      this.dynamicValidateForm.attributes.push({
        required: true,
        name: ""
      });
    },

    // Edit Enitity

    // Reseting Dialog form
    resetForm(formName) {
      this.$refs[formName].resetFields();
      while (this.dynamicValidateForm.attributes.length > 0) {
        this.dynamicValidateForm.attributes.pop();
      }
    },
    // Remove attribute dinamically
    removeattribute(item) {
      var index = this.dynamicValidateForm.attributes.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.attributes.splice(index, 1);
      }
    },
    // Handling update on edit
    handleUpdate(row) {
      this.dynamicValidateForm = row;
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogPvVisible = true;
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
    handleStatus() {
      this.listQuery.active = !this.listQuery.active;
      this.listQuery.status = !this.listQuery.status;
      if (this.listQuery.status === true) {
        this.type = "success";
        this.icon = "el-icon-check";
      } else {
        this.type = "danger";
        this.icon = "el-icon-delete";
      }
      this.tableStatus = this.listQuery.active;
      this.getList();
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
