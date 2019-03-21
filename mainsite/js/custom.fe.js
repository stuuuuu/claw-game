var jf_succ = {'pl_ID':0,'pl_PWD':0,'pl_PWD':0,'pl_PWD1':0,'pl_NAME':0,'pl_EMAIL':0,'pl_PHONE':0};
var cmail = [];
var popup_flag = 0;

jQuery( function() {
    ssoid = typeof ssoid !="undefined" ? ssoid : "";
    if(typeof lockFrame=="undefined"){
        lockFrame = false;
    }
    if(typeof lockPopOutModal=="undefined"){
        lockPopOutModal = false;
    }


    if(!lockFrame && !lockPopOutModal){
        /* get important mail */
        if(vip_levelup && vip_notice_flag !=1){
             show_VIPoption_modal();
        }else if(vip_msg == 1){
            show_VIPnotice_modal();
        }else{
            CheckImportantAndShow();
        }

    }


    // for 下拉式导览
    jQuery('.parent').click(function() {
        jQuery('.sub-nav').toggleClass('visible');
    });
        jQuery('.lang').click(function() {
            jQuery('.selectservice ul.sub-nav').hide();
            jQuery(this).find("ul").toggle();

        });

    jQuery('.loginpw').on("focus",function(){
       jQuery('.loginpw').toggleClass('blur');
    });
    jQuery('.loginpw').on("change",function(){
       jQuery('.loginpw').toggleClass('blur');
    });
    jQuery('.loginpw').on("blur",function(){
       jQuery('.loginpw').toggleClass('blur');
    });

    //龙虎版 跳转
    jQuery('div.dgBoard').click(function(){
       location.href='Rankboard/';
    });
    setInterval(function() {

        if(!initTime_S ||  !initTime_M || !initTime_H) {
            return;
        }
        initTime_S = initTime_S*1+1;
        if(initTime_S>=60) {
            initTime_S = 0;
            initTime_M = initTime_M*1 +1;
            if(initTime_M>=60) {
                initTime_M = 0;
                initTime_H = initTime_H*1 +1;
                if(initTime_H>=24) {
                    initTime_H = 0;
                }
            }
        }
        if((initTime_S+"").length==1) { initTime_S = "0".concat(initTime_S); }
        if((initTime_M+"").length==1) { initTime_M = "0".concat(initTime_M); }
        if((initTime_H+"").length==1) { initTime_H = "0".concat(initTime_H); }
        setClock(initTime_H,initTime_M,initTime_S);
    },1000);

    var D = new Date();
    initTime_H = typeof initTime_H != "undefined" ? initTime_H : D.getHours();
    initTime_M = typeof initTime_M != "undefined" ? initTime_M : D.getMinutes();
    initTime_S = typeof initTime_S != "undefined" ? initTime_S : D.getSeconds();
    setClock(initTime_H,initTime_M,initTime_S);

    if(jQuery("ul#ticker01 li").length>0) {
        jQuery("ul#ticker01").liScroll({
            travelocity: 0.04
        });
    }

    jQuery("#TopGameTabT > li:not(.closed)").on("click",function() {
        $this = jQuery(this);
        var tabid = $this.attr("id");
        jQuery("#TopGameTab div.sub").hide();
        jQuery("#TopGameTab div#"+tabid+"_tab.sub").show();
    });

    jQuery('#new_slides').owlCarousel({
        //animateOut: 'fadeOut',
         lazyLoad:true,
        // nav:false,
        items: 1,
        margin: 1,
        smartSpeed: 450,
        autoWidth: true,
        autoplay: true,
        autoplayTimeout: 5000,
        loop: true
    });

      // 增加到最近游戏
      // jQuery(".CenterCon").on("click",".opengame_btn", function() {
      //     AddRecentlyPlay(jQuery(this));
      // });
});

jQuery.fn.liScroll = function(settings) {
    settings = jQuery.extend({
    travelocity: 0.05
    }, settings);
        return this.each(function(){

            var $strip = jQuery(this);

            $strip.addClass("newsticker");

            var stripWidth = 0;
            var $mask = $strip.wrap("<div class='mask'></div>");
            var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");
            var containerWidth = $strip.parent().parent().width();  //a.k.a. 'mask' width
            $strip.find("li").each(function(i){
                stripWidth += jQuery(this, i).width() + 60;
            });
            $strip.width(stripWidth);
            var defTiming = stripWidth/settings.travelocity;
            var totalTravel = stripWidth+containerWidth;
            function scrollnews(spazio, tempo){
                $strip.animate({left: '-='+ spazio}, tempo, "linear", function(){
                    $strip.css("left", containerWidth);
                    scrollnews(totalTravel, defTiming);
                });
            }
            scrollnews(totalTravel, defTiming);
            $strip.hover(function(){
                jQuery(this).stop();
            },
            function(){
                var offset = jQuery(this).offset();
                var residualSpace = offset.left + stripWidth;
                var residualTime = residualSpace/settings.travelocity;
                scrollnews(residualSpace, residualTime);
            });
    });
};

(function(jQuery){

// Creating the sweetPages jQuery plugin:
jQuery.fn.sweetPages = function(opts , item ){
    // If no options were passed, create an empty opts object
    if(!opts) opts = {};

    var resultsPerPage = opts.perPage || 3;

    // The plugin works best for unordered lists, althugh ols would do just as well:
    var ul = this;
    var li = ul.find(item);

    li.each(function(){
        // Calculating the height of each li element, and storing it with the data method:
        var el = jQuery(this);
        el.data('height',el.outerHeight(true));
    });

    // Calculating the total number of pages:
    var pagesNumber = Math.ceil(li.length/resultsPerPage);

    // If the pages are less than two, do nothing:
    if(pagesNumber<2) return this;

    // Creating the controls div:
    var swControls = jQuery('<div class="swControls">');

    for(var i=0;i<pagesNumber;i++)
    {
        // Slice a portion of the lis, and wrap it in a swPage div:
        li.slice(i*resultsPerPage,(i+1)*resultsPerPage).wrapAll('<div class="swPage" />');

        // Adding a link to the swControls div:
        swControls.append('<a href="" class="swShowPage">'+(i+1)+'</a>');
    }
    ul.append(swControls);

    var maxHeight = 0;
    var totalWidth = 0;

    var swPage = ul.find('.swPage');
    swPage.each(function(){

        // Looping through all the newly created pages:

        var elem = jQuery(this);

    var tmpHeight = 0;
        // elem.find('div.gamearea').each(function(){tmpHeight+=jQuery(this).data('height');});

        if(tmpHeight>maxHeight)
            maxHeight = tmpHeight;

        totalWidth+=elem.outerWidth();

        elem.css('float','left').width(ul.width());
    });

    swPage.wrapAll('<div class="swSlider" />');

    // Setting the height of the ul to the height of the tallest page:
    // ul.height(maxHeight);

    var swSlider = ul.find('.swSlider');
    swSlider.append('<div class="clear" />').width(totalWidth);

    var hyperLinks = ul.find('a.swShowPage');
    hyperLinks.click(function(e){

        // If one of the control links is clicked, slide the swSlider div
        // (which contains all the pages) and mark it as active:

        jQuery(this).addClass('active').siblings().removeClass('active');

        swSlider.stop().animate({'margin-left':-(parseInt(jQuery(this).text())-1)*ul.width()},'slow');
        e.preventDefault();
    });

    // Mark the first link as active the first time this code runs:
    hyperLinks.eq(0).addClass('active');

    // Center the control div:
    swControls.css({
    /* left: 50%; */
    'width': '740px',
    'text-align': 'center',
    /* margin-left: -370px; */
    'position': 'absolute'
    });
    hyperLinks.css({

    });

    return this;



}})(jQuery);

    function IsNullString(string) { return (string === null); }
    function IsEmptyString(string) { return (!string || 0 === string.length); }
function VerifyString(string, pattern) {
    pattern = pattern || /[\s\S]+/;
    if (IsNullString(string) || IsEmptyString(string)) {
        return false;
    }
    if (string.match(pattern)) {
        return true;
    } else {
        return false;
    }
}



function setClock(h,m,s) {
    jQuery("#t_clock").html(h+":"+m+":"+s);
}

function reloadVCode(id,type) {
    jQuery('#'+id).attr("src","verify/gd_vfont.php?"+type+"&t="+(new Date()).getTime()   );
}

function checkMobile() {
    jQuery("#r_f_s2").submit();
}

function resendMobile() {
    jQuery("#r_f_t2").submit();
}

function userLogout() {
    jQuery.post("Logout.php",function(et){ if(et=="o"){ } else { location.reload() } });
}

function changePwd() {
    var pwd = jQuery("#cg_PWD").val(), pwd1 = jQuery("#cg_PWD1").val();
    if(pwd=='') {
        alert('请填入新密码');
    } else if(pwd!=pwd1) {
        alert('新密码与确认密码不符');
    } else if(!pwd.match(/^[a-zA-Z0-9]{6,14}$/)){
        alert('密码格式不符,请重新输入');
    } else {
        jQuery("#c_f_s3").submit();
    }
}

function refreshMoney() {
    jQuery.post("Action/ActMember.php?act=GetPoint&ssoid="+ssoid,function(cb) {
        // jQuery("#ph_bonus").html(cb.bonus);
        jQuery("[data-settype=allpoint]").html(cb.withdraw);
        jQuery("[data-settype=allpoint]").html(cb.total);
    },"json");
}

var iptIndex = 0;
function showImportant() {
    jQuery("#imail_topic").html( cmail[iptIndex].topic );
    jQuery("#imail_date").html( cmail[iptIndex].add_date );
    jQuery("#imail_content").html( cmail[iptIndex].content.replace(/\n/g,"<br>"));

    jQuery("#mail_modal").modal({
      zIndex: 5000,
      escapeClose: false,
      clickClose: false,
      showClose: false
    });
}

function CheckImportantAndShow(){
    var table_param = typeof table_mark !== "undefined"  ? table_mark : '' ;

    jQuery.post('Action/ActSys.php?act=ImportantMailNew&',{table_mark:table_param} ,function(ret) {
        cmail = ret;
        if(cmail.length>0) {
            showImportant();
        }else{
            if(typeof(MaintenanceNotice) !==  "undefined"){
                MaintenanceNotice.Init(function(){MaintenanceNotice.CheckShowNotice();});
            }
        }
    },'json');
}

function nextMail() {
    if(cmail.length<=0) {
        jQuery.modal.close();
        //console.log('rrrr');
        if(typeof(MaintenanceNotice) !==  "undefined"){
            MaintenanceNotice.Init(function(){MaintenanceNotice.CheckShowNotice();});
        }
        return;
    }
    if(iptIndex+1<=cmail.length-1) {
        iptIndex++;
    } else {
        iptIndex = 0;
    }
    jQuery("#imail_topic").html( cmail[iptIndex].topic );
    jQuery("#imail_date").html( cmail[iptIndex].add_date );
    jQuery("#imail_content").html( cmail[iptIndex].content.replace(/\n/g,"<br>"));
}

function read_imail() {
    var table_param = typeof table_mark !== "undefined"  ? table_mark : '' ;
    jQuery.post( "Action/ActSys.php?act=ReadMail&",{id: cmail[iptIndex].sn, spm:cmail[iptIndex].spm, ym: cmail[iptIndex].ym , table_mark:table_param },
        function(ret) {
            delete cmail[iptIndex];
            cmail.sort();
            cmail.length--;
            nextMail(iptIndex);
        }
    );
}

function ignore_imail() {
    nextMail(iptIndex);
}

function showZopim(cs_type) {
    cs_type = cs_type || 0;
    if(cs_type == 1){
       LivePlus.open();
    }else if(cs_type == 2){
       $zopim.livechat.window.show();
    }else{
       $zopim.livechat.window.show();
    }

}


function show_VIPoption_modal(){

    jQuery("#vipMessage_modal").modal({
        zIndex: 10000,
        escapeClose: true,
        closeText: 'x',
        clickClose: true,
        showClose: false,
        clickClose: false
    });
}


function show_VIPnotice_modal(){

    jQuery("#vipMessage_modal_notice").modal({
        zIndex: 10000,
        escapeClose: true,
        closeText: 'x',
        clickClose: true,
        showClose: false,
        clickClose: false
    });
}




function sendVIPrequest(){


  var QQVIP = jQuery("#QQVIP").val();
  var normal = jQuery("#normal").val();
  var club  = jQuery('input:radio[name=club]:checked').val();



     jQuery.post("Action/ActSys.php?act=SubmitVIPclub",{QQVIP:QQVIP,club:club,normal:normal},function(cb) {
            var response = JSON.parse(cb);

            if(response.success == 1){
                unsetCookie('vip_notice');
                alert(response.msg);

            }else{
                alert(response.msg);
            }

            window.location.reload();
        });

}


function CollectGameCollect(GameHall, GameId, self) {

    self.toggleClass('disable');

    jQuery.get("Action/ActSys.php?act=CollectGameCollectAjax&GameHall="+GameHall+"&GameId="+GameId,{},function(cb) {

        if (self) {

            self.toggleClass('on');
            self.toggleClass('disable');
            alert('加入成功！');
        }
    }, 'json')
    .fail(function(cb , st , code){
        self.toggleClass('disable');
        alert('加入失败！' + cb.responseText);

    });

}

function CollectGameSearch(GameHall, GameId, self) {

    jQuery.get("Action/ActSys.php?act=CollectGameSearchAjax&ssoid="+ssoid+"&GameHall="+GameHall+"&GameId="+GameId,{},function(cb) {

    }, 'json')
    .fail(function(cb){
    });
}

function CollectGameDelete(GameHall, GameId, self) {
    self.toggleClass('disable');
    jQuery.post("Action/ActSys.php?act=CollectGameDeleteAjax&ssoid="+ssoid+"&GameHall="+GameHall+"&GameId="+GameId,{},function(cb) {

        self = jQuery(self) || false;
        if (self) {
            self.toggleClass('on');
            self.toggleClass('disable');
            alert('取消成功！');
        }
    }, 'json')
    .fail(function(cb){
        self.toggleClass('disable');
        alert('取消失败！');

    });
}



function readVIPmessage(){


  var msg_sn = jQuery("#msg_sn").val();

     jQuery.get("Action/ActSys.php?act=readVIPmessage&msg_sn="+msg_sn,function(cb) {

        });

}


function AddRecentlyPlay(opengame_btn){
    var gamehall = opengame_btn.attr('game_hall');
    var game_id = opengame_btn.attr('game_id');

    var gameobj =  jQuery.cookie('RPG_'+gamehall);
    if(typeof(gameobj) =="undefined"){
        var gamearr = new Array();
    }else{
        var gamearr = JSON.parse(gameobj);

    }

    //如果此游戏已经存在
    if(gamearr.indexOf(game_id)!=-1){
        gamearr.splice(gamearr.indexOf(game_id) , 1);
        //return false ;
    }

    if(gamearr.length >= 6){
        gamearr.pop();
        gamearr.unshift(game_id);
    }else{
        gamearr.unshift(game_id);
    }
    //console.log(gamearr);
    jQuery.cookie('RPG_'+gamehall , JSON.stringify(gamearr));

}


//回播相關參數!!

var lock_ApplyNormalrecall =false;
var q_sn  = -1;
function ApplyNormalrecall(showtip_flag){

  if(lock_ApplyNormalrecall){
     return false;
  }

  //var phone = jQuery("#recall_input_numbers").val();
   q_sn = jQuery("#recall_question_type").find(":selected").attr('q_sn');

  if(isLogin != 1){
    alert('请您先登入,才可使用回拨功能!!');
    return false
  }

  if(q_sn=='-1'){
    alert('您好，请您先选择需要谘询的问题!');
    return false
  }

  if(showtip_flag==1){
        //已移除提示功能20170106
        if(!confirm('主上，由于前方排队人数过多，需要您耐心稍等片刻。请问您是否继续等待回拨？')){
            return false;
        }
  }

    showRecallModal();


}


function ApplyNormalrecall_memberpage(showtip_flag){

 q_sn = jQuery("#recall_question_type_memberpage").find(":selected").attr('q_sn');
  if(lock_ApplyNormalrecall){
     return false;
  }

  if(isLogin != 1){
    alert('请您先登入,才可使用回拨功能!!');
    return false
  }

  if(q_sn=='-1'){
    alert('您好，请您先选择需要谘询的问题!');
    return false
  }

  if(showtip_flag==1){
        if(!confirm('主上，由于前方排队人数过多，需要您耐心稍等片刻。请问您是否继续等待回拨？')){
            return false;
        }
  }

  //var phone = jQuery("#recall_input_numbers_memberpage").val();


    showRecallModal();

}


function SendApplyRecall(phone , q_sn){
  if(lock_ApplyNormalrecall){
     return false;
  }
    lock_ApplyNormalrecall = true;
    jQuery.post("Action/AjaxIndex.php?act=ApplyNormalrecall",{phone:phone, q_sn:q_sn},function(cb) {
        var response = JSON.parse(cb);
        if(response.err == 'nologin'){
            alert(response.msg);
            window.location.reload();
        }else{
            lock_ApplyNormalrecall = false ;
            alert(response.msg);
            jQuery('.normal-recall-apply-btn').show();
        }
    });
}


function showRecallModal(){

      jQuery("#NormalRecall_modal").modal({
        zIndex: 10000,
        escapeClose: true,
        closeText: 'x',
        showClose: false,
        clickClose: true
    });
}

function submitRecall(){

    var phone  = jQuery("#recall_modal_phone").val();
    jQuery('.normal-recall-apply-btn').hide();
    //q_sn from global;
    SendApplyRecall(phone ,q_sn);

}



//回播相關參數!!


function open_game(url , gamehall , gamecode) {

    // 定義例外視窗大小 基本height = 800
    var special_size = {
        'PTN': {
            'sw_fufish_intw': {'width': 160 , 'height':80},
            'sw_fufish-jp': {'width': 160 , 'height':80}
        },
        'PT': {
            'cashfi': {'width': 124 , 'height':80},
            'gtsswk': {'width': 104.5 , 'height':80},
            'psdbj': {'width': 125 , 'height':80},
            'ro_g': {'width': 125 , 'height':80},
            'gtsru': {'width': 112.5 , 'height':80}
        },
        'TTGS': {
            'AmazonAdventureSlots': {'width': 106 , 'height':80},
            'GenericSlots': {'width': 106 , 'height':80},
            'SDBlackjack': {'width': 107 , 'height':80}
        },
        'AG': {
            '6': {'width': 138 , 'height':80},
            '220': {'width': 142 , 'height':80},
            '204': {'width': 106.5 , 'height':80},
            '208': {'width': 106.5 , 'height':80},
            '203': {'width': 106.5 , 'height':80}
        },
        'SSWFG': {
            'eldorado_not_mobile_sw': {'width': 106.5 , 'height':80},
            'jewelblast': {'width': 106.5 , 'height':80},
            '70026': {'width': 106.5 , 'height':80},
            '70021': {'width': 106.5 , 'height':80},
            '70013': {'width': 106.5 , 'height':80},
            '70017': {'width': 106.5 , 'height':80},
            '70010': {'width': 106.5 , 'height':80},
            '70011': {'width': 106.5 , 'height':80},
            '70023': {'width': 106.5 , 'height':80},
            '70003': {'width': 106.5 , 'height':80},
            '70007': {'width': 106.5 , 'height':80},
            '70024': {'width': 106.5 , 'height':80},
            '70002': {'width': 106.5 , 'height':80},
            '70001': {'width': 106.5 , 'height':80},
            '70085': {'width': 106.5 , 'height':80},
            '70030': {'width': 106.5 , 'height':80},
            '70005': {'width': 106.5 , 'height':80},
            '70022': {'width': 106.5 , 'height':80},
            '70034': {'width': 106.5 , 'height':80},
            '70006': {'width': 106.5 , 'height':80},
            '70225': {'width': 160 , 'height':80}
        },
        'MG': {

            '44751' : {'width' : 124.5 , 'height' : 70},
            '46494' : {'width' : 124.5 , 'height' : 70},
            '28858' : {'width' : 124.5 , 'height' : 70},
            '28800' : {'width' : 124.5 , 'height' : 70},
            '42981' : {'width' : 124.5 , 'height' : 70},
            '28474' : {'width' : 124.5 , 'height' : 70},
            '28386' : {'width' : 124.5 , 'height' : 70},
            '28574' : {'width' : 124.5 , 'height' : 70},
            '28198' : {'width' : 124.5 , 'height' : 70},
            '28586' : {'width' : 124.5 , 'height' : 70},
            '28134' : {'width' : 124.5 , 'height' : 70},
            '50194' : {'width' : 124.5 , 'height' : 70},
            '29555' : {'width' : 124.5 , 'height' : 70},
            '28404' : {'width' : 124.5 , 'height' : 70},
            '28592' : {'width' : 124.5 , 'height' : 70},
            '46497' : {'width' : 124.5 , 'height' : 70},
            '28630' : {'width' : 124.5 , 'height' : 70},
            '50193' : {'width' : 124.5 , 'height' : 70},
            '42979' : {'width' : 124.5 , 'height' : 70},
            '28644' : {'width' : 124.5 , 'height' : 70},
            '45399' : {'width' : 124.5 , 'height' : 70},
            '28268' : {'width' : 124.5 , 'height' : 70},
            '28794' : {'width' : 124.5 , 'height' : 70},
            '28788' : {'width' : 124.5 , 'height' : 70},
            '28384' : {'width' : 124.5 , 'height' : 70},
            '28546' : {'width' : 124.5 , 'height' : 70},
            '28174' : {'width' : 124.5 , 'height' : 70},
            '28440' : {'width' : 124.5 , 'height' : 70},
            '28772' : {'width' : 124.5 , 'height' : 70},
            '28912' : {'width' : 124.5 , 'height' : 70},
            '28758' : {'width' : 124.5 , 'height' : 70},
            '28388' : {'width' : 124.5 , 'height' : 70},
            '28382' : {'width' : 124.5 , 'height' : 70},
            '28484' : {'width' : 124.5 , 'height' : 70},
            '28796' : {'width' : 124.5 , 'height' : 70},
            '28200' : {'width' : 124.5 , 'height' : 70},
            '28522' : {'width' : 124.5 , 'height' : 70},
            '28622' : {'width' : 124.5 , 'height' : 70},
            '29449' : {'width' : 124.5 , 'height' : 70},
            '28516' : {'width' : 124.5 , 'height' : 70},
            '28496' : {'width' : 124.5 , 'height' : 70},
            '28406' : {'width' : 124.5 , 'height' : 70},
            '28344' : {'width' : 124.5 , 'height' : 70},
            '28300' : {'width' : 124.5 , 'height' : 70},
            '28312' : {'width' : 124.5 , 'height' : 70},
            '28790' : {'width' : 124.5 , 'height' : 70},


            '28776' : {'width' : 94.5 ,  'height' : 70},
            '28350' : {'width' : 94.5 ,  'height' : 70},
            '28348' : {'width' : 94.5 ,  'height' : 70},
            '28172' : {'width' : 94.5 ,  'height' : 70},
            '28274' : {'width' : 94.5 ,  'height' : 70},
            '28228' : {'width' : 94.5 ,  'height' : 70},
            '28218' : {'width' : 94.5 ,  'height' : 70},
            '28716' : {'width' : 94.5 ,  'height' : 70},
            '28638' : {'width' : 94.5 ,  'height' : 70},
            '28628' : {'width' : 94.5 ,  'height' : 70},
            '28462' : {'width' : 94.5 ,  'height' : 70},
            '28336' : {'width' : 94.5 ,  'height' : 70},
            '28114' : {'width' : 94.5 ,  'height' : 70},
            '28514' : {'width' : 94.5 ,  'height' : 70},
            '28740' : {'width' : 94.5 ,  'height' : 70},
            '28422' : {'width' : 94.5 ,  'height' : 70},
            '28608' : {'width' : 94.5 ,  'height' : 70},
            '28696' : {'width' : 94.5 ,  'height' : 70},
            '28564' : {'width' : 94.5 ,  'height' : 70},
            '28328' : {'width' : 94.5 ,  'height' : 70},
            '28178' : {'width' : 94.5 ,  'height' : 70},
            '28130' : {'width' : 94.5 ,  'height' : 70},
            '28248' : {'width' : 94.5 ,  'height' : 70},
            '28296' : {'width' : 94.5 ,  'height' : 70},
            '28358' : {'width' : 94.5 ,  'height' : 70},
            '28354' : {'width' : 94.5 ,  'height' : 70},
            '28408' : {'width' : 94.5 ,  'height' : 70},
            '28400' : {'width' : 94.5 ,  'height' : 70},
            '28414' : {'width' : 94.5 ,  'height' : 70},
            '28510' : {'width' : 94.5 ,  'height' : 70},
            '28582' : {'width' : 94.5 ,  'height' : 70},
            '28594' : {'width' : 94.5 ,  'height' : 70},
            '28604' : {'width' : 94.5 ,  'height' : 70},
            '28558' : {'width' : 94.5 ,  'height' : 70},
            '28724' : {'width' : 94.5 ,  'height' : 70},
            '28438' : {'width' : 94.5 ,  'height' : 70},
            '28430' : {'width' : 94.5 ,  'height' : 70},
            '28356' : {'width' : 94.5 ,  'height' : 70},
            '28210' : {'width' : 94.5 ,  'height' : 70},
            '28128' : {'width' : 94.5 ,  'height' : 70},
            '28124' : {'width' : 94.5 ,  'height' : 70},
            '28472' : {'width' : 94.5 ,  'height' : 70},
            '28720' : {'width' : 94.5 ,  'height' : 70},
            '28814' : {'width' : 94.5 ,  'height' : 70},
            '28460' : {'width' : 94.5 ,  'height' : 70},
            '28302' : {'width' : 94.5 ,  'height' : 70},
            '28122' : {'width' : 94.5 ,  'height' : 70},
            '28470' : {'width' : 94.5 ,  'height' : 70},
            '28498' : {'width' : 94.5 ,  'height' : 70},
            '28710' : {'width' : 94.5 ,  'height' : 70},
            '28686' : {'width' : 94.5 ,  'height' : 70},
            '28304' : {'width' : 94.5 ,  'height' : 70},
            '28442' : {'width' : 94.5 ,  'height' : 70},
            '28204' : {'width' : 94.5 ,  'height' : 70},
            '28234' : {'width' : 94.5 ,  'height' : 70},
            '28668' : {'width' : 94.5 ,  'height' : 70},
            '28508' : {'width' : 94.5 ,  'height' : 70},
            '28602' : {'width' : 94.5 ,  'height' : 70},
            '28874' : {'width' : 94.5 ,  'height' : 70},
            '28180' : {'width' : 94.5 ,  'height' : 70},
            '28192' : {'width' : 94.5 ,  'height' : 70},
            '28362' : {'width' : 94.5 ,  'height' : 70},
            '28320' : {'width' : 94.5 ,  'height' : 70},
            '28270' : {'width' : 94.5 ,  'height' : 70},
            '28182' : {'width' : 94.5 ,  'height' : 70},
            '28364' : {'width' : 94.5 ,  'height' : 70},
            '28376' : {'width' : 94.5 ,  'height' : 70},
            '28476' : {'width' : 94.5 ,  'height' : 70},
            '28618' : {'width' : 94.5 ,  'height' : 70},
            '28562' : {'width' : 94.5 ,  'height' : 70},
            '28392' : {'width' : 94.5 ,  'height' : 70},
            '28168' : {'width' : 94.5 ,  'height' : 70},
            '28392' : {'width' : 94.5 ,  'height' : 70},
            '28342' : {'width' : 94.5 ,  'height' : 70},
            '28766' : {'width' : 94.5 ,  'height' : 70},
            '28708' : {'width' : 94.5 ,  'height' : 70},
            '28890' : {'width' : 94.5 ,  'height' : 70},
            '28562' : {'width' : 94.5 ,  'height' : 70},
            '28680' : {'width' : 94.5 ,  'height' : 70},
            '28744' : {'width' : 94.5 ,  'height' : 70},
            '28266' : {'width' : 94.5 ,  'height' : 70},
            '28310' : {'width' : 94.5 ,  'height' : 70},
            '28648' : {'width' : 94.5 ,  'height' : 70},
            '28500' : {'width' : 94.5 ,  'height' : 70},
            '28154' : {'width' : 94.5 ,  'height' : 70},
            '28146' : {'width' : 94.5 ,  'height' : 70},
            '28674' : {'width' : 94.5 ,  'height' : 70},
            '28464' : {'width' : 94.5 ,  'height' : 70},
            '28410' : {'width' : 94.5 ,  'height' : 70},
            '28308' : {'width' : 94.5 ,  'height' : 70},
            '28518' : {'width' : 94.5 ,  'height' : 70}


        }
    };

    // 確認利外是否存在
    var IsGameCodeExist = false;
    var IsGameHallExist =  typeof special_size[gamehall] !== "undefined"  ? true : false ;
    if (IsGameHallExist){
         IsGameCodeExist =  typeof special_size[gamehall][gamecode] !== "undefined"  ? true : false ;
    }

    // 計算解析度 如果電腦解析度太小 需要一定比例縮小
    var user_height = window.screen.height;
    var user_width = window.screen.width;
    console.log(user_width +"x"+user_height);

    var base = 10;

    if(user_height <1000 ){
        var base = 8;
    }
    if(user_width < 1600){
        var base = 8;
    }
    if(user_width < 1300){
        var base = 7.5;
    }
    if(user_width < 1000){
        var base = 6;
    }
    //如果例外存在
    if(IsGameCodeExist){
            width_rate = special_size[gamehall][gamecode]['width'];
            height_rate = special_size[gamehall][gamecode]['height'];
    }else{

        if(gamehall=="TTGS"){
            width_rate = 125.5;
            height_rate = 80;

        }else if(gamehall=="PT"){
            width_rate = 103.5;
            height_rate = 80;

        }else if(gamehall=="SSWFG" || gamehall=="FG" ){
            width_rate = 142.5;
            height_rate = 80;
        }else if(gamehall=="PS"){
            width_rate = 142;
            height_rate = 80;
        }else if(gamehall=="PTS"){
            width_rate = 142;
            height_rate = 80;
        }else if(gamehall=="UC8S"){
            width_rate = 116;
            height_rate = 80;
        }else if(gamehall=="MG" || gamehall=="LAPIS2"){
            //width_rate = 124.5;
            width_rate = 93.5;
            height_rate = 70;
        }else if(gamehall=="AG" || gamehall=="AGSW"){
            width_rate = 128;
            height_rate = 80;
        }else if(gamehall=="PNG"){
            base = 10;
            width_rate = 79.7;
            height_rate = 60;
        }else if(gamehall=="NPG"){
            width_rate = 142;
            height_rate = 93;
        }else{
            width_rate = 103.5;
            height_rate = 80;
        }
    }
// 設定

    var width = base*width_rate + 30;
    var height = base*height_rate + 30 ;
    //var height = innerHeight + 45 ;
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if(isSafari){
        height = height + 45 ;
    }
    //console.log(width+'x'+height);
    //console.log('width='+width+',height='+height+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no");
    //window.open(""+url,'','width='+width+',height='+height+',innerHeight='+innerHeight);

    if(gamehall =="NPG"){
        window.open(""+url,'_NPG');
    }else{
        window.open(""+url,'','width='+width+',height='+height+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no");
    }


}

function open_vue_game(gamehall , gamecode , optionValue1 , optionValue2 , optionValue3 , free  , this_game_name, lby) {

    // 定義例外視窗大小 基本height = 800
    var special_size = {
        'PTN': {
            'sw_fufish_intw': {'width': 160 , 'height':80},
            'sw_fufish-jp': {'width': 160 , 'height':80}
        },
        'PT': {
            'cashfi': {'width': 124 , 'height':80},
            'gtsswk': {'width': 104.5 , 'height':80},
            'psdbj': {'width': 125 , 'height':80},
            'ro_g': {'width': 125 , 'height':80},
            'gtsru': {'width': 112.5 , 'height':80}
        },
        'TTGS': {
            'AmazonAdventureSlots': {'width': 106 , 'height':80},
            'GenericSlots': {'width': 106 , 'height':80},
            'SDBlackjack': {'width': 107 , 'height':80}
        },
        'AG': {
            '6': {'width': 138 , 'height':80},
            '220': {'width': 142 , 'height':80},
            '204': {'width': 106.5 , 'height':80},
            '208': {'width': 106.5 , 'height':80},
            '203': {'width': 106.5 , 'height':80}
        },
        'SSWFG': {
            'eldorado_not_mobile_sw': {'width': 106.5 , 'height':80},
            'jewelblast': {'width': 106.5 , 'height':80},
            '70026': {'width': 106.5 , 'height':80},
            '70021': {'width': 106.5 , 'height':80},
            '70013': {'width': 106.5 , 'height':80},
            '70017': {'width': 106.5 , 'height':80},
            '70010': {'width': 106.5 , 'height':80},
            '70011': {'width': 106.5 , 'height':80},
            '70023': {'width': 106.5 , 'height':80},
            '70003': {'width': 106.5 , 'height':80},
            '70007': {'width': 106.5 , 'height':80},
            '70024': {'width': 106.5 , 'height':80},
            '70002': {'width': 106.5 , 'height':80},
            '70001': {'width': 106.5 , 'height':80},
            '70085': {'width': 106.5 , 'height':80},
            '70030': {'width': 106.5 , 'height':80},
            '70005': {'width': 106.5 , 'height':80},
            '70022': {'width': 106.5 , 'height':80},
            '70034': {'width': 106.5 , 'height':80},
            '70006': {'width': 106.5 , 'height':80},
            '70225': {'width': 160 , 'height':80}
        },
        'MG': {

            '44751' : {'width' : 124.5 , 'height' : 70},
            '46494' : {'width' : 124.5 , 'height' : 70},
            '28858' : {'width' : 124.5 , 'height' : 70},
            '28800' : {'width' : 124.5 , 'height' : 70},
            '42981' : {'width' : 124.5 , 'height' : 70},
            '28474' : {'width' : 124.5 , 'height' : 70},
            '28386' : {'width' : 124.5 , 'height' : 70},
            '28574' : {'width' : 124.5 , 'height' : 70},
            '28198' : {'width' : 124.5 , 'height' : 70},
            '28586' : {'width' : 124.5 , 'height' : 70},
            '28134' : {'width' : 124.5 , 'height' : 70},
            '50194' : {'width' : 124.5 , 'height' : 70},
            '29555' : {'width' : 124.5 , 'height' : 70},
            '28404' : {'width' : 124.5 , 'height' : 70},
            '28592' : {'width' : 124.5 , 'height' : 70},
            '46497' : {'width' : 124.5 , 'height' : 70},
            '28630' : {'width' : 124.5 , 'height' : 70},
            '50193' : {'width' : 124.5 , 'height' : 70},
            '42979' : {'width' : 124.5 , 'height' : 70},
            '28644' : {'width' : 124.5 , 'height' : 70},
            '45399' : {'width' : 124.5 , 'height' : 70},
            '28268' : {'width' : 124.5 , 'height' : 70},
            '28794' : {'width' : 124.5 , 'height' : 70},
            '28788' : {'width' : 124.5 , 'height' : 70},
            '28384' : {'width' : 124.5 , 'height' : 70},
            '28546' : {'width' : 124.5 , 'height' : 70},
            '28174' : {'width' : 124.5 , 'height' : 70},
            '28440' : {'width' : 124.5 , 'height' : 70},
            '28772' : {'width' : 124.5 , 'height' : 70},
            '28912' : {'width' : 124.5 , 'height' : 70},
            '28758' : {'width' : 124.5 , 'height' : 70},
            '28388' : {'width' : 124.5 , 'height' : 70},
            '28382' : {'width' : 124.5 , 'height' : 70},
            '28484' : {'width' : 124.5 , 'height' : 70},
            '28796' : {'width' : 124.5 , 'height' : 70},
            '28200' : {'width' : 124.5 , 'height' : 70},
            '28522' : {'width' : 124.5 , 'height' : 70},
            '28622' : {'width' : 124.5 , 'height' : 70},
            '29449' : {'width' : 124.5 , 'height' : 70},
            '28516' : {'width' : 124.5 , 'height' : 70},
            '28496' : {'width' : 124.5 , 'height' : 70},
            '28406' : {'width' : 124.5 , 'height' : 70},
            '28344' : {'width' : 124.5 , 'height' : 70},
            '28300' : {'width' : 124.5 , 'height' : 70},
            '28312' : {'width' : 124.5 , 'height' : 70},
            '28790' : {'width' : 124.5 , 'height' : 70},


            '28776' : {'width' : 94.5 ,  'height' : 70},
            '28350' : {'width' : 94.5 ,  'height' : 70},
            '28348' : {'width' : 94.5 ,  'height' : 70},
            '28172' : {'width' : 94.5 ,  'height' : 70},
            '28274' : {'width' : 94.5 ,  'height' : 70},
            '28228' : {'width' : 94.5 ,  'height' : 70},
            '28218' : {'width' : 94.5 ,  'height' : 70},
            '28716' : {'width' : 94.5 ,  'height' : 70},
            '28638' : {'width' : 94.5 ,  'height' : 70},
            '28628' : {'width' : 94.5 ,  'height' : 70},
            '28462' : {'width' : 94.5 ,  'height' : 70},
            '28336' : {'width' : 94.5 ,  'height' : 70},
            '28114' : {'width' : 94.5 ,  'height' : 70},
            '28514' : {'width' : 94.5 ,  'height' : 70},
            '28740' : {'width' : 94.5 ,  'height' : 70},
            '28422' : {'width' : 94.5 ,  'height' : 70},
            '28608' : {'width' : 94.5 ,  'height' : 70},
            '28696' : {'width' : 94.5 ,  'height' : 70},
            '28564' : {'width' : 94.5 ,  'height' : 70},
            '28328' : {'width' : 94.5 ,  'height' : 70},
            '28178' : {'width' : 94.5 ,  'height' : 70},
            '28130' : {'width' : 94.5 ,  'height' : 70},
            '28248' : {'width' : 94.5 ,  'height' : 70},
            '28296' : {'width' : 94.5 ,  'height' : 70},
            '28358' : {'width' : 94.5 ,  'height' : 70},
            '28354' : {'width' : 94.5 ,  'height' : 70},
            '28408' : {'width' : 94.5 ,  'height' : 70},
            '28400' : {'width' : 94.5 ,  'height' : 70},
            '28414' : {'width' : 94.5 ,  'height' : 70},
            '28510' : {'width' : 94.5 ,  'height' : 70},
            '28582' : {'width' : 94.5 ,  'height' : 70},
            '28594' : {'width' : 94.5 ,  'height' : 70},
            '28604' : {'width' : 94.5 ,  'height' : 70},
            '28558' : {'width' : 94.5 ,  'height' : 70},
            '28724' : {'width' : 94.5 ,  'height' : 70},
            '28438' : {'width' : 94.5 ,  'height' : 70},
            '28430' : {'width' : 94.5 ,  'height' : 70},
            '28356' : {'width' : 94.5 ,  'height' : 70},
            '28210' : {'width' : 94.5 ,  'height' : 70},
            '28128' : {'width' : 94.5 ,  'height' : 70},
            '28124' : {'width' : 94.5 ,  'height' : 70},
            '28472' : {'width' : 94.5 ,  'height' : 70},
            '28720' : {'width' : 94.5 ,  'height' : 70},
            '28814' : {'width' : 94.5 ,  'height' : 70},
            '28460' : {'width' : 94.5 ,  'height' : 70},
            '28302' : {'width' : 94.5 ,  'height' : 70},
            '28122' : {'width' : 94.5 ,  'height' : 70},
            '28470' : {'width' : 94.5 ,  'height' : 70},
            '28498' : {'width' : 94.5 ,  'height' : 70},
            '28710' : {'width' : 94.5 ,  'height' : 70},
            '28686' : {'width' : 94.5 ,  'height' : 70},
            '28304' : {'width' : 94.5 ,  'height' : 70},
            '28442' : {'width' : 94.5 ,  'height' : 70},
            '28204' : {'width' : 94.5 ,  'height' : 70},
            '28234' : {'width' : 94.5 ,  'height' : 70},
            '28668' : {'width' : 94.5 ,  'height' : 70},
            '28508' : {'width' : 94.5 ,  'height' : 70},
            '28602' : {'width' : 94.5 ,  'height' : 70},
            '28874' : {'width' : 94.5 ,  'height' : 70},
            '28180' : {'width' : 94.5 ,  'height' : 70},
            '28192' : {'width' : 94.5 ,  'height' : 70},
            '28362' : {'width' : 94.5 ,  'height' : 70},
            '28320' : {'width' : 94.5 ,  'height' : 70},
            '28270' : {'width' : 94.5 ,  'height' : 70},
            '28182' : {'width' : 94.5 ,  'height' : 70},
            '28364' : {'width' : 94.5 ,  'height' : 70},
            '28376' : {'width' : 94.5 ,  'height' : 70},
            '28476' : {'width' : 94.5 ,  'height' : 70},
            '28618' : {'width' : 94.5 ,  'height' : 70},
            '28562' : {'width' : 94.5 ,  'height' : 70},
            '28392' : {'width' : 94.5 ,  'height' : 70},
            '28168' : {'width' : 94.5 ,  'height' : 70},
            '28392' : {'width' : 94.5 ,  'height' : 70},
            '28342' : {'width' : 94.5 ,  'height' : 70},
            '28766' : {'width' : 94.5 ,  'height' : 70},
            '28708' : {'width' : 94.5 ,  'height' : 70},
            '28890' : {'width' : 94.5 ,  'height' : 70},
            '28562' : {'width' : 94.5 ,  'height' : 70},
            '28680' : {'width' : 94.5 ,  'height' : 70},
            '28744' : {'width' : 94.5 ,  'height' : 70},
            '28266' : {'width' : 94.5 ,  'height' : 70},
            '28310' : {'width' : 94.5 ,  'height' : 70},
            '28648' : {'width' : 94.5 ,  'height' : 70},
            '28500' : {'width' : 94.5 ,  'height' : 70},
            '28154' : {'width' : 94.5 ,  'height' : 70},
            '28146' : {'width' : 94.5 ,  'height' : 70},
            '28674' : {'width' : 94.5 ,  'height' : 70},
            '28464' : {'width' : 94.5 ,  'height' : 70},
            '28410' : {'width' : 94.5 ,  'height' : 70},
            '28308' : {'width' : 94.5 ,  'height' : 70},
            '28518' : {'width' : 94.5 ,  'height' : 70}


        }
    };

    // 確認利外是否存在
    var IsGameCodeExist = false;
    var IsGameHallExist =  typeof special_size[gamehall] !== "undefined"  ? true : false ;
    if (IsGameHallExist){
         IsGameCodeExist =  typeof special_size[gamehall][gamecode] !== "undefined"  ? true : false ;
    }

    // 計算解析度 如果電腦解析度太小 需要一定比例縮小
    var user_height = window.screen.height;
    var user_width = window.screen.width;
    console.log(user_width +"x"+user_height);

    var base = 10;

    if(user_height <1000 ){
        var base = 8;
    }
    if(user_width < 1600){
        var base = 8;
    }
    if(user_width < 1300){
        var base = 7.5;
    }
    if(user_width < 1000){
        var base = 6;
    }
    //如果例外存在
    if(IsGameCodeExist){
            width_rate = special_size[gamehall][gamecode]['width'];
            height_rate = special_size[gamehall][gamecode]['height'];
    }else{

        if(gamehall=="TTGS"){
            width_rate = 125.5;
            height_rate = 80;

        }else if(gamehall=="PT"){
            width_rate = 103.5;
            height_rate = 80;

        }else if(gamehall=="SSWFG" || gamehall=="FG" ){
            width_rate = 142.5;
            height_rate = 80;
        }else if(gamehall=="PS"){
            width_rate = 142;
            height_rate = 80;
        }else if(gamehall=="PTS"){
            width_rate = 142;
            height_rate = 80;
        }else if(gamehall=="UC8S"){
            width_rate = 116;
            height_rate = 80;
        }else if(gamehall=="MG" || gamehall=="LAPIS2"){
            //width_rate = 124.5;
            width_rate = 93.5;
            height_rate = 70;
        }else if(gamehall=="AG" || gamehall=="AGSW"){
            width_rate = 128;
            height_rate = 80;
        }else if(gamehall=="PNG"){
            base = 10;
            width_rate = 79.7;
            height_rate = 60;
        }else if(gamehall=="NPG"){
            width_rate = 142;
            height_rate = 93;
        }else{
            width_rate = 103.5;
            height_rate = 80;
        }
    }
// 設定

    var width = base*width_rate + 30;
    var height = base*height_rate + 30 ;
    //var height = innerHeight + 45 ;
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if(isSafari){
        height = height + 45 ;
    }
    //console.log(width+'x'+height);
    //console.log('width='+width+',height='+height+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no");
    //window.open(""+url,'','width='+width+',height='+height+',innerHeight='+innerHeight);
    var url='VueGameHall.php?'+'&game='+gamehall + '&name=' + gamecode + '&optionValue1=' + optionValue1 + '&optionValue2=' +  optionValue2 + '&optionValue3=' + optionValue3+ '&free=' + free+ '&lby=' + lby + '&this_game_name=' + this_game_name;
    window.open(""+url,'','width='+width+',height='+height+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no");

}
function callPhoneAdminOnline(calling_to,input_class){
    var tmpPhoneClass = input_class || '';
    if(tmpPhoneClass !== ''){
        var tmpPhoneValue = $('.'+tmpPhoneClass).val();
    }
    $.ajax({
        type: "post",
        url: "Action/ActPhoneAdminOnline.php?act=PhoneMarketingAPI_ApplyRecall",
        data: {calling_to:calling_to,phone_value:tmpPhoneValue},
        dataType: "json",
        async: false,
        success: function (rst) {
            if (rst.IsSuccess) {
                lim_dialog.Alert(
                    '提示',
                    '<p>您的申请已提交，</p>'+
                    '<p>请保持电话畅通等待客户开发经理与您联系，感谢您的支持</p>',
                    '',
                    '',
                    {},
                    {text:"确定"}
                );
            } else {
                lim_dialog.Alert(
                    '提示',
                    '<p>'+rst.Message+'</p>',
                    '',
                    '',
                    {},
                    {text:"确定"}
                );
            }
        }
    });
}
