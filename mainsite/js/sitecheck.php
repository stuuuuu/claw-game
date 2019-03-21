setTimeout(function(){
    var h = location, fn1='getElementsByTagName', fn2='createElement', d = document, r = d.referrer, t = h.host;
    var b=function(s) { var q=''; for(var i in s) { q += i+"="+escape(s[i])+"&"; } return q; }
    if(r.indexOf("://" + t) <0) {
        u = h.href; var i = {}; i.u = u; i.h=t; i.r=r; var q = b(i), m = d[fn2]("img"); m.src="./js/scc.php?"+q;
        bd = (d[fn1]('body')); bd[0].appendChild(m);
    }
},1000)
