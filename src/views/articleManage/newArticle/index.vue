<template>
  <div style="margin-right:20px">
    <x-back></x-back>
    <el-card>
      <div slot="header">
        <span>新建文章</span>

      </div>
      <el-input v-model="article.title" placeholder="请输入文章标题"></el-input>
      <el-row style="margin-top:30px" type="flex" align="middle">
        <el-col :span="2">分类：</el-col>
        <el-col :span="20">
          <catagory-select @change="catagoryChange" :treeData="treeData"></catagory-select>
        </el-col>
      </el-row>

      <div style="margin-top:30px">
        <el-row type="flex" align="middle">
          <el-col :span="2">关键字：</el-col>
          <el-col :span="20">
            <el-select filterable style="width:100%" v-model="keywords" multiple placeholder="请选择">

              <el-option-group v-for="group in keywordsData" :key="group.categoryId" :label="group.categoryStr">
                <el-option v-for="item in group.keywords" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-option-group>

            </el-select>
          </el-col>
        </el-row>

      </div>
      <el-row style="margin-top:30px" type="flex" align="middle">
        <el-col :span="2">简介：</el-col>
        <el-col :span="20">
          <el-input type="textarea" :rows="2" placeholder="请输入简介" v-model="overviewText"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px" type="flex" align="middle">
        <el-col :span="2">缩略图：</el-col>
        <el-col :span="20">
          <el-upload class="avatar-uploader" name="image" action="https://127.0.0.1" :http-request="uploadPic" :show-file-list="false" :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>

      <div style="margin-top:30px">
        <div ref="toolbar-container"></div>
      </div>
      <el-button style="margin-top:15px" type="primary" @click="putData">发布文章</el-button>
    </el-card>
  </div>
</template>
<script>
import net from "@/net";
import config from "@/net/config";
const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");
export default {
  data() {
    return {
      article: {
        title: ""
      },
      treeData: [],
      catagory: [],
      keywords: [],
      keywordsData: [],
      overviewText: "",
      imageUrl: "",
      pic:""
    };
  },
  
  methods: {
    uploadPic(f){
       const data = new FormData();
      data.append("image", f.file);
      net
        .articleUpload(data)
        .then(response => {
          console.log(response);
          this.pic=response.path;
          f.onSuccess();
        })
        .catch(error => {
          f.onError();
          console.log("服务器错误");
        });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$message.success("上传成功！")
      
    },
    catagoryChange(value) {
      this.catagory = value;
    },
    putData() {
      const editor = window.editor;
      const data = editor.getData();
      const loading = this.$loading({
        lock: true,
        text: "执行中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      net
        .addarticle({
          keywords: this.keywords.join(","),
          title: this.article.title,
          content: data,
          categoryId: this.catagory[this.catagory.length - 1],
          description: this.overviewText,
          pic:this.pic
        })
        .then(data => {
          loading.close();
          if (data.code != "0000") {
            this.$message.error(data.msg);

            return;
          }
          this.$message.success("添加成功");
          this.$router.replace("/articleManage");
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          loading.close();
        });
    },
    getCatagory() {
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
          this.treeData = data.result;
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
          let arr = [];
          let keyArr = {};
          for (let i in data.result) {
            let item = data.result[i];
            if (
              keyArr[item.categoryStr] != undefined &&
              keyArr[item.categoryStr] != null
            ) {
              let index = keyArr[item.categoryStr];
              arr[index].keywords.push(item);
            } else {
              keyArr[item.categoryStr] = arr.length;
              arr.push({
                categoryStr: item.categoryStr,
                categoryId: item.categoryId,
                keywords: [item]
              });
            }
          }
          this.keywordsData = arr;
        })
        .catch(e => {
          this.$message.error(e.errorMsg);
          loading.close();
        });
    }
  },
  mounted() {
    this.getCatagory();
    this.querykeywords();
    ClassicEditor.create(this.$refs["toolbar-container"], {})
      .then(editor => {
        window.editor = editor;
        editor.plugins.get("FileRepository").createUploadAdapter = loader => {
          return new FileUploadAdapter(loader);
        };
      })
      .catch(error => {
        console.error(error);
      });
  }
};
class FileUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    const data = new FormData();
    data.append("image", this.loader.file);

    return new Promise((resolve, reject) => {
      net
        .articleUpload(data)
        .then(response => {
          console.log(response);
          resolve({
            default: decodeURIComponent(
              config.baseUrl + "/images/" + response.path
            )
          });
        })
        .catch(error => {
          reject("服务器错误");
        });
    });
  }

  abort(error) {
    console.log("服务器错误", error);
  }
}
</script>
<style scoped>
.avatar-uploader>>>.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader>>> .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


