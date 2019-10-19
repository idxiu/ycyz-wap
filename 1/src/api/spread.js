import request from '@/lib/request'

export function getActivityList() {
    return request('ACTIVITY_LIST', null, "pb.ActivityListResp")
}
export function receiveActivity(id) {
    const req = {
        id: id
    }
    const data = request.create('pb.ActivityReq', req)
    return request('ACTIVITY_RECEIVE', data, "pb.ActivityReceiveResp")
}

// export function proportion(page, pageSize) {
//     const req = { page, pageSize }
//     const data = request.create('pb.PageParams', req)
//     return request('PURSE_BACK_REBATE', data,"pb.ProportRebateResp")
// }

// export function info () {
//     return request('SPREAD', null,'pb.SpreadInfoResp')
// }


//新的-推广所有接口

//获取添加链接需要的彩种数据
function getAddSpreadData () {
    return request('SPREAD_GAME_TYPE', null,'pb.SiteSpreadNextSetTypeClassListResp');
}

//添加推广链接
function setSpreadAdd (req) {
    const data = request.create('pb.AddReq', req);
    return request('SPREAD_ADD', data, 'pb.OrderResp');
}

//获取推广链接列表
function getSpreadList () {
    return request('SPREAD_LIST', null,'pb.SiteSpreadNextSetListResp');
}

//删除 推广链接
function deleteSpread (req) {
    const data = request.create('pb.DelReq', req);
    return request('SPREAD_DELETE', data, 'pb.OrderResp');
}

//获取会员管理 列表数据
function getMemberList (req) {
    const data = request.create('pb.SpreadNextMemberReq', req);
    return request('SPREAD_MEMBER', data, 'pb.AllSpreadNextMember');
}

export default {
    getAddSpreadData,
    setSpreadAdd,
    getSpreadList,
    deleteSpread,
    getMemberList,
}


export function info () {
    return request('SPREAD', null,'pb.SpreadInfoResp')
}

////---------我要推广
//-----推广统计
export function statisList(dayType) {
    const req = { dayType}
    const data = request.create('pb.SpreadCountReq', req)

    return request('STATIS_LIST', data,"pb.MemberRebateReportResp")
}
//-----下级报表
export function subordinateList(dayType) {
    const req = { dayType}
    const data = request.create('pb.SpreadCountReq', req)

    return request('SUBORDINATE_LIST', data,"pb.AllNextReport")

}