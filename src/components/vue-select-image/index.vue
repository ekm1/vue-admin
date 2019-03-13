<template>
  <div :class="rootClass">
    <ul :class="rootClass + '__wrapper'">
      <li v-for="(dataImage, index) in dataImagesLocal" :key="index" :class="rootClass + '__item'">
        <div v-if="!isMultiple" :class="classThumbnail(singleSelected.id, dataImage.id)">
          <div class="container">
            <img
              :src="dataImage.src"
              :alt="dataImage.alt"
              :height="h"
              :width="w"
              :class="rootClass + '__img'"
            >
            <div class="overlay"/>
            <div class="inside-container">
              <el-button type="primary" class="button" @click="onSelectImage(dataImage)">Thumbnail</el-button>
              <el-button type="danger" class="button" @click="onSelectImageDelete(dataImage)">Delete</el-button>
            </div>
          </div>

          <label v-if="useLabel" :class="rootClass + '__lbl'">{{ dataImage.alt }}</label>
        </div>

        <div
          v-if="isMultiple"
          :class="classThumbnailMultiple(dataImage.id)"
          @click="onSelectMultipleImage(dataImage)"
        >
          <img
            :src="dataImage.src"
            :alt="dataImage.alt"
            :height="h"
            :width="w"
            :class="rootClass + '__img'"
          >

          <label v-if="useLabel" :class="rootClass + '__lbl'">{{ dataImage.alt }}</label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'VueSelectImage',
  props: {
    dataImages: {
      type: Array,
      default: () => []
    },
    selectedImages: {
      type: Array,
      default: () => []
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    useLabel: {
      type: Boolean,
      default: false
    },
    rootClass: {
      type: String,
      default: 'vue-select-image'
    },
    activeClass: {
      type: String,
      default: '--selected'
    },
    h: {
      type: String,
      default: 'auto'
    },
    w: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      singleSelected: {
        id: ''
      },
      multipleSelected: []
    }
  },
  computed: {
    dataImagesLocal: function() {
      return this.dataImages || []
    }
  },
  mounted() {
    // set initial selectedImage
    this.setInitialSelection()
  },
  methods: {
    classThumbnail(selectedId, imageId) {
      const baseClass = `${this.rootClass}__thumbnail`
      if (selectedId === imageId) {
        return `${baseClass} ${baseClass}${this.activeClass}`
      }
      return `${baseClass}`
    },
    classThumbnailMultiple(id) {
      const baseClass = `${this.rootClass}__thumbnail`
      const baseMultipleClass = `${baseClass} is--multiple`
      if (this.isExistInArray(id)) {
        return `${baseMultipleClass} ${baseClass}${this.activeClass}`
      }
      return `${baseMultipleClass}`
    },
    onSelectImage(objectImage) {
      this.singleSelected = Object.assign({}, this.singleSelected, objectImage)
      this.$emit('onselectimage', objectImage)
    },
    onSelectImageDelete(objectImage) {
      this.removeItem(this.dataImages, objectImage)
    },
    isExistInArray(id) {
      return this.multipleSelected.find(item => {
        return id === item.id
      })
    },
    removeItem(array, item) {
      for (var i in array) {
        if (array[i] === item) {
          array.splice(i, 1)
          break
        }
      }
    },
    removeFromSingleSelected() {
      this.singleSelected = {}
      this.$emit('onselectimage', {})
    },
    removeFromMultipleSelected(id, dontFireEmit) {
      this.multipleSelected = this.multipleSelected.filter(item => {
        return id !== item.id
      })
      if (!dontFireEmit) {
        this.$emit('onselectmultipleimage', this.multipleSelected)
      }
    },
    resetMultipleSelection() {
      this.multipleSelected = []
    },
    onSelectMultipleImage(objectImage) {
      if (!this.isExistInArray(objectImage.id)) {
        this.multipleSelected.push(objectImage)
      } else {
        this.removeFromMultipleSelected(objectImage.id, true)
      }

      this.$emit('onselectmultipleimage', this.multipleSelected)
    },
    setInitialSelection() {
      if (this.selectedImages) {
        if (!this.isMultiple && this.selectedImages.length === 1) {
          this.singleSelected = Object.assign({}, this.selectedImages[0])
        } else {
          this.multipleSelected = [].concat(this.selectedImages)
        }
      }
    }
  }
}
</script>

<style scoped>
.vue-select-image__wrapper {
  overflow: auto;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
}

.vue-select-image__item {
  margin: 0px 12px 12px 0px;
  float: left;
  display: flex;
}

.vue-select-image__thumbnail {
  padding: 6px;
  border: 1px solid #dddddd;

  display: block;
  padding: 4px;
  line-height: 20px;
  border: 1px solid #ddd;

  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  display: block;

  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
  -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);

  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.vue-select-image__thumbnail--selected {
  background: #0088cc;
}

.vue-select-image__img {
  -webkit-user-drag: none;
  display: block;
  position: relative;
  max-width: 153px;
  min-width: 153px;
  max-height: 153px;
  min-height: 153px;
  margin-right: auto;
  margin-left: auto;
}

.vue-select-image__lbl {
  line-height: 3;
}

@media only screen and (min-width: 1200px) {
  .vue-select-image__item {
    margin-left: 30px;
  }
}

.container {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  transition: background 0.5s ease;
}

.container:hover .overlay {
  background: rgba(0, 0, 0, 0.6);
}

.button {
  position: relative;
  opacity: 0;
  padding: 5px;
  cursor: pointer;
  transition: opacity 0.35s ease;
}

.container:hover .button {
  opacity: 1;
}
.inside-container {
  left: 0;
  position: absolute;
  text-align: center;
  bottom: 20px;
  width: 100%;
}
</style>
