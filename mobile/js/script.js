$(document).ready(function(){

  var clickToPlayOnce = true, //one click
  randomNumber = null, //generated number
  lucky_index = 7; //index in the initial load where to pick the prize
  promo_classification = null, //classification from 1-3 depending on deposits
  isLogin = false,
  numberOfPrize = 9;

  // *********
  //do not change for animations
  var pos = [],
  divs = [],
  speed = 1500,
  counter = 35, //number of roll during animation
  intervalAnimation = null,
  prevTopPos = 0;


  var animation ={

    _run: function(number, btnClicked){
      clearTimeout(intervalAnimation);
      $(".prize").stop();
      clickToPlayOnce = true;
      speed = 30;
      this._init();
      this._soundPlay();
      this._animateClawDown();

      $(btnClicked).addClass('stop');
      $(btnClicked + '.condition-text .btn-text').html('任务达成');
      $('.prizes-list').addClass('blur')
    },
    _getDimensions: function(){
      for(var x = 0; x<numberOfPrize; x++){
        pos.push(x);
        divs.push({
          pos:$(".prize"+x).position(),
          dimension:$(".prize"+x).width()
        })
      }

    },
    _init: function(){

      var $this = this;
      intervalAnimation = setTimeout(function(){

        for(var temp = 0;temp < numberOfPrize;temp++){
          if(pos[temp]===numberOfPrize){pos[temp]=0;}
        }

        for(var x = 0;x<numberOfPrize;x++){
          console.log(divs[pos[x]].pos.left +"position"+ pos[x]);
          $(".prize"+x).animate({
            left:(divs[pos[x]].pos.left),
            top:(divs[pos[x]].pos.top),
            width: (divs[pos[x]].dimension)
          }, {
            duration:speed,
            easing: "linear",
            complete: function(){


            }
          })
      }
      console.log(counter);
      if(!clickToPlayOnce){
        $this._init();
      }
      else{
        if(counter > 0){
          $this._init()
        }
        else if(counter <= 0){
            clearTimeout(intervalAnimation)

          $(".prize"+randomNumber).addClass('selected_prize');
           var b = $('.selected_prize').position();
            prevTopPos = b;
          if((pos[randomNumber] ) === lucky_index ){
            $this._animateClawUp()
          }
          else{
            $this._init()
          }
        }
        counter--;
      }

      for(var temp = 0;temp < numberOfPrize;temp++){
        if (pos[temp] != null){
            pos[temp] = pos[temp] + 1;

        }

      }
    },speed)


    },
    _animateClawDown:function(){
      $('.chain-container').removeClass('swing');
      $(".chain-animate").animate({
        top:"-2%"
      }, {
        duration:1000,
        easing: "linear",
        complete: function(){


        }
      })
      $('.chain-left').addClass('chainL-animate')
      $('.chain-right').addClass('chainR-animate')

    },
    _animateClawUp:function(){
      var $this = this;

        $('.chain-left').removeClass('chainL-animate');
        $('.chain-right').removeClass('chainR-animate')
          setTimeout(function(){
            $this._finish();
            $('.prizes-list').removeClass('blur')
          },300)
    },
    _finish:function(){
      var $this = this;
      $('.chain-animate').animate({
        top:"-33%"
      },{
        duration:500,
        easing: "linear",
      })

      $('.selected_prize').animate({
        top:"-6%"
      },{
        duration:500,
        easing: "linear",
      }).css('z-index',1000).delay(400).queue(function(){
        $this._popup()
      })
    },
    _buttons:function(){
      var $this = this;
      //get promo_classification
      promo_classification = 3;
     
      // edited 03/18/2019
      $('.click-Promo1, .click-Promo2, .click-Promo3').on('click',function(){
        if(isLogin && clickToPlayOnce){
          randomNumber = $this._randomize(0,numberOfPrize-1);
          console.log(randomNumber)
          $this._run(randomNumber, "#"+$(this).attr('id'));
                
        }
        else{
          if(!isLogin){
            $('.popup-login').fadeIn();
          }
          else{
            console.log('1x play only')
          }
        }
      })

      $('.conditionItem-1').addClass('active-button');
      $('.conditionItem-2').addClass('active-button');
      $('.conditionItem-3').addClass('active-button');
      // end if edit
      $('.active-button .btn-indicator-grey').addClass('show')
      setInterval(function(){
        $('.active-button .btn-indicator-grey').toggleClass('show');
        $('.active-button .btn-indicator-green').toggleClass('show');
      },300)

    },
    _popup:function(){
      $('.popup-prize').fadeIn()
      var i = $('.selected_prize').attr('icon-label');
      var prize = $('.selected_prize').attr('prize-value')
      $('.pop-icon').prepend('<img src="images/popup/pop-'+i+'.png" />')
      $('.prize-valuePop').prepend('<img src="images/'+prize+'.png" />');
      $('.pop-clawLeft').addClass('pop-animateL');
      $('.pop-clawRight').addClass('pop-animateR');
      $('.pop-icon').animate({top: "+=2%"},800).animate({top:"+=2%"},400).animate({top:"-=4%"},400)
      setTimeout(function(){
        $('.cloudL').animate({
          left: "0%",opacity: "1",width: "45%",top:"72%"},
        500);
        $('.cloudR').animate({
          right: "0%",opacity: "1",width: "45%",top:"72%"},
        500);
        $('.pop-icon').addClass('animate-rotate')
      },1000)
      setTimeout(function(){
        $('.prize-valuePop').fadeIn();
        $('.starburst').show();
        $('.starAnimate').show();
        $('.cloudL,.cloudR').hide()

      },1600)
    },
    _soundBg: function(){
      $('.audio-toggle').on('click',function(){
        var audio2 = document.getElementById("auto-bg");
        $(this).toggleClass('active');

        if($(this).hasClass('active')){
          audio2.play()
        }
        else{
          audio2.pause()
        }
      })
    },
    _soundPlay:function(){
      var audio = document.getElementById("claw-animating");
      audio.play();
    },
    _randomize: function(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
    },
    _preload:function(){
      var imageContainer = [];
       var imagesToLoad = ["images/popup/pop-1.png","images/popup/pop-2.png","images/popup/pop-3.png"]

      for (var i = 0; i < imagesToLoad.length; i++) {
          imageContainer[i] = new Image();
          imageContainer[i].src = imagesToLoad[i];
      }
    }

  }

  var important = document.getElementById('main-box')
  if(important.complete){
      loaded()
  }else{
    important.addEventListener('load', loaded)
  }

  function loaded(){
    animation._getDimensions();
    animation._init();
    setTimeout(function(){
      animation._preload();
    },1000)
  }



  animation._buttons();
  animation._soundBg();

$('.loginbtn').on('click',function(){
  isLogin = true;
  $('.popup-login').hide();
})

$('.close-login').on('click',function(){
  $('.popup-login').hide();
})

$('.click-rule').on('click',function(){
  $('.popup-rule').fadeIn()
})

$('.click-condition').on('click',function(){
  $('.popup-condition').fadeIn();
})

$('.closePop').on('click',function(){
  $('.popup-prize').hide();

  // reinitialize game for remaining buttons 

      // $('.selected_prize').css({
      //   'top':"185.125px"
      // });

      // animation._init();
      // alert(prevTopPos.top);
       $(".selected_prize").animate({top:prevTopPos.top},
        function(){
          alert();
        });
      $(".prize ").removeClass('selected_prize');
   speed = 1500;
   counter = 50; 
    intervalAnimation = null;

     animation._init();

})

$('.close-rule').on('click',function(){
  $('.popup-rule').hide()
  $('.popup-condition').hide()
})

var h1 = $('.label-text').map(function(){
  return $(this).height();
})

var maxHeight = Math.max.apply(null,h1);

$('.label-text').css('height',maxHeight+'px')


$('.roulette').slotMachine({
  active: 1,
  delay: 100,
  auto: 3000,
  randomize() {
    return this.nextIndex;
  }
});

})
