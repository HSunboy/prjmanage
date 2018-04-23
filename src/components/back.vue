<template>
    <div class="back-box">
        
        <span class="back-header" @click="back" >
            <i class="el-icon-arrow-left back-icon"></i>返回
        </span>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
      back(){
          this.$router.go(-1)
      }
  }
};
</script>

<style  scoped>

</style>
