<template>
  <div class="hello">
      helloworld
  </div>
</template>

<script>
  export default {
    data() {
      return {
        num1: 5
      };
    },
    methods: {
      handleChange(value) {
        console.log(value);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .test {
    color: #333;
    .p {
      color: #666;
    }
  }
</style>
