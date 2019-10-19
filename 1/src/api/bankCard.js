import request from '@/lib/request'
//获取银行卡信息
export function hasBankMsg() {
    return request("BANK_LIST", null, "pb.BankCardDropResp")
}
//获取银行卡用户信息
export function getUserName() {
    return request("BANK_USER_NAME", null, "pb.IsHasUsernameResp")
}
//添加银行卡
export function addMemberBank(
    bankId, card, username, subbranch,
    province,city
) {
    const req = {
        bankId: bankId,
        card: card,
        username: username,
        subbranch: subbranch,
        province:province,
        city:city
    }
    console.log(req);
    const data = request.create('pb.AddMemberBankCardReq', req)
    return request("MEMBER_BANK_ADD", data, "pb.AddMemberBankCardReq")
}
//银行卡列表信息
export function bankCardList() {
    return request("MEMBER_BANK_LIST", null, "pb.MemberBankListResp")
}
//设置银行卡成功
export function todoBankCard(id) {
    const req = {
        id: id
    }
    const data = request.create('pb.MemberIdReq', req)
    return request("DEF_BANK_EDIT", data, "pb.MemberIdReq")
}