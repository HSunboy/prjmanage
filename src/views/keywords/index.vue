<template>
    <div>
        <el-card class="box-card">
          
            <div slot="header" class="clearfix">
                <span>关键词管理</span>
                <el-button @click="newKeyWords" style="float: right; padding: 3px 0" type="text">添加关键词</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="关键词名" width="180">
                </el-table-column>
                <el-table-column prop="categoryStr" label="所属分类" width="180">
                </el-table-column>
                <el-table-column label="操作" min-width="150px">
                    <template slot-scope="scope">
                        <el-button @click="deleteKeyWords(scope.row.id)" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="新增关键词" :visible.sync="newKeywordBoxShow">
            <el-form :model="form">
                <el-form-item label="关键词名称" :label-width="formLabelWidth">
                    <el-input v-model="form.keywordsName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属分类" :label-width="formLabelWidth">
                    <el-cascader v-model="form.categoryId" :options="options" change-on-select></el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newKeywordBoxShow = false">取 消</el-button>
                <el-button type="primary" @click="newKeyWord">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import net from "@/net";
  export default {
    data() {
      return {
        tableData: [
          {
            id: "1",
            category: "category",
            keywordName: "学术"
          }
        ],
        newKeywordBoxShow: false,
        form: {
          keywordsName: "",
          categoryId: []
        },
        formLabelWidth: "120px",
        options: []
      };
    },
    methods: {
      newKeyWords() {
        this.form = {
          categoryName: "",
          categoryParent: []
        };
        this.newKeywordBoxShow = true;
        this.querykeywords();
        this.getAllCatagory();
      },
      deleteKeyWords(id) {
        const loading = this.$loading({
          lock: true,
          text: "执行中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .deletekeyWords({
            params: {
              keywordsIds: id
            }
          })
          .then(data => {
            loading.close();

            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.$message.success("操作成功");
            this.querykeywords();
          })
          .catch(e => {
            this.$message.error(e.errorMsg);
            loading.close();
          });
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
            this.$message.error(e.errorMsg);
            loading.close();
          });
      },
      querykeywords() {
        const loading = this.$loading({
          lock: true,
          text: "执行中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .querykeywords({
            params: {
              pageNo: 1,
              pageSize: 999
            }
          })
          .then(data => {
            loading.close();
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.tableData = data.result;
          })
          .catch(e => {
            this.$message.error(e.errorMsg);
            loading.close();
          });
      },
      newKeyWord() {
        const loading = this.$loading({
          lock: true,
          text: "执行中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        net
          .addkeywords({
            name: this.form.keywordsName,
            categoryId: this.form.categoryId[this.form.categoryId.length - 1]
          })
          .then(data => {
            loading.close();
            this.newKeywordBoxShow = false;
            if (data.code != "0000") {
              this.$message.error(data.msg);
              return;
            }
            this.$message.success("操作成功");
            this.querykeywords();
          })
          .catch(e => {
            this.newKeywordBoxShow = false;
            this.$message.error(e.errorMsg);
            loading.close();
          });
      }
    },
    mounted() {
      this.querykeywords();
    }
  };
</script>
<style scoped>

</style>
