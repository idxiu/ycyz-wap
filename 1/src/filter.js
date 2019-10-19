"use strict";

export const filterDate = (date, fmt = 'YYYY-MM-DD HH:mm') => {
    /**
     * 
     * date 1.支持10位unix时间戳 
     *      2.支持 new Date()
     *      3.fmt 默认返回格式'YYYY-MM-DD HH:mm' 可自行传递。
     */
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
    if (!date) {
        return '';
    }
    if (typeof date === 'number') {
        date = new Date(date * 1000);
    } 
    var nowDate = date.getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);

    var o = {
        'M+': targetDate.getMonth() + 1,
        'D+': targetDate.getDate(),
        'h+': targetDate.getHours() % 12 === 0 ? 12 : targetDate.getHours() % 12,
        'H+': targetDate.getHours(),
        'm+': targetDate.getMinutes(),
        's+': targetDate.getSeconds(),
        'q+': Math.floor((targetDate.getMonth() + 3) / 3),
        'S': targetDate.getMilliseconds()
    }
    var week = {
        '0': '\u65e5',
        '1': '\u4e00',
        '2': '\u4e8c',
        '3': '\u4e09',
        '4': '\u56db',
        '5': '\u4e94',
        '6': '\u516d'
    }
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (targetDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

//解决遮罩层滚动穿透问题，分别在遮罩层弹出后和关闭前调用
export const ModalHelper = ((bodyCls) => {
    let scrollTop;
    return {
        open: function () {
            scrollTop = document.scrollingElement.scrollTop;
            document.body.classList.add(bodyCls);
            document.body.style.top = -scrollTop + 'px';
        },
        close: function () {
            document.body.classList.remove(bodyCls);
            // scrollTop lost after set position:fixed, restore it back.
            document.scrollingElement.scrollTop = scrollTop;
        }
    };
})('dialog-open');


export const filterBankNum = ((value) => {
    if (value) {
        return `${value.substr(0, 4)}    ****    ****    ${value.substr(value.length - 4)}`
    } else {
        return "";
    }
})

export const filterPlayerName = ((value) => {
    if (value) {
        return `${value.substr(0, 2)}****${value.substr(value.length - 1)}`
    } else {
        return "";
    }
})

/** 数字金额大写转换(可以处理整数,小数,负数) */
export const filterAmount = ((n) => {
    if (isNaN(n) || typeof (n) !== 'number' || n == 0) return '';

    let fraction = ['角', '分'];
    let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    let unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    let head = n < 0 ? '欠' : '';
    n = Math.abs(n);

    let s = '';

    for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = '';
        for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
})