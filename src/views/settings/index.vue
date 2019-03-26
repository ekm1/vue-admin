<template>
  <div class="app-container documentation-container">
    <el-row :gutter="10" type="flex">
      <el-col :xs="22" :sm="18" :md="18" :lg="18" :xl="12">
        <h3>General Settings</h3>
        <el-card>
          <el-form
            ref="storeForm"
            :model="storeForm"
            :is-multiple="true"
            label-width="200px"
            label-position="left"
            class="demo-storeForm"
          >
            <el-form-item label="Store Title" prop="name">
              <el-input v-model="storeForm.storeName"/>
            </el-form-item>
            <el-form-item label="Store Description" prop="desc">
              <el-input v-model="storeForm.storeDescription" type="textarea"/>
            </el-form-item>
            <el-form-item>
              <el-container id="preview" class="images-thumbnail">
                <vue-select-image
                  ref="single-select-image"
                  :data-images="dataImages"
                  class="test"
                  :is-multiple="true"
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

            <el-form-item>
              <el-button type="primary" @click="submitForm('storeForm')">{{ buttonName }}</el-button>
              <el-button @click="resetForm('storeForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="10" :sm="6" :md="6" :lg="6" :xl="12">
        <h3>Saved Settings</h3>
        <div class="card-div">
          <div v-for="store in savedSettings">
            <div class="column">
              <div class="card">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  class="delete-button"
                  circle
                  @click="deleteSettings(store)"
                />
                <div class="hitbox" @click="selectedStore(store)">
                  <h3>{{ store.storeName }}</h3>
                  <svg-icon icon-class="edit" class="edit"/>

                  <p>{{ store.storeDescription }}</p>
                </div>

                <el-switch
                  v-model="store.active"
                  class="switch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="checkSwitch(store)"
                />
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  addStore,
  getAllStoreSettings,
  changeSelectedSettings,
  UpdateSettings,
  deleteStoreSettings
} from "@/api/store";
import VueSelectImage from "@/components/vue-select-image";
import axios from "axios";

export default {
  name: "Settings",
  components: { VueSelectImage },
  data() {
    return {
      storeForm: {
        storeName: "",
        storeDescription: "",
        storeImage: "",
        active: false
      },
      changeActive: { id: null },
      softDelete: false,
      dataImages: [],
      savedSettings: [],
      selected: false,
      buttonName: "Create Store"
    };
  },
  created() {
    this.getList();
  },
  watch: {
    dataImages: function() {
      if (this.dataImages.length <= 0) {
        this.storeForm.storeImage = "";
        console.log(this.storeForm);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.selected === false) {
          addStore(this.storeForm).then();
        } else if (valid && this.selected === true) {
          UpdateSettings(this.storeForm).then();
        } else {
          console.log("error submit!!");
          return false;
        }
        this.getList();
      });
    },
    deleteSettings(store) {
      if (store.active === true) {
        store.softDelete = false;
      } else {
        store.softDelete = true;
        deleteStoreSettings(store.softDelete, store._id).then(response => {
          this.getList();
        });
      }
    },
    getList() {
      getAllStoreSettings(this.softDelete).then(response => {
        this.savedSettings = response.data;
      });
    },

    checkCreateOrUpdate() {
      if (this.selected === true) {
        this.buttonName = "Update Store";
      } else {
        this.buttonName = "Create Store";
      }
    },
    // Switch form infos
    selectedStore(store) {
      this.selected = true;
      this.checkCreateOrUpdate();
      this.storeForm = store;
      this.dataImages = [];

      this.dataImages.push({ id: 0, src: store.storeImage });
    },
    resetForm(formName) {
      this.selected = false;
      this.checkCreateOrUpdate();

      this.storeForm = {};
      this.dataImages = [];
    },
    onFileChange(e) {
      this.filesToUpload = e.target.files;
      const file = e.target.files;

      // get the name of the file, will be used as a key
      if (file[0]) {
        this.objectURL = URL.createObjectURL(file[0]);
        this.dataImages = [];
        this.dataImages.push({
          id: 0,
          src: this.objectURL,
          alt: file[0].name
        });
      }
    },
    checkSwitch(id) {
      this.changeActive.id = id._id;
      changeSelectedSettings(this.changeActive).then(response => {
        this.getList();
      });
    },

    onSelectImage: function(data) {
      this.imageSelected = data;
      this.dataImages.filter((selected, index) => {
        if (index === data.id) {
          this.selectedThumbnail = selected.id;
        }
      });
    },
    submitUpload() {
      const files = this.filesToUpload;
      // Remove elements if they dont exist in dataImages
      var i = 0;
      var entry1;
      while (i < files.length) {
        entry1 = files[i];
        if (
          this.dataImages.some(function(entry2) {
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

      if (!files) {
        this.$notify.error({
          title: "Error",
          message: "Upload Failed",
          duration: 2000
        });
      } else {
        Object.entries(files).forEach(element => {
          const data = new FormData();
          data.append("image", element[1]);

          const config = {
            header: {
              "Content-Type": "multipart/form-data"
            }
          };

          axios
            .post("http://localhost:3000/api/images", data, config)
            .then(response => {
              this.storeForm.storeImage = response.data;

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
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
.column {
  float: left;
  width: 32%;
  padding: 10px 10px;
  word-wrap: break-word;
}
.hitbox {
  cursor: pointer;
}

/* Remove extra left and right margins, due to padding */
.row {
  margin: 0 -5px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Responsive columns */
@media screen and (max-width: 1800px) {
  .column {
    width: 100%;
    display: block;
    margin-bottom: 20px;
  }
}

/* Style the counter cards */
.card {
  box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.2);
  padding: 16px;
  height: 300px;
  text-align: center;
  background-color: #ffff;
}
.edit {
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
}
.hitbox:hover > .edit {
  transition: opacity 0.5s ease-in-out;

  opacity: 1;
}

.delete-button {
  margin-left: 76%;
}
</style>
