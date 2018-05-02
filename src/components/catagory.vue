<template>
   
        <el-cascader :disabled="disabled" filterable v-model="categoryParent" :options="options" ></el-cascader>
    
</template>

<script>
export default {
  data() {
    return {
      categoryParent:[],
     
    };
  },
  props: ["treeData","disabled","initValue"],
  watch:{
      "categoryParent":function(val){
          this.$emit("change",val);
      },
      initValue:function(val){
          this.categoryParent=val;
      },
  },
  computed: {
    options: function() {
      function loopTree(tree) {
        let arr = [];
        let deepArrs = [null, arr];
        let deep = 1;
        let indexArr = arr;
        for (let i in tree) {
          let item = tree[i];
          if (deep == item.deep) {
            indexArr.push({
              label: item.name,
              value: item.id,
              children: null
            });
          } else if (deep < item.deep) {
            deep = item.deep;
            indexArr[indexArr.length - 1].children = [];
            deepArrs.push(indexArr[indexArr.length - 1].children);
            indexArr = indexArr[indexArr.length - 1].children;
            indexArr.push({
              label: item.name,
              value: item.id,
              children: null
            });
          } else if (deep > item.deep) {
            deep = item.deep;
            indexArr = deepArrs[item.deep];
            deepArrs.splice(deep + 1);
            indexArr.push({
              label: item.name,
              value: item.id,
              children: null
            });
          }
        }
        return arr;
      }
      return  [
        {
          label: "根分类",
          value: 0,
          children: loopTree(this.treeData)
        }
      ];
    }
  },
  methods: {}
};
</script>

<style  scoped>

</style>
