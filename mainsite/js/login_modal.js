
//bing eneter event
jQuery( function() {

    jQuery('#login-password').keypress(function (e) {
        if (e.keyCode == 13)
            jQuery('#login-submit').click();
    });
    jQuery('#login-valid-code').keypress(function (e) {
        if (e.keyCode == 13)
            jQuery('#login-valid-submit').click();
    });

});


//重複避免重複案ENTER
var loginbtn_flag = 0 ;
function login(ajaxpath){
    ajaxpath = ajaxpath || "";
    if(loginbtn_flag != 0){
        return false;
    }


    loginbtn_flag = 1;
    var userid = jQuery("#login-userid").val();
    var password = jQuery("#login-password").val();


    jQuery("#login-submit").hide();
    jQuery("#login-hint").show();
    jQuery.post(ajaxpath+"Action/AjaxLogin.php",{lg_userid:userid,lg_pwd:password},function(rt){
        loginbtn_flag = 0;
        jQuery("#login-hint").hide();
        jQuery("#login-submit").show();

        var response = JSON.parse(rt);
      if(response.err == 1000){
       // alert(response.msg);
        window.location.reload();
      } else if(response.err==900) {
        showValidmodal(ajaxpath);

      } else{
        alert(response.msg);
      }

  });

}

 function loginWithValidCode(ajaxpath){
    ajaxpath = ajaxpath || "";
    jQuery(".valid_close_modal").click();

    var userid = jQuery("#login-userid").val();
    var password = jQuery("#login-password").val();
    var valid_code = jQuery("#login-valid-code").val();

    jQuery("#login-submit").hide();
    jQuery("#login-hint").show();

    jQuery.post(ajaxpath+"Action/AjaxLogin.php",{lg_userid:userid,lg_pwd:password,valid_code:valid_code},function(rt){
        loginbtn_flag = 0;
        jQuery("#login-hint").hide();
        jQuery("#login-submit").show();

        var response = JSON.parse(rt);
      if(response.err == 1000){
        //alert(response.msg);
        window.location.reload();
      } else if(response.err==900) {
        showValidmodal(ajaxpath);

      } else{
        alert(response.msg);
      }

  });


 }


function showValidmodal(ajaxpath){
  ajaxpath = ajaxpath || "";
  jQuery(".valid_close_modal").click(function(){
      jQuery.modal.close();
  });
    reloadVCodeLogin("login-vcode","section=login",ajaxpath);

      jQuery("#validCode_modal").modal({
        zIndex: 10000,
        escapeClose: true,
        closeText: 'x',
        showClose: false,
        clickClose: false
    });
     // sendvalidemail();


}


function reloadVCodeLogin(id,type,ajaxpath) {
  ajaxpath = ajaxpath || "";
    jQuery('#'+id).attr("src",ajaxpath+"verify/gd_vfont.php?"+type+"&t="+(new Date()).getTime()   );
}