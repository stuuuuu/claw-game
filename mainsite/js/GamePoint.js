var GamePoint = (function ($) {
    var     for_log_last_sn = '';
    var
            wallet_list = null
            ;
    var getOnePointAjax = function (sn, callback) {
        if (wallet_list === null) {
            wallet_list = getNormalWalletList();
        }
        $.post("Action/ActGetGamePoint.php?act=GetGamePoint", {
            game: wallet_list[sn],
            idx: sn,
            is_single_deemed_center:true
        }, function (cb) {
            if(cb.nk == '-1' && cb.err == '-999') {
                alert(cb.err_msg);
                location.reload();
                return false;
            }
            // cb.nk is sn
            callback(cb);
        }, "json");

    };
    var getNormalWalletList = function () {
        var ans = null;
        $.ajax({
            type: "post",
            url: "Action/ActGetGamePoint.php?act=GetNormalWalletListAjax",
            data: {},
            dataType: "json",
            async: false,
            success: function (rst) {
                if (rst.err == 1000) {
                    ans = rst.msg;
                    wallet_list = rst.msg;
                } else {
                    if(typeof pagefrom === "undefined" || (typeof pagefrom !== "undefined" && pagefrom !== "cashier")) {
                        console.error('GetNormalWalletListAjax', '取得转帐钱包失败', rst.msg);
                    }
                    ans = null;
                }
            }
        });
        return ans;
    };
    var TranAllPointTo = function (sn, skip_tran_to_center_flag, callback) {
        skip_tran_to_center_flag = skip_tran_to_center_flag || "";
        callback = callback || function(){};
        $.ajax({
            type: "post",
            url: "Action/ActApplyPointChange.php?act=AllWalletTranAjax",
            data: {tran_target_sn: sn, skip_tran_to_center_flag: skip_tran_to_center_flag},
            dataType: "json",
            success: function (rst) {
                if (rst.err == 1000) {
                } else {
                    if(typeof pagefrom === "undefined" || (typeof pagefrom !== "undefined" && pagefrom !== "cashier")) {
                        console.error('TranAllPointTo', '部分转帐失败', rst.msg);
                    }
                }
                callback();
            },
            error: function (err) {
            }
        });
    };
    var RefreshAll = function (_option, callback) {
        if (wallet_list === null) {
            wallet_list = getNormalWalletList();
        }
        var option = _option || {without: []};
        var refreshLockCount = 0;
        $("[data-game]").text("载入中..");
        $("[data-settype=allpoint]").text("载入中..");
        for (var sn in wallet_list) {
            if ($.inArray(parseInt(sn, 10), option.without) !== -1) { // 不载入的馆别
                $("[data-col=total][data-game='" + sn + "']").text('-');
                continue;
            }
            refreshLockCount++;
            getOnePointAjax(sn, function (getData) {
                refreshLockCount--;
                cb = getData;
                if (cb.nk == -1) {
                    $("[data-settype=allpoint]").text(new Number(cb.point).toFixed(2));
                } else {
                    $("[data-col=total][data-game='" + cb.nk + "']").text(new Number(cb.point * 1.0 + cb.bonus * 1.0).toFixed(2));
                }
            });
        }
    };

    var RefreshCenter = function (_option, callback) { // for all have prop [data-settype=allpoint] center point
        var callback = callback || function(){};
        if (wallet_list === null) {
            wallet_list = getNormalWalletList();
        }
        var refreshLockCount = 0;
        $("[data-settype=allpoint]").text("余额刷新中，请稍后...");
        refreshLockCount++;
        getOnePointAjax(-1, function (getData) {
            refreshLockCount--;
            cb = getData;
            if (cb.nk == -1) {
                $("[data-settype=allpoint]").text(new Number(cb.point).toFixed(2));
                callback();
            }
        });
    };
    var RefreshNowPoint_ScanAll = function (_option, callback) {
        var callback = callback || function(){};
        if (wallet_list === null) {
            wallet_list = getNormalWalletList();
        }
        var option = $.extend({without: [], wallet_list: wallet_list, loading_text: "余额刷新中，请稍后..."}, _option);
        var refreshLockCount = 0;
        var is_error = false;
        var err_msg = "(尚有部分余额同步不成功，请稍后再刷新重整)";
        var sum_point = 0;
        $("[data-settype=nowpoint]").text(option.loading_text);
        $("[data-settype=nowpointerr]").text("");
        for (var sn in option.wallet_list) {
            refreshLockCount++;
            getOnePointAjax(sn, function (getData) {
                refreshLockCount--;
                cb = getData;
                if (cb.err != '1000' && cb.err != null) {
                    is_error = true;
                }
                var hall_name = wallet_list[cb.nk];
                var point = new Number(cb.point).toFixed(2);
                point = parseFloat(point);
                //BBIN無法轉小數點 特別判斷
                // console.log(tmp_sn, hall_name );
                if (hall_name == 'BBIN') {
                    if (point < 1) {
		        point = 0;
                    } else {
                        point = Math.round(point);
                    }
                }
                if (!isNaN(point)) {
                    sum_point = parseFloat(sum_point) + parseFloat(point);
                    sum_point = Math.round(sum_point * 100) / 100;
                }
                if(refreshLockCount === 0) {
                    $("[data-settype=nowpoint]").text(
                        ((parseFloat(sum_point.toString()) == 0.0 && is_error) ? '--' : sum_point.toString())
                    );
                    $("[data-settype=nowpointerr]").text((is_error ? err_msg : ""));
                    callback();
                }
            });
        }
    };
    var RefreshNowPoint_ScanLastAndCenter = function (_option, callback) {
        var callback = callback || function(){};
        var wallet_list_ScanLastAndCenter = {};
        wallet_list_ScanLastAndCenter["-1"] = "center";
        var option = $.extend({without: [], loading_text: "余额刷新中，请稍后..."}, _option);
        $.ajax({
            type: "post",
            url: "Action/ActGetGamePoint.php?act=GetTransferLastGameAjax",
            data: {},
            dataType: "json",
            success: function (rst) {
                if (rst.IsSuccess && rst.Value['sync_flag'] == true) {
                    var hall_sn = rst.Value['game_sn'];
                    for_log_last_sn = hall_sn;
                    if(typeof wallet_list[hall_sn] !== "undefined") {
                        wallet_list_ScanLastAndCenter[hall_sn] = wallet_list[hall_sn];
                    }
                    option = $.extend({without: [], wallet_list: wallet_list_ScanLastAndCenter,loading_text: option.loading_text}, _option);
                    RefreshNowPoint_ScanAll(option, callback);
                } else {
                    if (wallet_list === null) {
                        wallet_list = getNormalWalletList();
                    }
                    option = $.extend({without: [], wallet_list: wallet_list,loading_text: option.loading_text}, _option);
                    RefreshNowPoint_ScanAll(option, callback);
                }
            }
        });
    };
    var GetTransferLastGame = function (_option, callback) {
        $.ajax({
            type: "post",
            url: "Action/ActGetGamePoint.php?act=GetTransferLastGameAjax",
            data: {},
            dataType: "json",
            success: function (rst) {
                if (rst.IsSuccess && rst.Value['sync_flag'] == true) {
                    var hall_sn = rst.Value['game_sn'];
                    callback(hall_sn);
                } else {
                    alert('同步钱包失败！请稍后再试。');
                }
            }
        });
    };
    var CheckCloseGameWindow = function(sn) {
        
        getOnePointAjax(sn, function (getData) {
            cb = getData;
            var point = new Number(cb.point).toFixed(2);
            if (point.toString() !== '0.00') {
                //console.log('目前金额(1)',point.toString(),'||',cb.point);
                //$("[data-settype=nowpoint]").text(point.toString());
            }else{
                //console.log('目前金额(2)',point.toString(),'||',cb.point);
                ShowCloseGameDialog();
            }
        });
    };
    
    var Gamewindow_showGetAllPoint = function(sn, box_ID) {
        var box = $("#"+box_ID);
//        console.log(sn);
//        getOnePointAjax(sn, function (getData) {
//            cb = getData;
//            var point = new Number(cb.point).toFixed(2);
//            console.log('rrrrrr',point.toString());
//        });
        box.modal({
            zIndex: 5000,
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
    };
    
    var CheckScanAllHallTranAllPointToSnBtnCountDown = function(callback) {
        $.ajax({
            type: "post",
            url: "Action/ActGetGamePoint.php?act=CheckTranHallPointToCenterAjaxReturnSnCountDown",
            data: {last_hall_sn:for_log_last_sn},
            dataType: "json",
            success: function (rst) {
                callback(rst.Value);
            }, error: function (e) {
                console.log(e);
            }
        });
    };
    var ScanAllHallTranAllPointToSnBtnCountDown = function (btn, countdown_box, remaining_time) {
        if(countdown_box.length === 0) {
            return false;
        }
        var trans_all_to_center_countdown = setInterval(function () {
            remaining_time--;

            // var seconds = Math.floor(remaining_time) % 60;
            // var minutes = Math.floor(remaining_time / 60) % 60;

            // if ((seconds + "").length == 1) {
            //     seconds = "0".concat(seconds);
            // }
            // if ((minutes + "").length == 1) {
            //     minutes = "0".concat(minutes);
            // }

            countdown_box.html(remaining_time);
            if (remaining_time <= 0) {
                clearInterval(trans_all_to_center_countdown);
                btn.removeClass('disabled');
                btn.html('重新检查余额');
                return;
            }
        }, 1000);
    };
    var ScanAllHallTranAllPointToSn = function (this_sn , callback) {
        var callback = callback || function(){};
        if (wallet_list === null) {
            wallet_list = getNormalWalletList();
        }
        var refreshLockCount = 0;
        var sum_point = 0;
        var first_turn_out_all_status="";
        var tmpAllSuccess = true;
        var all_hall_name_data =  
        {
          PTN:'实验室SKYWIND馆'  , PT:'中国澳门PT馆' , AMAYA:'新加坡TTG馆',
          BBIN:'韩国BBIN馆'  , FG:'马来西亚3D馆' , PNG :'柬埔寨PNG馆',
          LAPIS2:'菲律宾MG馆' ,AG:'越南AG馆'     , PS  :'朝鲜PS馆',
          OW:'体育OW馆'      , PTS:'迪拜PTS馆'   , NPG:'彩票NP馆',
          BSG:'朝鲜PS馆'      , UC8S:'朝鲜PS馆'
        };
        
        var tmp_get_point_hall ={};
        
        var box =$('#gw_first_turn_out_all_status_modal');
        $('.js-turn_out_all_status_close_btn',box).prop("disabled",true);
        for (var sn in wallet_list) {
            if(sn != -1){
                
                tmp_get_point_hall[wallet_list[sn]]= wallet_list[sn];
                first_turn_out_all_status +="<div class='css-turn_out_hall' data-hall_sn="+sn+">"+all_hall_name_data[wallet_list[sn]]+"</div>";
                first_turn_out_all_status +="<div class='css-turn_out_status_load js-hall_sn_"+sn+"' data-hall_sn="+sn+">载入中...</div>";
                refreshLockCount++;
                
                $.ajax({
                    type: "post",
                    url: "Action/ActGetGamePoint.php?act=TranHallPointToCenterAjaxReturnSn",
                    data: {hall_sn: sn},
                    dataType: "json",
                    success: function (rst) {
                        refreshLockCount--;
                        var tmp_hall_sn = rst.Message;
                        var tmp_hall_sn_box=$(".js-hall_sn_"+tmp_hall_sn, box);
                        if (rst.IsSuccess) {
                            tmp_hall_sn_box.text('取得成功');
                            tmp_hall_sn_box.addClass('css-turn_out_status_IsSuccess');
                            
                        } else {
                            tmpAllSuccess = false;
                            tmp_hall_sn_box.text('取得失败');
                            tmp_hall_sn_box.addClass('css-turn_out_status_fail');
                        }
                        if(refreshLockCount === 0) {
                            $('.js-status_text',box).html("<div style='margin: 20px 0px;'>检查完成，正在帮您重新取得余额....</div>"); 
                            if(typeof pagefrom === "undefined" || (typeof pagefrom !== "undefined" && pagefrom !== "cashier")) {
                                console.log(tmpAllSuccess);
                            }
                            $.ajax({
                                type: "post",
                                url: "Action/ActGetGamePoint.php?act=TranCenterPointToHallAjax",
                                data: {hall_sn: this_sn , sync_flag:tmpAllSuccess},
                                dataType: "json",
                                success: function (sub_rst) {
                                    if (sub_rst.IsSuccess) {
                                        getOnePointAjax(this_sn, function (getData) {
                                            cb = getData;
                                            if (cb.err != '1000' && cb.err != null) {
                                                var is_error = true;
                                            }
                                            var hall_name = wallet_list[cb.nk];
                                            var point = new Number(cb.point).toFixed(2);
                                            point = parseFloat(point);
                                            //BBIN無法轉小數點 特別判斷
                                            // console.log(tmp_sn, hall_name );
                                            if (hall_name == 'BBIN') {
                                                if (point < 1) {
                                                    point = 0;
                                                } else {
                                                    point = Math.round(point);
                                                }
                                            }
                                            if (!isNaN(point)) {
                                                sum_point = parseFloat(sum_point) + parseFloat(point);
                                                sum_point = Math.round(sum_point * 100) / 100;
                                            }
                                            
                                            $("[data-settype=nowpoint]").text(
                                                ((parseFloat(sum_point.toString()) == 0.0 && is_error) ? '--' : sum_point.toString())
                                            );
                                            
                                            var tmptext= "";
                                            if(!tmpAllSuccess){
                                                tmptext= "<div style='margin-top: 1px;'>重新检查余额完成！您的余额为 <span style='color:#018bce'>"+sum_point+"</span> RMB</div>";
                                            
                                                tmptext+= "<div style='height: 14px;'>部份游戏馆余额暂时取得失败，可能该馆目前正在进行维护，</div>"+
                                                        "<div style='margin-bottom: 3px;'>请稍后至维护结束，或99秒之后您可以在重新执行余额检查。</div>";
                                            }else{
                                                tmptext= "<div style='margin-top: 20px; margin-bottom: 20px;'>重新检查余额完成！您的余额为<span style='color:#018bce'>"+sum_point+"</span>RMB</div>"+"";
                                            
                                            }
                                            $('.js-status_text',box).html(tmptext); 
                                        });
                                    } else {
                                        if(typeof pagefrom === "undefined" || (typeof pagefrom !== "undefined" && pagefrom !== "cashier")) {
                                            console.error('TranCenterPointToHallAjax', '中心钱包转回来失败', sub_rst.msg);
                                        }
                                    }
                                    setTimeout(function(){
                                        $('.js-turn_out_all_status_close_btn',box).prop("disabled",false);
                                    } , 3000);

                                }
                            });
                        }
                    }
                });
            }
        }
        
                
        for( var tmp_hall in all_hall_name_data ){
            if( typeof(tmp_get_point_hall[tmp_hall]) ===  "undefined"){
                first_turn_out_all_status +=
                    "<div class='css-turn_out_hall' data-hall_sn=-1"+">"+all_hall_name_data[tmp_hall]+"</div>"+
                    "<div class='css-turn_out_status_IsSuccess'>取得成功</div>";
            }
        }
        $('.js-gamehall_text',box).html(first_turn_out_all_status);
        jQuery("#gw_first_turn_out_all_status_modal").modal({
            zIndex: 5000,
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
        
        
    };
    
    var GameHallPointReloadBtnLock = function (time) {
        var btn = $('[data-btntype="reloadpoint"]');
        if (time <= 0) {
            btn.attr('disabled', false);
            btn.find('.js-btnName').text('刷新余额');
            return false;
        }
        btn.attr("disabled", true);
        btn.find('.js-btnName').html('<span class="countdown-time">' + time + '</span>秒后可点击刷新');
        setTimeout(function () {
            GameHallPointReloadBtnLock(time - 1, btn);
        }, 1000);
    };
    
    var showCheckAllPointDiv =function(option,hall_sn,point_unit,callback){
        GamePoint.RefreshNowPoint_ScanLastAndCenter(option, function() {
            if(point_unit.length > 0) {
                point_unit.show();
            }
            GamePoint.CheckScanAllHallTranAllPointToSnBtnCountDown(function(remaining_time) {
                var reloadAllHallGetPointBtn = $('.js-reload_all_hall_get_point');
                reloadAllHallGetPointBtn.unbind();
                if(remaining_time > 0) {
                    reloadAllHallGetPointBtn.addClass('disabled');
                    reloadAllHallGetPointBtn.html('<span class="js-reload-all-hall-point-countdown">' + remaining_time + '</span>秒后可点');
                    ScanAllHallTranAllPointToSnBtnCountDown(reloadAllHallGetPointBtn, $('.js-reload-all-hall-point-countdown'), remaining_time);
                } else {
                    reloadAllHallGetPointBtn.removeClass('disabled');
                    reloadAllHallGetPointBtn.html('重新检查余额');
                }
                $('.js-reload_all_hall_get_point').on('click', function() {
                    if(reloadAllHallGetPointBtn.hasClass('disabled')) {
                        return false;
                    }
                    GamePoint.ScanAllHallTranAllPointToSn(hall_sn, function() {});
                });
                GamePoint.Gamewindow_showGetAllPoint(hall_sn,'showGetAllPoint');
                callback();
            });
        });
    };
    
    var GameHallPointReload = function(hall_sn, loading_text, callback) {
        var callback = callback || function(){};
        loading_text = loading_text || "余额刷新中，请稍后...";
        var option = {
            loading_text: loading_text
        };
        $("[data-settype=nowpoint]").text(option.loading_text);
        $("[data-settype=nowpointerr]").text("");
        var point_unit = $('.js-refreshpoint-nowpoint-unit');
        if(point_unit.length > 0) {
            point_unit.hide();
        }
        var skip_tran_to_center_flag = true;
        console.log();
        if(hall_sn === 'onlyReload'){
            hall_sn = -1;
            showCheckAllPointDiv(option,hall_sn,point_unit,callback);
        }else{
            GamePoint.TranAllPointTo(hall_sn, skip_tran_to_center_flag, function() {
                showCheckAllPointDiv(option,hall_sn,point_unit,callback);
            });
        }
    };
    
    // initial
    getNormalWalletList();
    return {
        RefreshAll: RefreshAll,
        RefreshCenter: RefreshCenter,
        RefreshNowPoint_ScanLastAndCenter: RefreshNowPoint_ScanLastAndCenter,
        RefreshNowPoint_ScanAll: RefreshNowPoint_ScanAll,
        TranAllPointTo: TranAllPointTo,
        GetTransferLastGame: GetTransferLastGame,
        CheckCloseGameWindow: CheckCloseGameWindow,
        Gamewindow_showGetAllPoint:Gamewindow_showGetAllPoint,
        ScanAllHallTranAllPointToSnBtnCountDown: ScanAllHallTranAllPointToSnBtnCountDown,
        CheckScanAllHallTranAllPointToSnBtnCountDown: CheckScanAllHallTranAllPointToSnBtnCountDown,
        ScanAllHallTranAllPointToSn:ScanAllHallTranAllPointToSn,
        GameHallPointReloadBtnLock: GameHallPointReloadBtnLock,
        GameHallPointReload: GameHallPointReload
    };
}(jQuery));