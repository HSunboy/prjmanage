<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>关键词管理</span>
                <el-button @click="newKeyWords" style="float: right; padding: 3px 0" type="text">添加关键词</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="keywordName" label="关键词名" width="180">
                </el-table-column>
                <el-table-column prop="category" label="所属分类" width="180">
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
                <el-form-item label="分类名称" :label-width="formLabelWidth">
                    <el-input v-model="form.categoryName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父分类" :label-width="formLabelWidth">
                    <el-cascader v-model="form.categoryParent" :options="options" change-on-select></el-cascader>
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
import net from "@/net"
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
        categoryName: "",
        categoryParent: []
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
      this.getAllCatagory();
    },
    deleteKeyWords(id) {
      console.log(id);
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
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          loading.close();
        });
    },
    newKeyWord() {
        
    }
  },
  mounted() {}
};
</script>
<style scoped>

</style>
