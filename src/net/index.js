import axios from "axios";
import config, { getErrorObj } from "./config"
import store from "@/store";
import Vue from "vue";
const axiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: 10000,
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
function promiseFuncPost(path, params, needLogin) {
    let headers={};
    if (needLogin) {
        if(!store.getUser()){
            location.replace("#/login")
            return;
        }
        headers = {
            token: store.getUser().token
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
        return promiseFunc("/blogService/v1/sys/login", params);

    },
    "getAuth": function () {
        let random = Math.random();
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
    }
}
export default req;