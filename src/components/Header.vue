<template>
  <div>
    <span class="site-title">Block</span>
    <div class="header-items">
      <img :src="icon" class="admin-icon" @error="iconError" />
      <span class="admin">admin</span>
      <span style="padding:0 10px;color:#FF7200;margin-right:30px;">管理员</span>
      <div class="header-item">
        <i class="el-icon-menu item-big"></i> 网站首页</div>
      <div class="header-item" @click="changePasswordShow">
        <i class="el-icon-edit item-big"></i> 密码修改</div>
      <div class="header-item" @click="logout">
        <i class="el-icon-close item-big"></i> 退出</div>
    </div>
    <el-dialog :append-to-body="true" title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="旧密码" :label-width="formLabelWidth">
          <el-input v-model="form.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.newPasswordConfirm" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="changePassword" type="primary" >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import net from "@/net"
import store from "@/store"
import defaultImg from "@/assets/admin-icon.png"
import {headIcon} from "@/net"
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        newPasswordConfirm: "",
        newPassword: "",
        oldPassword: ""
      },
      icon:headIcon,
      formLabelWidth: "120px"
    };
  },
  methods: {
    logout(){
      net.logout().catch(
        (e)=>{
          console.log(e)
        }
      );
      store.clearUser();
      this.$router.replace("/login");

    },
    iconError(){
      this.icon=defaultImg;
    },
    changePasswordShow() {
      this.form = {
        newPasswordConfirm: "",
        newPassword: "",
        oldPassword: ""
      };
      this.dialogFormVisible = true;
    },
    changePassword() {
      if (this.form.newPasswordConfirm != this.form.newPassword) {
        this.$message.warning("请确保两次密码一致");
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      net
        .changePassword({
          params: {
            oldPassword: this.form.oldPassword,
            newPassword: this.form.newPassword
          }
        })
        .then(data => {
          loading.close();
          if (data.code != "0000") {
            this.$message.error(data.msg);
            return;
          }
          this.dialogFormVisible=false;
          this.$message.success("修改成功,请重新登陆");
          store.clearUser();
          this.$router.replace("/login")
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          loading.close();
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.site-title {
  font-size: 45px;
  font-weight: bolder;
  line-height: 65px;
  padding-left: 10px;
  color: rgba(243, 243, 243, 0.918);
  letter-spacing: 5px;
}
.header-items {
  float: right;
  height: 65px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
  .header-item {
    cursor: pointer;
    height: 20px;
    color: #dcdcdc;
    font-weight: 400;
    font-size: 15px;
    padding: 0 10px;
    margin-right: 5px;
  }
}
.header-item:hover {
  color: #fff;
}
.item-big {
  font-size: 20px;
  position: relative;
  top: 3px;
}
.admin-icon {
  width: 42px;
  height: 42px;
  border-radius: 100%;
}
.admin:hover {
  color: #fff;
}
.admin {
  padding: 0 12px;
  color: #999;
}
</style>
