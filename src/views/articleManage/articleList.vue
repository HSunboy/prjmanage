
<template>
    <div style="margin-right:20px">
        <el-card>
            <div slot="header">
                <span>卡片名称</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="newArticle">新建文章</el-button>
            </div>
            1212
        </el-card>
    </div>
</template>
<script>
import net from "@/net";
export default {
  data() {
    return {
      tableLoading: false,
      tableData: []
    };
  },
  methods: {
    newArticle() {
      this.$router.push("articleManage/newArticle");
    },
    getArticle() {
      this.tableLoading = true;
      net
        .getarticle({
          params: {
            pageNo: 1,
            pageSize: 9999
          }
        })
        .then(data => {
          this.tableLoading = false;
          if (data.code != "0000") {
            this.$message.error(data.msg);
            return;
          }
          this.tableData = data.result;
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          this.tableLoading = false;
        });
    }
  },
  mounted() {
    this.getArticle();
  }
};
</script>
<style>

</style>


