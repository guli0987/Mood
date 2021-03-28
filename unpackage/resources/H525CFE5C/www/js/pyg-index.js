;(function($,window,document,undefined){
	
    $.fn.checkTest=function(options){//首页个人中心测试
		var $sw_sex=$(".p-sw_sex");//切换性别
		var $log_reg=$(".p-log_reg");//登录注册
		var $my_face=$(".p-my_face");//个人中心
		var $omy_face=$(".p-omy_face");//个人中心二 他人视角
		
		var nan=true;
		/* 网络请求request */
		var REQUEST_POST="POST";
		var REQUEST_GET="GET";
		var xmlHttpReq=null;
		var APP_VERSION="APP_VERSION";
		var GET_USER_DATA="GET_USER_DATA";
		var IS_ONLINE="IS_ONLINE";
		var USER_ID="USER_ID";
		var $loginORexit=$("#p-user-login-or-exit");
		
		$sw_sex.click(function(){
			//alert("TEST1"+$(".p-mynickname").text());
			if(nan){
				$(".p-mynickname").text("左手倒影");
				$(".p-mysex").html('<img src="img/fh_nv.png">');
				$(".p-mydeclaration").text("啦啦啦我是一只快乐的小青蛙");
				nan = false;
			}else{
				$(".p-mynickname").text("右手年华");
				$(".p-mysex").html('<img src="img/fh_nan.png">');
				$(".p-mydeclaration").text("我是一个志向远大的人");
				nan = true;
			}

		});
		$log_reg.click(function(){
			//alert("TEST2");
			//window.href="signin.html"
			window.location.href="regORlog.html";
		});
		$my_face.click(function(){
			/* alert("TEST3"); */
			window.location.href="others.html";
		});
		$omy_face.click(function(){
			//alert("没有更多了");
		});
		
		/*测试登录 */
		$(".categoriestab1 .swiper-wrapper").children().click(function(){
			//alert($(this).children("p").html());
			mui.toast('你选择了'+$(this).children("p").text()+"版块",{ duration:'short', type:'div' });
		});
		/* $("#M-Whisper").click(function(){
			//mui.alert("检测到您未登录，无法进入分区，是否立即登录？")
			var btnArray = ['先看看', '立即登录'];
			mui.confirm('检测到您未登录，无法进入分区，是否立即登录？', 'Mood-为心打造', btnArray, function(e) {
				if (e.index == 1) {
					//info.innerText = '确认';
					window.location.href="regORlog.html";
					
				} else {
					//info.innerText = '操作取消'
				}
				},'div');
		});
		$("#M-Whisper").siblings().click(function(){
			//mui.alert("检测到您未登录，无法进入分区，是否立即登录？")
			var btnArray = ['先看看', '立即登录'];
			mui.confirm('检测到您未登录，无法进入分区，是否立即登录？', 'Mood-为心打造', btnArray, function(e) {
				if (e.index == 1) {
					//info.innerText = '确认';
					window.location.href="regORlog.html";
					
				} else {
				}
				},'div');
		}); */
		$(".categories2tab1 .swiper-wrapper .swiper-slide button").click(function(){
			//alert("click:"+$(this).text());
			mui.toast('你选择了'+$(this).text()+"心情栏",{ duration:'short', type:'div' });
		});
		/* 心情板块进入他人页面 */
		$(".p-otherdata .row > div").each(function(){
			//alert($(this).html())
			//alert($(this).children().children().html());
			//window.location.href="others.html";
			$(this).children().children().children("div").click(function(){
				//alert($(this).html());
				if(getOnlineState()){
					window.location.href="others.html";
				}else{
					var btnArray = ['先看看', '立即登录'];
					mui.confirm('检测到您未登录，无法进入分区，是否立即登录？', 'Mood-为心打造', btnArray, function(e) {
						if (e.index == 1) {
							window.location.href="regORlog.html";
						} else {
							mui.toast('您没有登录，暂时不能进入他人主页',{ duration:'short', type:'div' });
						}
						},'div');
				}
			});
		});
		function getOnlineState(){
			var onlineState=localStorage.getItem(IS_ONLINE);
			if("true" == onlineState){
				return true;
			}else if("false" == onlineState){
				return false;
			}
		}
		if(getOnlineState()){
			/**
			 * 获取登录id
			 */
			var userId=localStorage.getItem(USER_ID);
			if(userId!=null){
				getUserData(userId);
			}else{
				mui.alert("登录环境有误，请重新登录", '提示',"确定", function() {
					window.location.href="refORlog.html";
				},'div');
			}
			$loginORexit.attr("class","text-link");
			$loginORexit.text("登出");
			$loginORexit.parent().removeClass("text-default");
			$loginORexit.parent().addClass("text-danger");
			/* var hrefString=window.location.href;
			var arrhref=hrefString.split("?userid=");//typeof(value)=="undefined"
			//alert(arrhref[0]);
			if(typeof(arrhref[1]) == "undefined"){
				//alert("true");
			}else{
				//alert("not92");
				var userId=arrhref[1];
				getUserData(userId);
			} */
		}else{
			$loginORexit.attr("class","text-dark");
			$loginORexit.text("登录");
			$loginORexit.parent().removeClass("text-danger");
			$loginORexit.parent().addClass("text-default");
			mui.toast('欢迎来到Mood社区，您还没有登录哦',{ duration:'short', type:'div' });
		}
		//点击登录登出操作
		$loginORexit.parent().click(function(){
			if(getOnlineState()){
				clearLocalStorageOnline();
			}
		});
		function getUserData(userId){
				//alert("96"+userId);
				var userIDData="userId="+userId;
				var parameter=userIDData;
				var requestURL="http://wzixuan.com:8080/mind/user/findInfo";
				AjaxRequest(GET_USER_DATA,parameter,REQUEST_GET,requestURL);
		}
		function createXMLHttpRequest(){
			if(window.ActiveXObject){
				try{
					xmlHttpReq=new ActiveXObject("Msxml2.XMLHTTP");
				}catch(e){
					try{
						xmlHttpReq=new ActiveXObject("Microsoft.XMLHTTP");
						}catch(e){}
				}
			}else if(window.XMLHttpRequest){//除开IE5 IE6之外浏览器,火狐、谷歌、safari、opera、IE7以上
				xmlHttpReq=new XMLHttpRequest();
			}
			if(!xmlHttpReq){
				alert("当前浏览器并不支持该项操作，请更换浏览器再次尝试");
				return null;
			}
			return xmlHttpReq;
		}
		
		function AjaxRequest(callMethod,requestParameter,requestMethod,requestURL){
			//alert("RequestReTest");
			var textValue=requestParameter.trim();
			//alert("123:"+textValue);
			if(textValue!=""){
				//var requestURL="http://wzixuan.com:8080/mind/user/register";
				xmlHttpReq=createXMLHttpRequest();
				if("GET" == requestMethod.trim().toUpperCase()){
					xmlHttpReq.open("GET",requestURL+"?"+requestParameter,true);
					xmlHttpReq.setRequestHeader("If-Modified-Since","0");
					xmlHttpReq.send(null);
				}else if("POST" == requestMethod.trim().toUpperCase()){
					xmlHttpReq.open("POST",requestURL,true);//true 异步,创建请求
					xmlHttpReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
					xmlHttpReq.send(requestParameter);//发送请求
				}else{
					alert("请求方式有误！");
					return;
				}
				xmlHttpReq.onreadystatechange=function(){
					if(xmlHttpReq.readyState == 4){//请求完成加载readyState==4
						switch(xmlHttpReq.status){
							case 200:
								//响应成功
								requestCodeMethod(callMethod,xmlHttpReq.responseText);
								break;
							case 400:
								alert("请求错误");
								break;
							case 403:
								alert("拒绝请求");
								break;
							case 404:
								alert("请求地址不存在");
								break;	
							case 500:
								alert("内部出错");
								break;
							case 503:
								alert("服务不可用");
								break;
							default:
								alert("请求返回异常:"+xmlHttpReq.status);
								break;
						}
					}
				}
				
			}
			
		}
		function requestCodeMethod(callMethod,responseText){
			switch(callMethod){
				case GET_USER_DATA:
					requestUserData(responseText);
					break;
				/* case APP_VERSION:
					requestVersionData(responseText);
					break; */
				default:
					break;
			}
		}
		function requestUserData(responseText){
			var obj=parseReturnObj(responseText);
			//alert("189:"+obj.userSex+obj.userNickName+obj.userImg+obj.userIntro+obj.userFollow+obj.userFollower);
			if(obj.userId != ""){
			}
			if(obj.userPhone != ""){
			}
			if(obj.userPwd != ""){
			}
			if(obj.userSex != ""){
				if("男" == obj.userSex){
					$("#p-udata-sex").attr("src", "img/fh_nan.png");
				}else if("女" == obj.userSex){
					$("#p-udata-sex").attr("src", "img/fh_nv.png");
				}else if("私密" == obj.userSex){
					$("#p-udata-sex").attr("src", "img/fh_simi.png");
				}else{
					$("#p-udata-sex").attr("src", "img/fh_simi.png");
				}
				
			}
			if(obj.userAge != ""){
			}
			if(obj.userBri != ""){
			}
			if(obj.userCon != ""){
			}
			if(obj.userNickName != ""){
				$("#p-udata-nickname").text(obj.userNickName);
				$("#p-udata-nickname-profile").text(obj.userNickName);
			}
			if(obj.userArea != ""){
			}
			if(obj.userFlag != ""){
			}
			if(obj.userImg != ""){
				var randomImg=Math.random();
				$("#p-udata-avatar").attr("src", "img/"+obj.userImg);
				$("#p-udata-avatar").parent().attr("style", 'background-image: url("img/'+obj.userImg+'")');
				$("#p-udata-avatar-profile").attr("src", "img/"+obj.userImg);//+"?random="+Math.random()
				$("#p-udata-avatar-profile").parent().attr("style", 'background-image: url("img/'+obj.userImg+'")');
			}
			if(obj.userIntro != ""){
				$("#p-udata-intro").text(obj.userIntro);
				$("#p-udata-intro-profile").text(obj.userIntro);
			}
			if(obj.userFollow >=0){
				$("#p-udata-notice-profile").text(obj.userFollow);
			}
			if(obj.userFollower >=0){
				$("#p-udata-fans-profile").text(obj.userFollower);
			}
			if(obj.userCoin != ""){
			}
			if(obj.userVip != ""){
			}
			
		}
		//版本问题
		$("#p-app-version").click(function(){
			//var parameter="lang=zh-CN";//没有  "?"+
			//var requestURL="http://ziseyunjian.com/Mood/apk/version.json";
			//AjaxRequest(APP_VERSION,parameter,REQUEST_GET,requestURL);
			//alert("解析版本信息："+"http://ziseyunjian.com/Mood/apk/version.json");
			mui.alert("应用名称:Mood\n版本号:1.2.0\n更新日期:2020-07-19\n版本信息:增加了新手引导功能;修复了记住密码失效的问题;部分页面更新;细节调整;bug修复", '版本信息',"确定", function() {
			},'div');
		});
		/* function requestVersionData(responseText){
			alert(responseText);
		} */
		function parseReturnJson(responseText){
			var obj=JSON.parse(responseText);
			return obj.code;
		}
		function parseReturnObj(responseText){
			var obj=JSON.parse(responseText);
			return obj;
		}
		function addLocalStorageOnline(){
			localStorage.setItem(IS_ONLINE,true);
		}
		function clearLocalStorageOnline(){
			localStorage.setItem(IS_ONLINE,false);
			learLocalStorageUID();
		}
		function addLocalStorageUID(userID){
			localStorage.setItem(USER_ID,userID);
		}
		function clearLocalStorageUID(){
			localStorage.removeItem(USER_ID);
		}
	}
})(jQuery,window,document);