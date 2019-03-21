jQuery(function($) {

    // envelope movement

    $(document).mousemove(function(e) {
        var x = e.pageX;
        var y = e.pageY;

        var x1 = -221 + x / 90;
        var x2 = -87 + x / 90;
        var x3 = 501 + x / 90;
        var y1 = 76 + y / 60;
        var y2 = 160 + y / 60;
        var y3 = 130 + y / 60;




        $(".float-env1").css({ "left": x1 + 'px', "top": y1 + 'px' });
        $(".float-env2").css({ "left": x2 + 'px', "top": y2 + 'px' });
        $(".float-env3").css({ "left": x3 + 'px', "top": y3 + 'px' });

    });

    $(".soundContainer").on('mouseenter', function(event) {
        $(".soundPop").stop().fadeIn();
    }).on('mouseleave', function(event) {
        $(".soundPop").stop().fadeOut();
    });


    // BGM
    $('<embed id="bgm" src="audio/bgm.mp3"></embed>').prependTo('body');
    var bgm = setInterval(function() {
        $("#bgm").remove();
        $('<embed id="bgm" src="audio/bgm.mp3"></embed>').prependTo('body');
    }, 43000);

    $(".soundContainer").on('click', function(event) {
        $("embed#bgm").remove();
        clearInterval(bgm);
        if ($(".soundContainer > .sound").hasClass('soundOn')) {
            $(".soundContainer > .sound").addClass('soundOff');
            $(".soundContainer > .sound").removeClass('soundOn');
            $("audio").get(0).pause();
        } else {
            $(".soundContainer > .sound").addClass('soundOn');
            $(".soundContainer > .sound").removeClass('soundOff');
            $("audio").get(0).play();
        }
    });

    // animation for carousel items
    var $c = $('#carousel'),
        $d = $('#carousel2'),
        $w = $(window);
    // row 1
    $c.carouFredSel({
        items: 5,
        direction: "left",
        scroll: {
            items: 9,
            duration: 20000,
            timeoutDuration: 0,
            easing: 'linear'
        }
    });
    // row 2
    $d.carouFredSel({
        items: 5,
        direction: "right",
        scroll: {
            items: 9,
            duration: 20000,
            timeoutDuration: 0,
            easing: 'linear'
        }
    });


    $w.bind('resize.example', function() {
        var nw = $w.width();
        if (nw < 990) {
            nw = 990;
        }

        $c.width(nw * 3);
        $c.parent().width(nw);

    }).trigger('resize.example');

    // check of loggedIn
    var loggedIn = 0;
    // on click log in
    $("#login-submit").on('click', function(event) {
        loggedIn = 1;
        $(".pop,.pop-login").fadeOut();
    });

    // clicked green to play
    $(".green").on('click', function(event) {
        // before playing check if logged in
      
        if (loggedIn == 0) {
            $(".pop,.pop-login").fadeIn();
        } else {
              $(".claw-content").removeClass('sway');
            $(".fr1-p1,.fr1-p2,.fr1-p3,.fr1-p4").addClass('blur');

            if ($(this).hasClass('g-300')) {
                $(".g-300, .gr-300").hide();
            }
            else if($(this).hasClass('g-5000')) {
                $(".g-5000, .gr-5000").hide();
            }
            else if($(this).hasClass('g-3000')) {
                $(".g-3000, .gr-3000").hide();
            }
            
            //stop existing carousel
            $c.trigger("finish");
            $d.trigger("finish");

            // reinitialize to change speed
            $c.carouFredSel({
                items: 5,
                direction: "left",
                scroll: {
                    items: 9,
                    duration: 800,
                    timeoutDuration: 0,
                    easing: 'linear'
                }
            });

            $d.carouFredSel({
                items: 5,
                direction: "right",
                scroll: {
                    items: 9,
                    duration: 800,
                    timeoutDuration: 0,
                    easing: 'linear'
                }
            });

            // animate claw
            $(".claw-content").animate({
                'top': '185px'
            }, 800);
            mySound = new Audio('audio/claw-sound.mp3');
            mySound.play();

            setTimeout(function() {
                AnimateRotate(43, -43);
            }, 100);

        }

    });

  

    // after closing pop up prize to play remaining green buttons
    $(".pop-prize > .pop-close").on('click',  function(event) {
        // reset values for pop prize
        $(".pop-icon").removeClass(popIcon);
        $(".pop-value").removeClass(popVal);

        // reset position and caught prize from claw
        $(".pop-icon").css({'top':'200px'}).removeClass('wobble-hor-bottom');

        // on drop dust cloud animation reset
        $(".clouds > .cloud1").removeClass('clouds-left').hide();
        $(".clouds > .cloud2").removeClass('clouds-right').hide();


        //  background shine and stars reset
        $(".star, .shine").fadeOut("fast");
        $(".pop-value").removeClass('pop-value-scale');



         $(".rndPrize").removeClass(imgPrize);
         $(".prizeAmt").removeClass(amtPrize);
        $(".rndPrize").css({'top':'0'});
         $(".claw-content").addClass('sway');
         $(".claw-left").css({
            '-webkit-transform': 'rotate(-8deg)',
            '-moz-transform': 'rotate(-8deg)',
            '-ms-transform': 'rotate(-8deg)',
             '-o-transform': 'rotate(-8deg)',
                'transform': 'rotate(-8deg)'
         });
         $(".claw-right").css({
            '-webkit-transform': 'rotate(8deg)',
            '-moz-transform': 'rotate(8deg)',
            '-ms-transform': 'rotate(8deg)',
             '-o-transform': 'rotate(8deg)',
                'transform': 'rotate(8deg)'
         });
         // stop existing carousel
        $("#carousel").trigger('finish');
        $("#carousel2").trigger('finish');
        // reinitialize after every play
         $("#carousel").carouFredSel({
            items: 5,
            direction: "left",
            scroll: {
                items: 9,
                duration: 20000,
                timeoutDuration: 0,
                easing: 'linear'
            }
        });
        // row 2
        $("#carousel2").carouFredSel({
            items: 5,
            direction: "right",
            scroll: {
                items: 9,
                duration: 20000,
                timeoutDuration: 0,
                easing: 'linear'
            }
        });
    });


    $(".pop-close, .pop-close2, .pop-close3").on('click', function(event) {
        $(".pop,.pop-prize,.pop-rules,.pop-login,.pop-activities").fadeOut();
    });

    $(".btn2").on('click', function(event) {
        $(".pop,.pop-rules").fadeIn();
    });

    $(".btn1").on('click', function(event) {
        $(".pop,.pop-activities").fadeIn();
    });

});

  // variables - prize holder
    var imgPrize = "";
    var amtPrize = 0;
    var popIcon = "";
    var popVal = "";

function AnimateRotate(angle, angle2) {

    // claws
    var $elem = $(".claw-left");
    var $elem2 = $(".claw-right");

    // opening animation of claws
    $({ deg: -8 }).animate({ deg: angle }, {
        duration: 300,
        step: function(now) {

            $elem.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });

    $({ deg: 8 }).animate({ deg: angle2 }, {
        duration: 300,
        step: function(now) {

            $elem2.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });


    // closing animation of claws
    setTimeout(function() {


        $({ deg: 43 }).animate({ deg: 0 }, {
            duration: 200,
            step: function(now) {

                $elem.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },

            // on complete gettting prize claw goes up

            complete: function() {

                $("#carousel").stop();
                $("#carousel2").stop();

                $(".fr1-p1,.fr1-p2,.fr1-p3,.fr1-p4").removeClass('blur');
                // animation random prize for claw
                var prizeList = [18, 28, 38, 68, 88, 128, 188, 588, 1688];
                var rndNum = Math.floor(Math.random() * prizeList.length);
                var prize = prizeList[rndNum];
                console.log(prize);
                // prizes
                switch (prize) {
                    case 18:
                        $(".rndPrize").addClass('fr1-p3');
                        $(".rndPrize > div").addClass('prizeAmt pri-18');
                        imgPrize = "fr1-p3";
                        amtPrize = "pri-18";
                        setTimeout(function() {
                            showPopPrize("pop-p1", "prizeAmt2 pri-18");
                        }, 1100);
                        break;
                    case 28:
                        $(".rndPrize").addClass('fr1-p1');
                        $(".rndPrize > div").addClass('prizeAmt pri-28');
                        imgPrize = "fr1-p1";
                        amtPrize = "pri-28";
                        setTimeout(function() {
                            showPopPrize("pop-p3", "prizeAmt2 pri-28");
                        }, 1100);
                        break;
                    case 38:
                        $(".rndPrize").addClass('fr1-p2');
                        $(".rndPrize > div").addClass('prizeAmt pri-38');
                        imgPrize = "fr1-p2";
                        amtPrize = "pri-38";
                        setTimeout(function() {
                            showPopPrize("pop-p2", "prizeAmt2 pri-38");
                        }, 1100);
                        break;
                    case 68:
                        $(".rndPrize").addClass('fr1-p1');
                        $(".rndPrize > div").addClass('prizeAmt pri-68');
                        imgPrize = "fr1-p1";
                        amtPrize = "pri-68";
                        setTimeout(function() {
                            showPopPrize("pop-p3", "prizeAmt2 pri-68");
                        }, 1100);
                        break;
                    case 88:
                        $(".rndPrize").addClass('fr1-p2');
                        $(".rndPrize > div").addClass('prizeAmt pri-88');
                        imgPrize = "fr1-p2";
                        amtPrize = "pri-88";
                        setTimeout(function() {
                            showPopPrize("pop-p2", "prizeAmt2 pri-88");
                        }, 1100);
                        break;
                    case 128:
                        $(".rndPrize").addClass('fr1-p3');
                        $(".rndPrize > div").addClass('prizeAmt pri-128');
                         imgPrize = "fr1-p3";
                        amtPrize = "pri-128";
                        setTimeout(function() {
                            showPopPrize("pop-p1", "prizeAmt2 pri-128");
                        }, 1100);
                        break;
                    case 188:
                        $(".rndPrize").addClass('fr1-p2');
                        $(".rndPrize > div").addClass('prizeAmt pri-188');
                         imgPrize = "fr1-p2";
                        amtPrize = "pri-188";
                        setTimeout(function() {
                            showPopPrize("pop-p2", "prizeAmt2 pri-188");
                        }, 1100);
                        break;
                    case 588:
                        $(".rndPrize").addClass('fr1-p1');
                        $(".rndPrize > div").addClass('prizeAmt pri-588');
                         imgPrize = "fr1-p1";
                        amtPrize = "pri-588";
                        setTimeout(function() {
                            showPopPrize("pop-p3", "prizeAmt2 pri-588");
                        }, 1100);
                        break;
                    case 1688:
                        $(".rndPrize").addClass('fr1-p3');
                        $(".rndPrize > div").addClass('prizeAmt pri-1688');
                         imgPrize = "fr1-p3";
                        amtPrize = "pri-1688";
                        setTimeout(function() {
                            showPopPrize("pop-p1", "prizeAmt2 pri-1688");
                        }, 1100);
                        break;
                    // case 'phone':
                    //     $(".rndPrize").addClass('pri4-claw');
                    //     $(".rndPrize > div").addClass('phonePrizeAmt2 pri-phone');
                    //     setTimeout(function() {
                    //         showPopPrize("pop-phone", "prizeAmt2 pri-phone");
                    //     }, 1100);
                    //     break;
                }

                $(".claw-content").animate({
                    'top': '10px'
                }, 1000);

                // if ($(".rndPrize").hasClass('pri4-claw')) {

                //     // if ie animation on claw up
                //     if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
                //         $(".rndPrize").animate({
                //             'top': '-157px'
                //         }, 1000);
                //     } else {
                //         $(".rndPrize").animate({
                //             'top': '-157px'
                //         }, 1000);
                //     }


                // } else 


                // if ie animation on claw up
                if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
                    $(".rndPrize").animate({
                        'top': '-186px'
                    }, 1000);
                } else {
                    $(".rndPrize").animate({
                        'top': '-186px'
                    }, 1000);
                }
                
            }
        });

        $({ deg: -43 }).animate({ deg: 0 }, {
            duration: 200,
            step: function(now) {

                $elem2.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
        });


    }, 1000);
}


// pop up prize

function showPopPrize(icon, prize) {
    $(".pop,.pop-prize").fadeIn();
    $(".pop-icon").addClass(icon);
    $(".pop-value").fadeIn().addClass(prize);

    popIcon = icon;
    popVal = prize;

    // claws
    var $clawLeft = $(".popclaw-left");
    var $clawRight = $(".popclaw-right");

    // opening animation of claws
    $({ deg: 1 }).animate({ deg: 24 }, {
        duration: 500,
        step: function(now) {
            $clawLeft.css({
                transform: 'rotate(' + now + 'deg)'
            });
        },



    });

    $({ deg: -1 }).animate({ deg: -24 }, {
        duration: 500,
        step: function(now) {

            $clawRight.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });

    // animation for falling prize
    setTimeout(function() {

        var $popicon = $(".pop-icon");
        $popicon.animate({ 'top': '329px' }, 300).addClass('wobble-hor-bottom');
    }, 250);

    // on drop dust cloud animation
    $(".clouds > .cloud1").delay(450).queue(function(next) {
        $(this).fadeIn().addClass('clouds-left')
        next();
    });

    $(".clouds > .cloud2").delay(450).queue(function(next) {
        $(this).fadeIn().addClass('clouds-right')
        next();
    });
    //  background shine and stars
    $(".star, .shine").delay(1200).fadeIn("slow");

    $(".pop-value").delay(1200).queue(function(next) {
        $(this).addClass('pop-value-scale');
        next();
    });

}



