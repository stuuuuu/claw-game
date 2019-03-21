function setCookie(key,value,expireday,path) {
    var cookieStr = key+"="+value+";";
    if(expireday != '') {
        var expd = new Date();
        expd.setSeconds( expd.getSeconds() + 86400 * (expireday*1) );
        cookieStr += expd.toUTCString() + ";";
    }
    if(path != '') {
        cookieStr += "path= "+path+"";
    }
    document.cookie = cookieStr;
}

function unsetCookie(key) {
    setCookie(key,"",-1);
}

function getCookie(key) {
    var cookieStr = document.cookie;

    var cookieArr = cookieStr.split("; ");
    for(var no in cookieArr) {
        var cookieItem = cookieArr[no];
        var ck = cookieItem.split("=");
        var ckey = ck[0];
        if(ckey == key) {
            var cvalue = "";
            for( var sj in ck) {
                if(sj==0) continue;
                cvalue += ck[sj]
            }
            return cvalue;
        }
        else {
            continue;
        }
    }
    return null;

}