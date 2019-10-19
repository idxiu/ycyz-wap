import axios from "./axios";
import api from "./api";



//账变消息-获取详情
function getBillChangeInfo(data) {
    return axios.post(api.CASH_INFO, data).then(res => {
        return res.data;
    });
}
//公告通知-获取详情
function getGongGaoNoticeMsgInfo(data) {
    return axios.post(api.GET_NOTICE_DETAIL, data).then(res => {
        return res.data;
    });
}

// 系统消息-获取详情
function getSysNoticeMsgInfo(data) {
    return axios.post(api.INBOX_SYS_INFO, data).then(res => {
        return res.data;
    });
}


export {
    getSysNoticeMsgInfo,
    getBillChangeInfo,
    getGongGaoNoticeMsgInfo
}