import request from '@/lib/request'

// getCaptcha 获取验证码
export function getCaptcha() {
    return request('CAPTCHA', null, "pb.Captcha")
}

// getCaptcha 获取验证码
export function login(name, pwd, codeId, code) {
    const req = {
        account: name,
        password: pwd,
        code: code,
        codeId: codeId
    };

    const data = request.create('pb.MemberLoginReq', req)
    return request("LOGIN", data, "pb.SessionResp")
}
//首页公共数据
export function indexInfo() {
    return request("INDEX_INFO", null, "pb.IndexDataResp")
}
//公告
export function getNotice(position, cate, isGame) {
    const req = {
        position: position,
        cate: cate,
        isGame: isGame
    };

    const data = request.create('pb.QueryNoticeReq', req)
    return request("NOTICE", data, "pb.NoticeResp")
}
//游戏数据
export function getGameInfo() {
    return request("ALLGAMES", null, "pb.GameTypeList")
}
//是否设置转入
export function ratios(id, name) {
    const req = {
        platformId: id,
        platformName: name,
    };
    const data = request.create('pb.AutoMemberConversionReq', req)
    return request("RATIO", data, "pb.AutoMemberConversionResp")
}
//进入游戏
export function gameInto(name,id,gameType) {
    const req = {
        platform: name,
        gameId: id,
        gameType:gameType
    };
    const data = request.create('pb.MemberPlayReq', req)
    return request("LOGINGAME", data, "pb.MemberPlayResp")
}
//玩过的游戏
export function getGamed() {
    return request("HISTORYGAMES", null, "pb.RecentGameResp")
}
//领取红包
export function getredBag(id) {
    const req = {
        setId: id,
    };
    const data = request.create('pb.RedPacketReceiveReq', req)
    return request("REDBAG", data, "pb.RedPacketReceiveResp")
}

//获取热门游戏推荐和广告轮播
export function getHotGames(type) { 
    // 广告类型 -1首页广告 -2存款成功 -3取款成功
    const req = {
        advType: type,
    };
    const data = request.create('pb.AdvReq', req)
    return request("HOTGAMES_ADV", data, "pb.AdvGameResp")
}
//存取款广告
export function getAdvGames(type,id) { 
    // 广告类型 -1首页广告 -2存款成功 -3取款成功
    const req = {
        typeId: id,
        itype: type
    };
    const data = request.create('pb.GameAdvReq', req)
    return request("GAMES_ADV", data, "pb.GameAdvRespList")
}
//获取游戏大厅电子，彩票等轮播广告
export function getGamesAdv(req) {
    const data = request.create('pb.GameAdvReq', req)
    return request("GAMES_ADV", data, "pb.GameAdvRespList")
}

//获取用户登录的弹窗公告
export function getLoginPopNotice() {
    return request("LOGIN_POP_NOTICE", null, "pb.PopMessage")
}
//广告统计ADV_STATISTICS
export function getAdvStatis(title,id,type,link) { 
    // title,id,type,isLink,link
    if(link == null){
        link = ''
    }
    const req = {
        advSource: window.location.href,
        advTitle: title,
        id: id,
        advLink: link,
        advType: type
    };
    const data = request.create('pb.AdvStatisticsReq', req)
    return request("ADV_STATISTICS", data, 'pb.AdvStatisticsReq')
}
export function thdLoginQq(){
    return request("THREEWAYLOGIN_QQ_OPTIONS", null, "pb.QQOptions")
}
export function thdQQlogin(code){
    const req = {
        qqAuthCode:code
    }
    const data = request.create('pb.MemberThreeWayLoginReq', req)
    return request("THREEWAYLOGIN_QQ_LOGIN", data, 'pb.SessionResp')

}
//游戏数据
export function getThreeInfo() {
    return request("THREEWAYLOGIN_INFO", null, "pb.IsOpenThirdLoginResp")
}

//app下载url
export function getDownloadUrl() {
    return request("DOWNLOAD_URL", null, "pb.DownloadResp")
}
export function getQS(){
    return request("INDEX_QS", null, "pb.InvestigationIdReq")
}