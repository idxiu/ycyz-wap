/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-09 08:36:40
 * @LastEditTime: 2019-10-09 08:36:40
 * @LastEditors: your name
 */
import axios from "./axios";
import api from "./api";

function getUserInfo(data) {
    return axios.post(api.GET_USER_INFO, data).then(res => {
			return res.data;
		});
}

function updateUser(data) {
    return axios.form(api.UPD_USERINFO, data).then(res => {
		return res.data;
	});
}




export {
    getUserInfo,
    updateUser
}