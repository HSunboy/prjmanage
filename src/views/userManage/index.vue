<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>管理员管理</span>
                <el-button @click="newAdminShow" style="float: right; padding: 3px 0" type="text">添加管理员</el-button>
            </div>
            <el-table :loading="loading" :data="tableData" style="width: 100%">
                <el-table-column prop="id" label="编号" width="180">
                </el-table-column>
                <el-table-column prop="account" label="账号" width="180">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180">
                </el-table-column>
                <el-table-column prop="leaderName" label="上级管理员" width="180">
                </el-table-column>
                <el-table-column prop="role.roleName" label="角色">
                    <template slot-scope="scope">

                        {{ scope.row.role.roleName||"暂无角色" }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="250">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="resetPassword(scope.row.id)">重置密码</el-button>
                        <el-button type="danger" @click="deleteAdmin(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="新增管理员" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="请输入新增管理员用户名" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级管理员" :label-width="formLabelWidth">
                    <el-select v-model="form.leaderId" placeholder="请选择上级管理员">
                        <el-option v-for="admin in tableData" :label="admin.account" :value="admin.id" :key="admin.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="newAdmin">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import net from "@/net";
export default {
  data() {
    return {
      tableData: [],
      loading: false,
      dialogFormVisible: false,
      form: {
        name: "",
        leaderId: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    resetPassword(id) {
      const loading = this.$loading({
        lock: true,
        text: "执行中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      net
        .resetPassword({
          params: {
            adminId: id
          }
        })
        .then(data => {
          loading.close();
          if (data.code != "0000") {
            this.$message.error(data.msg);
            return;
          }
          this.$message.success("操作成功");
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          loading.close();
        });
    },
    deleteAdmin(id) {
      const loading = this.$loading({
        lock: true,
        text: "执行中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      net
        .deleteAdmin({
          params: {
            adminId: id
          }
        })
        .then(data => {
          loading.close();
          if (data.code != "0000") {
            this.$message.error(data.msg);
            return;
          }
          this.$message.success("操作成功");
          this.getAllAdmins();
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          loading.close();
        });
    },
    getAllAdmins() {
      this.loading = true;
      net
        .getAllAdmins()
        .then(data => {
          this.loading = false;
          if (data.code != "0000") {
            this.$message.error(data.msg);
            return;
          }
          let arr = [];
          for (let i = 0; i < data.result.length; i++) {
            let item = data.result[i];
            arr.push({
              id: item.adminId,
              account: item.name,
              createTime: item.createAt,
              role: item.roleDto,
              leaderName: item.leaderName
            });
          }
          this.tableData = arr;
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          this.loading = false;
        });
    },
    newAdminShow() {
      this.dialogFormVisible = true;
      this.form.name = "";
      this.form.leaderId = "";
    },
    newAdmin() {
      const loading = this.$loading({
        lock: true,
        text: "执行中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      net
        .addAdmin({
          leaderId: this.form.leaderId,
          name: this.form.name
        })
        .then(data => {
          loading.close();
          this.dialogFormVisible = false;
          if (data.code != "0000") {
            this.$message.error(data.msg);
            return;
          }
          this.$message.success("操作成功！");
          this.getAllAdmins();
        })
        .catch(e => {
          loading.close();
          this.$message.error(e.errorMsg);
          this.dialogFormVisible = false;
        });
    }
  },

  mounted() {
    this.getAllAdmins();
  }
};
</script>
<style scoped>
.box-card {
  margin-right: 20px;
}
</style>


