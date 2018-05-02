<template>
    <div style="margin-right:20px">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>分类管理</span>
                <el-button @click="newCategoryShow" style="float: right; padding: 3px 0" type="text">新增分类</el-button>
            </div>
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="id"
                label="分类id"
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="分类名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="tname"
                label="父分类">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope" >
                  <el-button type="danger" @click="deleteCatagory(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="新增分类" :visible.sync="newCategoryBoxShow">
            <el-form :model="form">
                <el-form-item label="分类名称" :label-width="formLabelWidth">
                    <el-input v-model="form.categoryName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父分类" :label-width="formLabelWidth">
                    <el-cascader v-model="form.categoryParent" :options="options" change-on-select></el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newCategoryBoxShow = false">取 消</el-button>
                <el-button type="primary" @click="newCategory">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
  import net from "@/net";
  import index from "vue";
  export default {
    data() {
      return {
        newCategoryBoxShow: false,
        form: {
          categoryName: "",
          categoryParent: []
        },
        options: [],
        formLabelWidth: "120px",
        tableData: []
      };
    },
    methods: {
      newCategoryShow() {
        this.form = {
          categoryName: "",
          categoryParent: []
        };
        this.newCategoryBoxShow = true;
        if (this.options.length < 1) {
          this.getAllCatagory();
        }
      },
      getAllCatagory() {
        const loading = this.$loading({
          lock: true,
          text: "执行中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .getAllCatagory()
          .then(data => {
            loading.close();
            if (data.code != "0000") {
              this.$message.error(data.msg);

              return;
            }
            this.tableData = data.result;
            function loopTree(tree) {
              let arr = [];
              let deepArrs = [null, arr];
              let deep = 1;
              let indexArr = arr;
              for (let i in tree) {
                let item = tree[i];
                if (deep == item.deep) {
                  indexArr.push({
                    label: item.name,
                    value: item.id,
                    children: null
                  });
                } else if (deep < item.deep) {
                  deep = item.deep;
                  indexArr[indexArr.length - 1].children = [];
                  deepArrs.push(indexArr[indexArr.length - 1].children);
                  indexArr = indexArr[indexArr.length - 1].children;
                  indexArr.push({
                    label: item.name,
                    value: item.id,
                    children: null
                  });
                } else if (deep > item.deep) {
                  deep = item.deep;
                  indexArr = deepArrs[item.deep];
                  deepArrs.splice(deep + 1);
                  indexArr.push({
                    label: item.name,
                    value: item.id,
                    children: null
                  });
                }
              }
              return arr;
            }
            this.options = [{
              label:"根分类",
              value:0,
              children:loopTree(data.result)
            }];
          })
          .catch(e => {
            loading.close();
            this.$message.error(e.errorMsg);
            
          });
      },
      newCategory() {
        const loading = this.$loading({
          lock: true,
          text: "执行中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .addCategory({
            name: this.form.categoryName,
            tid: this.form.categoryParent[this.form.categoryParent.length - 1]
          })
          .then(data => {
            loading.close();
            this.newCategoryBoxShow = false;
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.$message.success("操作成功");
            this.getAllCatagory();
          })
          .catch(e => {
            this.newCategoryBoxShow = false;
            this.$message.error(e.errorMsg);
            loading.close();
          });
      },
      deleteCatagory(id) {
        const loading = this.$loading({
          lock: true,
          text: "执行中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .deleteCatagory({
            params:{
              categoryId: id
            }
            
          })
          .then(data => {
            loading.close();
            
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.$message.success("操作成功");
            this.getAllCatagory();
          })
          .catch(e => {
            this.$message.error(e.errorMsg);
            loading.close();
          });
      }
    },
    mounted() {
      this.getAllCatagory();
    }
  };
</script>
<style scoped>

</style>
