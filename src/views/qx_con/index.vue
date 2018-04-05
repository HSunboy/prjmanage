<template>
  <div>
    <el-dialog
        title="新建角色"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doNewRole">确 定</el-button>
        </span>

        <el-input v-model="newRole.name" placeholder="请输入角色名"></el-input>
        <el-input type="textarea" style="margin-top:10px;" v-model="newRole.description" placeholder="请输入描述"></el-input>
    </el-dialog>
    <el-dialog
        title="编辑角色"
        :visible.sync="dialogVisible_edit"
        width="30%"
        >
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_edit = false">取 消</el-button>
            <el-button type="primary" @click="doEditRole">确 定</el-button>
        </span>

        <el-input v-model="editRole.name" placeholder="请输入角色名"></el-input>
        <el-input type="textarea" style="margin-top:10px;" v-model="editRole.description" placeholder="请输入描述"></el-input>
    </el-dialog>
    
    <el-row >
        <el-col :span="14">
            <el-card >
                <div slot="header" >
                    <span>角色分配</span>
                    <el-button @click="newRoleShow" style="float: right; padding: 3px 0" type="text">新建角色</el-button>
                </div>
                <el-table
                    :data="tableData"
                    >
                    <el-table-column
                        prop="roleName"
                        label="角色名"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="description"
                        label="描述"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="deal"
                        width="220px"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-tooltip  effect="dark" content="编辑" placement="top">
                                <el-button
                                icon="el-icon-edit"
                                size="mini"
                                @click="editRoleShow(scope.row)"
                                circle></el-button>
                            </el-tooltip>
                            <el-tooltip  effect="dark" content="授权" placement="top">
                                <el-button
                                type="success"
                                icon="el-icon-more"
                                size="mini"
                                @click="editResource(scope.row)"
                                circle></el-button>
                            </el-tooltip>
                            <el-tooltip  effect="dark" content="分配用户" placement="top">
                                <el-button
                                type="primary"
                                icon="el-icon-circle-plus-outline"
                                size="mini"
                                @click="dispatchAdmin(scope.row)"
                                circle></el-button>
                            </el-tooltip>
                            <el-tooltip   effect="dark" content="删除" placement="top">
                                <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="deleteRole(scope.row)"
                                circle></el-button>
                            </el-tooltip>
                            
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>
        <el-col :offset="1"  :span="8">
            <el-card >
                <div slot="header" >
                    <span>权限分配 {{resourceEdit.name}}</span>
                    <el-button v-if="resourceEdit.id" @click="cancelEditResource" style="float: right; padding: 3px 0" type="text">取消</el-button>
                    <el-button v-if="resourceEdit.id" @click="getTreeNode" style="float: right; padding: 3px 0" type="text">保存</el-button>
                </div>
                <el-tree
                    ref="tree"
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :default-expand-all="true"
                    :default-checked-keys="resourceEdit.resourceList"
                    :props="defaultProps">
                </el-tree>
            </el-card>
        </el-col>
    </el-row>
    
  </div>
</template>

<script>
  import net from "@/net";
  export default {
    data() {
      return {
        newRole: {
          name: "",
          description: ""
        },
        editRole: {
          id: "",
          name: "",
          description: ""
        },
        resourceEdit: {
          id: "",
          name: "",
          resourceList: []
        },
        dialogVisible: false,
        dialogVisible_edit: false,
        tableData: [],
        data: null,
        defaultProps: {
          children: "children",
          label: "label"
        }
      };
    },
    watch: {
      resourceEdit: function() {
        this.getAllReSource();
      }
    },
    methods: {
      cancelEditResource() {
        this.resourceEdit = {
          id: "",
          name: "",
          resourceList: []
        };
      },
      dispatchAdmin() {
        const loading = this.$loading({
          lock: true,
          text: "加载中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .getAllAdmins({
            params: {
              pageNo: 1,
              pageSize: 20
            }
          })
          .then(data => {
            loading.close();
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
          })
          .catch(e => {
            this.$message.error(e.errorMsg);
            loading.close();
          });
      },
      editResource(row) {
        const loading = this.$loading({
          lock: true,
          text: "加载中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .getRoleResource({
            params: {
              roleId: row.id
            }
          })
          .then(data => {
            loading.close();
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            let resource = data.result.resourceDtos;
            let arr = [];
            for (let i = 0; i < resource.length; i++) {
              arr.push(resource[i].id);
            }

            this.resourceEdit = {
              id: row.id,
              name: row.roleName,
              resourceList: arr
            };
          })
          .catch(e => {
            this.$message.error(e.errorMsg);
            loading.close();
          });
      },
      deleteRole(row) {
        net
          .deleteRole({
            params: {
              roleIds: row.id
            }
          })
          .then(data => {
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.$message.success("删除");
            this.getAllRole();
          })
          .catch(e => {
            this.$message.error(e.errorMsg);
          });
      },
      newRoleShow() {
        this.newRole.name = "";
        this.newRole.description = "";
        this.dialogVisible = true;
      },
      editRoleShow(row) {
        this.editRole = {
          id: row.id,
          name: row.roleName,
          description: row.description
        };
        this.dialogVisible_edit = true;
      },
      doEditRole() {
        let id = this.editRole.id;
        let name = this.editRole.name;
        let description = this.editRole.description;
        net
          .editRole({
            id: id,
            roleName: name,
            roleDesc: description
          })
          .then(data => {
            this.dialogVisible_edit = false;
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.$message.success("编辑成功");
            this.getAllRole();
          })
          .catch(e => {
            this.dialogVisible_edit = false;
            this.$message.error(e.errorMsg);
          });
      },
      doNewRole() {
        let name = this.newRole.name;
        let description = this.newRole.description;
        net
          .newRole({
            roleDesc: description,
            roleName: name
          })
          .then(data => {
            this.dialogVisible = false;
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.$message.success("新增成功");
            this.getAllRole();
          })
          .catch(e => {
            this.dialogVisible = false;
            this.$message.error(e.errorMsg);
          });
      },
      getTreeNode() {
        let arr = this.$refs.tree.getCheckedKeys(true);
        const loading = this.$loading({
          lock: true,
          text: "加载中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .assignReSource({
            params: {
              roleId: this.resourceEdit.id,
              resources: arr.join(",")
            }
          })
          .then(data => {
            loading.close();
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.resourceEdit = {
              id: "",
              name: "",
              resourceList: []
            };
            this.$message.success("分配成功");
          })
          .catch(e => {
            loading.close();
            this.$message.error(e.errorMsg);
          });
      },
      getAllReSource() {
        net
          .getAllResources()
          .then(data => {
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            let exchangeData = [];

            let result = data.result;
            for (let i = 0; i < result.length; i++) {
              let item = result[i];
              let item_child = [];
              for (let j = 0; j < item.resourceDtoList.length; j++) {
                let itemchild = item.resourceDtoList[j];
                item_child.push({
                  id: itemchild.id,
                  label: itemchild.funcActionName,
                  disabled: this.resourceEdit.id ? false : true
                });
              }
              exchangeData.push({
                id: item.id,
                label: item.funcActionName,
                children: item_child,
                disabled: this.resourceEdit.id ? false : true
              });
            }
            this.data = exchangeData;
          })
          .catch(e => {
            this.$message.warning(e.errorMsg);
          });
      },
      getAllRole() {
        net
          .getAllRoles()
          .then(data => {
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            let arr = [];
            for (let i = 0; i < data.result.length; i++) {
              let item = data.result[i];
              arr.push({
                id: item.id,
                roleName: item.roleName,
                description: item.roleDesc
              });
            }
            this.tableData = arr;
          })
          .catch(e => {
            this.$message.warning(e.errorMsg);
          });
      }
    },
    mounted() {
      this.getAllRole();
      this.getAllReSource();
    }
  };
</script>

<style scoped>

</style>
