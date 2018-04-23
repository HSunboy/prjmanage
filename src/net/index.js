import axios from "axios";
import config, { getErrorObj } from "./config"
import store from "@/store";
import Vue from "vue";
let nowCode="";
const axiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: 20000,
    withCredentials: true
});
function promiseFunc(path, params, needLogin) {
    if (needLogin) {
        if(!store.getUser()){
            location.replace("#/login")
            return;
        }
        params = params || {};
        params.headers = {
            token: store.getUser().token
        }
    }
    return new Promise(function (resolve, reject) {
        axiosInstance.get(path, params)
            .then(function (response) {

                resolve(response.data);
            })
            .catch(function (error) {
                let errorObj
                if (error.response) {
                    if(error.response.status=="401"){
                        location.replace("#/login")
                    }
                    errorObj = getErrorObj(error.response.status, error);
                } else {
                    errorObj = getErrorObj(null, error);
                }

                reject(errorObj);
            });
    });
}
function promiseFuncPost(path, params, needLogin,isUpload) {
    let headers={};
    if (needLogin) {
        if(!store.getUser()){
            location.replace("#/login")
            return;
        }
        headers = {
            token: store.getUser().token
        }
        if(isUpload){
            headers["content-type"]='multipart/form-data';
        }
    }
    return new Promise(function (resolve, reject) {
        axiosInstance.post(path, params,{headers})
            .then(function (response) {

                resolve(response.data);
            })
            .catch(function (error) {
                let errorObj
                if (error.response) {
                    if(error.response.status=="401"){
                        location.replace("/login")
                    }
                    errorObj = getErrorObj(error.response.status, error);
                } else {
                    errorObj = getErrorObj(null, error);
                }

                reject(errorObj);
            });
    });
}
const req = {
    "getAllResources": function (params) {


        return promiseFunc("/blogService/v1/resource/getallresources", params, true);

    },
    "login": function (params) {
        params.params.a=nowCode;
        return promiseFunc("/blogService/v1/sys/login", params);

    },
    "getAuth": function () {
        let random = Math.random();
        nowCode=random;
        return config.baseUrl + "/blogService/v1/sys/getcaptcha?a=" + random;
    },
    "newRole": function (params) {
        return promiseFuncPost("/blogService/v1/role/savesinglerole",params,true);
    },
    "getAllRoles":function(params){
        return promiseFunc("/blogService/v1/role/getall", params, true);
    },
    "editRole":function(params){
        return promiseFuncPost("/blogService/v1/role/editsinglerole",params,true);
    },
    "deleteRole":function(params){
        return promiseFunc("/blogService/v1/role/deleteroles", params, true);
    },
    "getRoleResource":function(params){
        return promiseFunc("/blogService/v1/resource/getroleresources", params, true);
    },
    assignReSource:function(params){
        return promiseFunc("/blogService/v1/resource/assignroletoresource",params,true)
    },
    "getAllAdmins":function(params){
        return promiseFunc("/blogService/v1/admin/getalladmins",params,true)
    },
    "addAdmin":function(params){
        return promiseFuncPost("/blogService/v1/admin/addadmin",params,true)
    },
    "getroleadmin":function(params){
        return promiseFunc("/blogService/v1/role/getroleadmin",params,true)
    },
    "signadminrole":function(params){
        return promiseFunc("/blogService/v1/role/signadminrole",params,true)
    },
    "deleteAdmin":function(params){
        return promiseFunc("/blogService/v1/admin/deleteadmin",params,true)
    },
    changePassword:function(params){
        return promiseFunc("/blogService/v1/admin/changepassword",params,true)
    },
    resetPassword:function(params){
        return promiseFunc("/blogService/v1/admin/resetpassword",params,true)
    },
    logout:function(params){
        return promiseFunc("/blogService/v1/sys/logout",params,true)
    },
    addCategory:function(params){
        return promiseFuncPost("/blogService/v1/category/addcategory",params,true)
    },
    getAllCatagory:function(params){
        return promiseFunc("/blogService/v1/category/getcategory",params,true)
    },
    querykeywords:function(params){
        return promiseFunc("/blogService/v1/keywords/querykeywords",params,true)
    },
    deleteCatagory(params){
        return promiseFunc("/blogService/v1/category/deletecategory",params,true)
    },
    deletekeyWords(params){
        return promiseFunc("/blogService/v1/keywords/deletekeyWords",params,true)
    },
    addkeywords(params){
        return promiseFuncPost("/blogService/v1/keywords/addkeywords",params,true)
    },
    articleUpload(params){
        return promiseFuncPost("/blogService/v1/image/uploadsingleimage",params,true,true)
    },
    addarticle(params){
        return promiseFuncPost("/blogService/v1/article/addarticle",params,true)
    },
    deletearticle(params){
        return promiseFunc("/blogService/v1/article/deletearticle",params,true)
    },
    getarticle(params){
        return promiseFunc("/blogService/v1/article/getarticle",params,true)
    },
}
export default req;
export const headIcon=config.baseUrl+"/images/default.jpeg";