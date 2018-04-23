<template>
    <div>
        
                <el-menu
                :default-active="nowView"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                @select="selectMenu"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>内容管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="categoryManage">分类管理</el-menu-item>
                            <el-menu-item index="keywords">关键词管理</el-menu-item>
                            <el-menu-item index="articleManage">文章管理</el-menu-item>
                            <el-menu-item index="1-1">导航管理</el-menu-item>
                            <el-menu-item index="1-2">板块管理</el-menu-item>
                            <el-menu-item index="1-3">内容管理</el-menu-item>
                            <el-menu-item index="1-4">评论管理</el-menu-item>
                        </el-menu-item-group>
                        
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>综合管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1">会员管理</el-menu-item>
                            <el-menu-item index="2-2">图片管理</el-menu-item>
                            <el-menu-item index="2-3">友情链接</el-menu-item>
                            <el-menu-item index="2-4">积分管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>系统管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/userManage">人员控制</el-menu-item>
                            <el-menu-item index="/qx-con">权限控制</el-menu-item>
                            <el-menu-item index="3-1">管理修改</el-menu-item>
                            <el-menu-item index="3-2">网站配置</el-menu-item>
                            <el-menu-item index="3-3">清除缓存</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>应用中心</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="4-1">主题模版</el-menu-item>
                            <el-menu-item index="4-2">疑难问答</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    
                </el-menu>
           
    </div>
</template>

<script>
    export default {
      data() {
        return {
            nowView:""
        };
      },
      mounted(){
          let pathName=this.$route.path;
          
          if(pathName){
              let pathArr=/^(\/[^\/]+)([\/]?.*)$/.exec(pathName);
              
              if(pathArr&&pathArr.length>1){
                this.nowView=pathArr[1].substring(1)
              }

          }
      },
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        },
        selectMenu(index,indexPath){
            this.$router.push("/"+index)
        }
      }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
