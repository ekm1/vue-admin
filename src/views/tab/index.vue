<template>
  <div class="tab-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Filters</span>
      </div>
      <div>
        <el-form ref="form" :model="searchForm" label-width="120px">
          <el-form-item label="Product">
            <el-input
              v-model="searchForm.name"
              class="block"
              placeholder="Product"
              @select="handleSelect"
            ></el-input>
          </el-form-item>
          <el-form-item label="Category">
            <el-input
              v-model="searchForm.category"
              class="block"
              placeholder="Category"
              @select="handleSelect"
            ></el-input>
          </el-form-item>
          <el-form-item label="Subcategory">
            <el-input
              v-model="searchForm.subcategory"
              class="block"
              placeholder="Subcategory"
              @select="handleSelect"
            ></el-input>
          </el-form-item>
          <el-form-item label="Activity zone">
            <el-radio-group v-model="searchForm.isAuction" size="mini">
              <el-radio-button label="Inactive"></el-radio-button>
              <el-radio-button label="|"></el-radio-button>
              <el-radio-button label="Active"></el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      links: [],
      state4: '',
      timeout: null,
      radio4: 'New York',
      searchForm: {
        isAuction: null,
        category: '',
        subcategory: ''
      }
    };
  },
  methods: {
    loadAll() {
      return [
        { "value": "vue", "link": "https://github.com/vuejs/vue" },
        { "value": "element", "link": "https://github.com/ElemeFE/element" },
        { "value": "cooking", "link": "https://github.com/ElemeFE/cooking" },
        { "value": "mint-ui", "link": "https://github.com/ElemeFE/mint-ui" },
        { "value": "vuex", "link": "https://github.com/vuejs/vuex" },
        { "value": "vue-router", "link": "https://github.com/vuejs/vue-router" },
        { "value": "babel", "link": "https://github.com/babel/babel" }
      ];
    },
    querySearchAsync(queryString, cb) {
      var links = this.links;
      var results = queryString ? links.filter(this.createFilter(queryString)) : links;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createFilter(queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    }
  },
  mounted() {
    this.links = this.loadAll();
  }
};
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.block {
  display: block;
}
.box-card {
  border: 1px solid #dcdfe6;
}
</style>
