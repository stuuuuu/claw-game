jQuery(document).ready(function () {
    var select_tab = "favorite";
    var select_type = "PTN";
    jQuery(".tab").click(function () {
        jQuery(".tab_list ~ div").css("display", "none");
        jQuery(".btn_list").css("display", "none");
        
                
            
        
        //点击搜索全站游戏
        var tmp_search_btn_id = jQuery('#bottom_menu_search_all_game_div');
        tmp_search_btn_id.removeClass('css-search_all_game_active');
        jQuery('.js-search_all_game').hide();
        if(jQuery(this).attr("id") ==="bottom_menu_search_all_game_div"){
            tmp_search_btn_id.addClass('css-search_all_game_active');
            jQuery('.js-search_all_game').show();
        }
        
        if (jQuery(this).attr("id") != "btn_trigger") {
            jQuery(".tab.is_clicked").removeClass("is_clicked");
            jQuery(this).addClass("is_clicked");
            jQuery(".tab_container").css("display", "block");
            select_tab = jQuery(".tab.is_clicked").attr("id");
            if(select_tab !== "bottom_menu_search_all_game_div"){
                jQuery(".btn_list").css("display", "block");
            }
            jQuery("#btn_trigger .txt").html("收起");
            jQuery(".img_btn_trigger").css("transform", "rotateZ(0deg)");
        } else {
            if (typeof (jQuery(".tab.is_clicked").attr("id")) == "undefined") {
                jQuery(".tab_container").css("display", "block");                
                jQuery("#btn_trigger").addClass("is_clicked");
                jQuery("#btn_trigger .txt").html("收起");
                jQuery(".img_btn_trigger").css("transform", "rotateZ(0deg)");
            } else {
                select_tab = jQuery(".tab.is_clicked").attr("id");
                jQuery("#" + select_tab).removeClass("is_clicked");
                jQuery("#btn_trigger .txt").html("展开");
                jQuery(".img_btn_trigger").css("transform", "rotateZ(-90deg)");
            }
        }

        //熱門遊戲時需顯示AG捕魚
        if(select_tab =="recently_hot"){
            jQuery("#AG").html("捕鱼王");
        }else{
            jQuery("#AG").html("越南馆");
        }
        
        

        jQuery('.game_list').load( 'Page_Bottom_menu_game.php?type='+select_type+'&tab='+select_tab,function(){
            jQuery(this).css("left",'0px');
        });
    });
    var offset = 0;
    jQuery(document).scroll(function (e) {
        jQuery('.bottom_menu').css({
            'left': offset - jQuery(document).scrollLeft()
        });
    });
    jQuery(".btn").click(function () {
        jQuery(".btn.is_clicked").removeClass("is_clicked");
        jQuery(this).addClass("is_clicked");
        select_type = jQuery(".btn.is_clicked").attr("id");
       // jQuery(".output").html("select_tab: " + select_tab + "<br/> select_type: " + select_type);//use for test
        jQuery('.game_list').load( 'Page_Bottom_menu_game.php?type='+select_type+'&tab='+select_tab,function(){
              jQuery(this).css("left",'0px');

        });
    });
    jQuery(".btn_next").click(function () {
        jQuery(".game_list").finish();
        gamelist_pos = parseInt(jQuery(".game_list").css("left"));
        if (gamelist_pos - 760 > -1 * parseInt(jQuery(".game_list").css("width")))
        jQuery(".game_list").animate({"left": "-=130px"}, "1500");
    });
    jQuery(".btn_back").click(function () {
        jQuery(".game_list").finish();
        gamelist_pos = parseInt(jQuery(".game_list").css("left"));
        if (gamelist_pos < 0)
        jQuery(".game_list").animate({"left": "+=130px"}, "1500");
    });
});
