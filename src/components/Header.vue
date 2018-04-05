<template>
  <div>
    <span class="site-title">Block</span>
    <div class="header-items">
      <img src="~../assets/admin-icon.png" class="admin-icon" />
      <span class="admin" >admin</span>
      <span style="padding:0 10px;color:#FF7200;margin-right:30px;">管理员</span>
      <div class="header-item"><i class="el-icon-menu item-big"></i> 网站首页</div>
      <div class="header-item"><i class="el-icon-edit item-big"></i> 密码修改</div>
      <div class="header-item"><i class="el-icon-close item-big"></i> 退出</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
       
      };
    },
    methods: {
      
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .site-title{
    font-size:45px;
    font-weight: bolder;
    line-height: 65px;
    padding-left:10px;
    color:rgba(243, 243, 243, 0.918);
    letter-spacing: 5px;
  }
  .header-items{
    float: right;
    height: 65px;
    display: flex;
    flex-direction:row;
    align-items:center;
    padding-right:20px;
    .header-item{
      cursor: pointer;
      height:20px;
      color:#dcdcdc;
      font-weight:400;
      font-size: 15px;
      padding:0 10px;
      margin-right:5px;
    }
  }
  .header-item:hover{
    color:#fff;
  }
  .item-big{
    font-size:20px;
    position: relative;
    top:3px;
  }
  .admin-icon{
    width:42px;
    height:42px;
    border-radius: 100%;
  }
  .admin:hover{
    color:#fff;
  }
  .admin{
    padding:0 12px;
    color:#999;
  }
</style>
