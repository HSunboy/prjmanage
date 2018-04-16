<template>
    <div>

        <template v-for="item in treeData">
            
            <category-tree :key="item.id" :treeData="item.children"></category-tree>

        </template>

    </div>
</template>
<script>
export default {
  name: "categoryTree",
  data() {
    return {};
  },
  props: ["treeData"],
  computed:{
      tableData:function(){
          

      }
  },
  methods: {},
  mounted() {}
};
</script>
<style scoped>

</style>
