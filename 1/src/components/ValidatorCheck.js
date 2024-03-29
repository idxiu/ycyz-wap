import { Validator } from 'vee-validate';
// import { ErrorBag } from 'vee-validate';
// const bag = new ErrorBag();


//验证
const isMobile = {
    validate: (value, args) => {
        return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
}

const isHttp = {
    validate: (value, args) => {
        var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
            + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
            + '|' // 允许IP和DOMAIN（域名） 
            + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
            + '[a-z]{2,6})' // first level domain- .com or .museum 
            + '(:[0-9]{1,4})?' // 端口- :80 
            + '((/?)|' // a slash isn't required if there is no file name 
            + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
        var re = new RegExp(strRegex);     
        return re.test(value)
    }
}

const isQQ = {
    validate: (value, args) => {
        var strRegex = '[1-9][0-9]{4,14}'
        var re = new RegExp(strRegex);
        return re.test(value)
    }
    
}

Validator.extend('mobile', isMobile);
Validator.extend('QQ', isQQ);
Validator.extend('http', isHttp);







export default Validator;


