var MaintenanceNotice = (function ($) {
    var notice_arrays = null;
    var maintenance_notice_count=0;
    var private_method = {
        callAjax: function (act, param, cb) {
            $.ajax({
                type: "post",
                url: "Action/ActMaintenanceNotice.php?act=" + act,
                data: param,
                dataType: "json",
                success: function (response) {
                    if (_.isFunction(cb)) {
                        cb(response);
                    }
                },
                error: function (response) {
                    console.error('callAjax error', response);
                }
            });

        },
        getMaintenanceNoticeAjax: function (cb) {
            private_method.callAjax("GetMaintenanceNoticeAjax", {}, cb);
        },
    };

    var showNoticeDialog = function showNoticeDialog(list) {
        //alert('测试用' + list.Content);
        maintenance_notice_count++;
        //console.log(maintenance_notice_count);
        jQuery('.js-maintenance_date',"#gamehall_maintenance_notice").text(list.LastUpdate);
        jQuery('.js-maintenance_content',"#gamehall_maintenance_notice").text(list.Content);
        jQuery("#gamehall_maintenance_notice").modal({
            zIndex: 10000,
            escapeClose: true,
            closeText: 'x',
            showClose: false,
            clickClose: false
        });
    };
    var Init = function Init(succ_func) {
        private_method.getMaintenanceNoticeAjax(function (rst) {
            if (rst.IsSuccess) {
                //console.log(rst);
                notice_arrays = rst.Value;
                if (_.isFunction(succ_func)) {
                    succ_func();
                }
            } else {
                console.error(rst);
            }
        });
    }

    var CheckShowNotice = function CheckShowNotice() {
        if (notice_arrays === null ) {
            console.error("js MaintenanceNotice notice_array is null");
            return ;
        }
        if (cmail.length > 0 ) {
            console.error("have cmail");
            return;
        }else if(notice_arrays.length <= 0){
            //console.log("no notice_arrays");
            return;
        }else if(typeof(has_news_modal_is_show) !==  "undefined" && has_news_modal_is_show){
            //console.log("news_modal_is_show");
            return;
        }else{
            if(maintenance_notice_count > 0){
                jQuery.modal.close();
            }
            _.each(notice_arrays, function (list) {
                var tmp_cookiename=list.cookie_name;
                var tmp_cookie = $.cookie(tmp_cookiename);
                if (typeof tmp_cookie === 'undefined' ) {
                    var strtime = list.future_maintain_datetime;
                    var date = new Date(strtime);

    //                    date = new Date();
    //                    date.setTime(date.getTime() + (1 * 1000));  //設定時間

                    $.cookie(tmp_cookiename, '1', {expires: date});   //給cookie一個值,存活時間為 date
                    showNoticeDialog(list);
                    return false;
                } else {
                    return true;
                }
            });
        }
    };

    return {
        Init: Init,
        CheckShowNotice,CheckShowNotice
    };
}(jQuery));