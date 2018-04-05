<template>
  <div class="login-box" >
    <div class="back"></div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="12" :xs="{span:16}" :lg="{span:8}">
        <el-card>
          <div slot="header">
            <span>登录</span>
          </div>
           
             <el-input v-model="userName" placeholder="请输入账号"></el-input>
             <el-input style="margin-top:10px;" type="password" v-model="passWord" placeholder="请输入密码"></el-input>
             <el-input  style="margin-top:10px;" v-model="authCode" placeholder="请输入验证码"></el-input>
             <img @click="getAuthCode" style="width:80%;height:80px;cursor: pointer;" :src="authPic" class="mid-top10" />
            
             <el-button  :loading="loading" class="mid-top10"  @click="login" type="primary" round>登录</el-button>
            
             
            
        </el-card>
      </el-col>
    </el-row>
      
      
  </div>
</template>

<script>
  import net from "@/net/index";
  import config from "@/net/config"
  import store from "@/store"
  export default {
      data(){
        return {
          userName:"",
          passWord:"",
          authCode:"",
          authPic:"",
          loading:false
        }
      },
      methods:{
        getAuthCode(){
          
          this.authPic=net.getAuth();
        },
        login(){
          this.loading=true;
          net.login({
            params:{
              username:this.userName,
              password:this.passWord,
              code:this.authCode
            }
          }).then((data)=>{
            this.loading=false;
            if(data.code!=="0000"){
              this.getAuthCode();
              this.$message.error(data.msg);
              return;
            }
            store.setUser(data.result);
            this.$router.replace("/");

          }).catch(()=>{
            this.loading=false;
          })
        }
      },
      mounted(){
        this.getAuthCode();
      }

    
  };
</script>

<style scoped>
 .login-box{
   margin-top:150px;
 }
 .mid-top10{
   margin:0 auto;
   margin-top:10px;
   display:block;
   width:80%;
 }
 .back{
   position: fixed;
   top:0px;
   left:0px;
   right: 0px;
   bottom: 0px;
   background: #F0F8FF;
 }
</style>
