
<template>
  <div style="margin-right:20px">
    <el-card>
      <div slot="header">
        <span>文章列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="newArticle">新建文章</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="title" label="文章标题" width="100">
        </el-table-column>
        <el-table-column prop="pic" label="缩略图">
          <template slot-scope="scope">
            <img style="width:80%;" :src="scope.row.pic" />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="文章描述" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.description" placement="top-start">
              <span class="des">{{scope.row.description}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="categoryStr" label="分类">
        </el-table-column>
        <el-table-column prop="numTypeStr" label="创建来源">
        </el-table-column>
        <el-table-column prop="createAt" label="日期" width="180">
        </el-table-column>
        <el-table-column  label="精品" width="80">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.quality"
              @change="changeStatus($event,scope.row,0)"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
       <el-table-column  label="置顶" width="80">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.settop"
              @change="changeStatus($event,scope.row,1)"
              :active-value="1"
              :inactive-value="0"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="审核" width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.auditType==0?true:false">
              <el-button type="success" icon="el-icon-check" circle @click="changeStatus(1,scope.row,2)"></el-button>
              <el-button type="danger" icon="el-icon-close" circle @click="changeStatus(2,scope.row,2)"></el-button>
            </template>
            <template v-else>
             <span class="audit-text">{{scope.row.auditTypeStr}}</span>
            </template>
           
          </template>
        </el-table-column>
        <el-table-column  label="详情" width="100">
          <template slot-scope="scope">
            
              <el-button @click="toDetail(scope.row.id)" type="text">查看详情</el-button>
            
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import net from "@/net";
export default {
  data() {
    return {
      tableLoading: true,
      tableData: []
    };
  },
  methods: {
    newArticle() {
      this.$router.push("articleManage/newArticle");
    },
    toDetail(id){
      this.$router.push({
        path:"articleManage/editArticle",
        query:{
          id:id
        }
      })
    },
    changeStatus(e,row,updateAction){
      
      this.tableLoading=true
      net.updateArticle(
        {
          params:{
            articleId:row.id,
            updateType:updateAction,
            updateAction:e
          }
        }
      )
      .then(
        (data)=>{
          this.tableLoading = false;
          if (data.code != "0000") {
            this.$message.error(data.msg);
            return;
          }
          this.$message.success("操作成功");
          this.getArticle();
        }
      ).catch(e => {
          this.$message.error(e.errorMsg);
          this.tableLoading = false;
        });
    },
    getArticle() {
      this.tableLoading = true;
      net
        .getarticle({
          pageNo: 1,
          pageSize: 9999
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
<style scoped>
  .des{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .audit-text{
    color:#000;
  }
</style>


