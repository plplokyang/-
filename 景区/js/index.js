// JavaScript Document
function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}

function fnLoad()
{
  var iTime=new Date().getTime();
  var oW=id("welcome");
  var oIndex=id("index");
  var arr=[""];
  var bImgLoad=true;
  var bTime=false;
  var oTimer=0;
  bind(oW,"webkitTransitionEnd",end);
  bind(oW,"transitionend",end);
  oTimer=setInterval(function(){
    if(new Date().getTime()-iTime>=5000)
    {
      bTime=true;
    }
    if(bImgLoad&&bTime)
    {
      clearInterval(oTimer);
      oW.style.opacity=0;
    }
  },1000);
  function end()
  {
    removeClass(oW,"pageShow");
    addClass(oIndex,"pageShow");
    render();
    fnTab();
  }
  /*for(var i=0;i<arr.length;i++)
  {
    var oImg=new Image();
    oImg.src=arr[i];
    oImg.onload=function()
    {

    }

  }*/
}

/*canvas渲染图片*/
function render(){
      var total = 5;
      var tmpl = '';
      var oUl = document.getElementById('picList');
      var winWidth = window.screen.width;

      for(var i=1;i<=total;i++){
        var imgsrc = 'img/'+i+'.jpg';
        tmpl += '<li><canvas id="cvs_'+i+'"></canvas></li>';
        // console.log(tmpl);
        var imageObj = new Image();
        imageObj.index = i;
        imageObj.onload = function(){
          var canvas = document.getElementsByTagName('canvas')[this.index-1];
          var ctx = canvas.getContext('2d');
          canvas.width = '640';
          canvas.height = '342';

          ctx.drawImage(this,0,0,canvas.width,canvas.height);
        }
        imageObj.src = imgsrc;
      }
      oUl.innerHTML = tmpl;
}

function fnTab()
{
  var oTab=id("tabPic");
  var oList=id("picList");
  var aNav=oTab.getElementsByTagName("nav")[0].children;
  var iNow=0;
  var iX=0;
  var iW=view().w;
  var oTimer=0;
  var iStartTouchX=0;
  var iStartX=0;
  bind(oTab,"touchstart",fnStart);
  bind(oTab,"touchmove",fnMove);
  bind(oTab,"touchend",fnEnd);
  auto();
  if(!window.BfnScore)
  {
    fnScore();
    window.BfnScore=true;
  }
  function auto()
  {
    oTimer=setInterval(function(){
      iNow++;
      iNow=iNow%aNav.length;
      tab();
    },2000);
  }
  function fnStart(ev)
  {
    ev.preventDefault();
    oList.style.WebkitTransition=oList.style.transition="none";
    ev=ev.changedTouches[0];
    iStartTouchX=ev.pageX;
    iStartX=iX;
    clearInterval(oTimer);
  }
  function fnMove(ev)
  {
    ev=ev.changedTouches[0];
    var iDis=ev.pageX-iStartTouchX;
    iX=iStartX+iDis;    //iX做累加用,记住上次位置信息,
    oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
  }
  function fnEnd()
  {
    iNow=iX/iW;
    iNow=-Math.round(iNow);
    if(iNow<0)
    {
      iNow=0;
    }
    if(iNow>aNav.length-1)
    {
      iNow=aNav.length-1;
    }
    tab();
    auto();
  }
  function tab()
  {
    iX=-iNow*iW;
    oList.style.WebkitTransition=oList.style.transition="0.5s";
    oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";;
    for(var i=0;i<aNav.length;i++)
    {
      removeClass(aNav[i],"active");
    }
    addClass(aNav[iNow],"active");
  }
}
function fnScore()
{
  var oScore=id("score");
  var aLi=oScore.getElementsByTagName("li");
  var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];
  for(var i=0;i<aLi.length;i++)
  {
    fn(aLi[i]);
  }
  function fn(oLi)
  {
    var aNav=oLi.getElementsByTagName("a");
    var oInput=oLi.getElementsByTagName("input")[0];
    for(var i=0;i<aNav.length;i++)
    {
      aNav[i].index=i;
      bind(aNav[i],"touchstart",function(){
        for(var i=0;i<aNav.length;i++)
        {
          if(i<=this.index)
          {
            addClass(aNav[i],"active");
          }
          else
          {
            removeClass(aNav[i],"active");
          }
        }
        oInput.value=arr[this.index];
      });
    }
  }

  fnIndex();
}
function fnInfo(oInfo,sInfo)
{
  oInfo.innerHTML=sInfo;
  oInfo.style.WebkitTransform="scale(1)";
  oInfo.style.transform="scale(1)";
  oInfo.style.opacity=1;
  setTimeout(function(){
    oInfo.style.WebkitTransform="scale(0)";
    oInfo.style.transform="scale(0)";
    oInfo.style.opacity=0;
  },1000);
}
function fnIndex()
{
  var oIndex=id("index");
  var oBtn=oIndex.getElementsByClassName("btn")[0];
  var oInfo=oIndex.getElementsByClassName("info")[0];
  var bScore=false;
  bind(oBtn,"touchend",fnEnd);
  function fnEnd()
  {
    bScore=fnScoreChecked();
    if(bScore)
    {
      if(bTag())
      {
        fnIndexOut();
      }
      else
      {
        fnInfo(oInfo,"给景区添加标签");
      }
    }
    else
    {
      fnInfo(oInfo,"给景区评分");
    }
  }
  function fnScoreChecked()
  {
    var oScore=id("score");
    var aInput=oScore.getElementsByTagName("input");
    for(var i=0;i<aInput.length;i++)
    {
      if(aInput[i].value==0)
      {
        return false;
      }
    }
    return true;
  }
  function bTag()
  {
    var oTag=id("indexTag");
    var aInput=oTag.getElementsByTagName("input");
    for(var i=0;i<aInput.length;i++)
    {
      if(aInput[i].checked)
      {
        return true;
      }
    }
    return false;
  }
}
// 提交成功后执行
function fnIndexOut()
{
  var oIndex=id("index");
  var oMask=id("mask");
  var oIndex=id("index");
  var oNew=id("news");
  addClass(oMask,"pageShow");
  addClass(oNew,"pageShow");
    fnNews();
  setTimeout(function(){
    oMask.style.opacity=1;
    oIndex.style.WebkitFilter=oIndex.style.filter="blur(5px)";
    oIndex.style.background="#fff";
  },14);
  setTimeout(function(){
    oNew.style.WebkitTransition=oNew.style.transition="0.5s";
    oMask.style.opacity=0;
    oIndex.style.WebkitFilter=oIndex.style.filter="blur(0px)";
    oNew.style.opacity=1;
    removeClass(oIndex,"pageShow");
    removeClass(oMask,"pageShow");
  },3000);
}

function fnNews()
{
  var oNews=id("news");
  var oInfo=oNews.getElementsByClassName("info")[0];
  var aInput=oNews.getElementsByTagName("input");
  var oFm=oNews.getElementsByClassName("file")[0];
  var oResult=oNews.getElementsByClassName("result")[0];
  // console.log(oFm);
  aInput[0].onchange=function()
  {
    if(this.files[0].type.split("/")[0]=="video")
    {
      addClass(oResult,"upfile");
    }
    else
    {
      fnInfo(oInfo,"请上传视频");
    }
  };
  aInput[1].onchange=function()
  {
    if(this.files[0].type.split("/")[0]=="image")
    {
      addClass(oResult,"upfile");
    }
    else
    {
      fnInfo(oInfo,"请上传图片");
    }
  };
  bind(oResult,"touchend",passArg);
  function passArg(){
      upFile(oFm,aInput);
  }
}
function upFile(oFm,aInput){
      var xhr = new XMLHttpRequest();
      var fmData = new FormData(oFm);
      var oNews=id("news");
      var oResult=oNews.getElementsByClassName("result")[0];
      var str = null;
      xhr.open("post","upload.php");
      // 事件一定要在send()之前,否则监控不到
      xhr.upload.onprogress = function(ev){
        // console.log(ev);
        var scale = Math.round((ev.loaded/ev.total)*100);
        oResult.innerHTML = "正在上传:" + scale + "%";
      }
      xhr.send(fmData);

      xhr.onload = function(){
        console.log(xhr.responseText);
        aInput[0].value = '';
        aInput[1].value = '';
        str = xhr.responseText.split("|")[1];
        console.log(str);
        oResult.innerHTML = str;
        if(str =="全部上传成功" || str =="图片上传成功" || str == "视频上传成功"){
          setTimeout(function(){fnNewsOut();removeClass(oResult,"upfile");oResult.innerHTML = "上传"},1000);
        }
      };
}
function fnNewsOut()
{
  var oNews=id("news");
  var oForm=id("form");
  addClass(oForm,"pageShow");
  oNews.style.cssText="";
  removeClass(oNews,"pageShow");
    formIn();
}
function formIn()
{
  var oForm=id("form");
  var oOver=id("over");
  var aFormTag=id("formTag").getElementsByTagName("label");
  var oBtn=oForm.getElementsByClassName("btn")[0];
  var bOff=false;
  for(var i=0;i<aFormTag.length;i++)
  {
    bind(aFormTag[i],"touchend",function(){
      bOff=true;
      addClass(oBtn,"submit");
    });
  }
  bind(oBtn,"touchend",function(){
    if(bOff)
    {
      for(var i=0;i<aFormTag.length;i++)
      {
        aFormTag[i].getElementsByTagName("input")[0].checked=false;
      }
      bOff=false;
      addClass(oOver,"pageShow");
      removeClass(oForm,"pageShow");
      removeClass(oBtn,"submit");
      over();
    }
  });
}
function over()
{
  var oIndex=id("index");
  var oOver=id("over");
  var oBtn=oOver.getElementsByClassName("btn")[0];
  bind(oBtn,"touchend",function()
  {
    removeClass(oOver,"pageShow");
    addClass(oIndex,"pageShow");
  });
}