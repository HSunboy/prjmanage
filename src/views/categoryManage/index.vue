<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>分类管理</span>
                <el-button @click="newCategoryShow" style="float: right; padding: 3px 0" type="text">新增分类</el-button>
            </div>

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
import net from "@/net"
export default {
  data() {
    return {
      newCategoryBoxShow: false,
      form: {
        categoryName: "",
        categoryParent: [
            
           
        ]
      },
      options: [
      ],
      formLabelWidth: "120px"
    };
  },
  methods: {
    newCategoryShow() {
      this.form = {
        categoryName: "",
        categoryParent: []
      };
      this.newCategoryBoxShow = true;
      if(this.options.length<1){
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
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          loading.close();
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
          name: this.categoryName,
          tid: this.form.categoryParent
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
    }
  },
  mounted() {
      this.getAllCatagory();
  }
};
</script>
<style scoped>

</style>
