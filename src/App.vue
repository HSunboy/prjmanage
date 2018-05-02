<template>
  <div >
   
      <div class="x-header" style="z-index:2000">
        <Header></Header>
      </div>
     
        <div class="menu-box">
          <Menu></Menu>
        </div>

        <div class="main-box">
          <router-view/>
        </div>

    
  </div>
</template>

<script>
import Header from '@/components/Header'
import Menu from '@/components/Menu'
  export default {
    name: "App",
    components:{
      Header:Header,
      Menu:Menu
    }
  };
</script>

<style>
  *{
    padding:0;
    margin:0;
    border:0;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .x-header{
    padding: 0 0;
    background: #282B33;
    height:65px;
    position: fixed;
    top:0px;
    left:0px;
    right:0px;
  }
  .menu-box{
    position: fixed;
    top:65px;
    bottom:0px;
    left:0px;
    width:200px;
    background: rgb(84, 92, 100);
    overflow-y: auto;
    overflow-x: hidden;
    
   
  }
  .el-menu{
    border-right: 0;
  }
  .main-box{
    padding-top:85px;
    padding-left:220px;
    
  }
</style>
