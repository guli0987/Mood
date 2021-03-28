;(function($,window,document,undefined){
	
    $.fn.checkForm=function(options){//表单校验方法
		var root =this;
		var isSubmit = false;//提交时判断条件是否满足
		var isTab1=false;
		var isTab2=false;
		var isTab3=false;
		var flag=false;	//滑块
		var random_Captcha_reg;//注册验证码
		var s_reg=60;
		var random_Captcha_log;//登录验证码
		var s_log=60;
		var add0=false;//出生月日加不加0
		//if(!isSubmit){$("#loginUP,#loginMC,#register_btn").attr("disabled",true);}
		var password;//验证再次输入密码
		
		//模拟登录注册，注册成功被替换
		var mn_regPhone="18888888888";
		var mn_regPhone="123456y";
		var userPhone="";//缺陷：如果用户在填写验证码后又删改手机号信息，会不会获取出错呢，于是乎
		var REQUEST_POST="POST";
		var REQUEST_GET="GET";
		/* 网络请求request */
		var xmlHttpReq=null;
		var CALL_METHOD_REG="CALL_METHOD_REG";
		var CALL_METHOD_LOG="CALL_METHOD_LOG";
		var GET_VERIFICATION_CODE_LOG="GET_VERIFICATION_CODE_LOG";//获取登录验证码
		var GET_VERIFICATION_CODE_REG="GET_VERIFICATION_CODE_REG";//获取注册验证码
		var GET_USER_ID="GET_USER_ID";//根据手机号获取用户uid
		var IS_REMEMBER_ACCOUNT="IS_REMEMBER_ACCOUNT";
		var LOCAL_STORAGE_USERNAME="LOCAL_STORAGE_USERNAME";
		var LOCAL_STORAGE_PASSWORD="LOCAL_STORAGE_PASSWORD";
		var IS_ONLINE="IS_ONLINE";//是否保持在线登录状态
		var USER_ID="USER_ID";
		var IS_PROMPT="IS_PROMPT";
		// 去除字符串两边空格
		/* String.prototype.trim = function () {
			return this.replace(/(^\s*)|(\s*$)/g, "");
		} */
		var defaults={
			img_error:'img/error.gif',//×符号
			img_success:'img/right.gif',//√符号
			img_error2:'img/error.png',//×符号
			img_success2:'img/right.png',//√符号
			
			tips_success:"",//成功只打√没有文字
			tips_required:"不能为空",//输入栏不能为空
			tips_num:"数字",//数字，没用上
			tips_moible:"手机号码格式有误",//用手机号登录或者注册时
			tips_yzm:"",//用手机号登录或者注册时
			tips_yzm2:"验证码格式错误",//用手机号登录或者注册时
			tips_pwd:"密码格式不正确",//用手机号登录或者注册时
			tips_rpwd:"密码不一致",//注册时
			tips_user:"用户名格式有误",//普通用户名密码登录时
			
			check_user:/^\w{3,20}$/,//审核用户名
			//check_yzm:/^\d{6}$/,//审核验证码
			check_yzm:/^\w{6}$/,//审核验证码
			check_mobile:/^1[3458]{1}\d{9}$/,//审核手机号
			check_pwd:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,//审核密码
			check_born_year:/^\d{4}$/,//审核出生年>1900 <2020
			check_born_month:/^\d{1,2}$/,//审核出生月>0 <12
			check_born_day:/^\d{1,2}$///审核出生日>0 <31
			//零宽断言(?!X)某某后面不会是X  (?=X)某某后面必须是X, (?<=)某某前面必须是X，?《!X)某某前面不会是X

		};
		if(options){//不为空合并参数,用不到
			$.extend(defaults,options);
			//https://www.runoob.com/jquery/misc-extend.html
		}
		//登录注册按钮预先不可选中
		
		$(":text,:password",root).each(function(index,element){//用户名，手机号，验证码、密码
			$(this).blur(function(){//失去焦点
				var checkData=$(this).attr("id");//得到id属性值
				/* alert("blur:"+checkData); */
				add0=true;
				if(checkData){
					if(!check($(this),checkData,$(this).val())){
						return false;
					}else{//测试
						if($("#form1").hasClass("sign-active")){//如果登录一
							/* alert("form1"); */
							if(onSubmit() && flag){
								$("#loginUP").attr("disabled",false);
							}
						}
						if($("#form2").hasClass("sign-active")){//如果注册
							//alert("form2");
							add0=false;
							if(onSubmit2()){
								$("#register_btn").attr("disabled",false);
								//alert($("#re_code").val());
							}
						}
						if($("#form3").hasClass("sign-active")){//如果登录二
							//alert("form3");
							if(onSubmit3()){
								$("#loginMC").attr("disabled",false);
							}
						}
					}
				}
			});
			
		});
		/* $("form:eq(0) :text").click(function(){eq(0)后有空格
			alert("test");
			
		}); */
		
		//if($("#tab-1").is(":checked")){//如果登录一	
			
		//}
		
		/* $("form :input").blur(function(){易懂
			if($(this).is("#re_mobile")){
				if(this.value.length != )
			}
		}); */
		jigsaw.init(document.getElementById('captcha'), function () {
				flag=true;
				//$(".sliderMask").html("验证成功!");error
				$(".sliderMask").prepend("<div id='show_success'><a>验证成功!</a></div>");
				if(onSubmit()){
					$("#loginUP").attr("disabled",false);
				}
		});
		 function onSubmit(){
			//表单提交验证
			isTab1=true;
			$("form:eq(0) :text,form:eq(0) :password").each(function(){
				var checkData1=$(this).attr("id");//得到id属性值
				if(checkData1){
					if(!checkBtn($(this),checkData1,$(this).val())){
						isTab1=false;
						return false;
					}
				}
			});
			  if(isTab1){
				//$("#loginUP").attr("disabled",false);
				return true;
			}
		}
		function onSubmit2(){
			//表单提交验证
			isTab2=true;
			$("form:eq(2) :text,form:eq(2) :password").each(function(){
				var checkData2=$(this).attr("id");//得到id属性值
				if(checkData2){
					if(!checkBtn($(this),checkData2,$(this).val())){
						//alert("error:"+checkData2);
						isTab2=false;
						return false;
					}
				}
			});
			  if(isTab2){//
				//$("#loginUP").attr("disabled",false);
				return true;
			}
		}
		function onSubmit3(){
			//表单提交验证
			isTab3=true;
			$("form:eq(1) :text").each(function(){
				var checkData3=$(this).attr("id");//得到id属性值
				if(checkData3){
					if(!checkBtn($(this),checkData3,$(this).val())){
						//alert("false:"+checkData3);
						isTab3=false;
						return false;
					}/* else{
						alert("true:"+checkData3);
					} */
				}
			});
			  if(isTab3){
				//$("#loginUP").attr("disabled",false);
				return true;
			}
		}
		/* if(root.is("#form1")){
			if(onSubmit()){
				$("#loginUP").attr("disabled",false);
			}
		} */
		
		var check=function(_this,id,val){
			switch(id){
				case "re_mobile"://注册手机号
					return regExp(val,defaults.check_mobile)?showMsg(_this,defaults.tips_success,true):showMsg(_this,defaults.tips_moible,false);
				case "re_code"://手机号验证码
					return regExp(val,defaults.check_yzm)?showMsg(_this,defaults.tips_success,true):showMsg(_this,defaults.tips_yzm,false);
				case "re_password"://密码
					password = val;
					return regExp(val,defaults.check_pwd)?showMsg(_this,defaults.tips_success,true):showMsg(_this,defaults.tips_pwd,false);
				case "re_rpassword"://确认密码
					return checkPwd(password,val)?showMsg(_this,defaults.tips_success,true):showMsg(_this,defaults.tips_rpwd,false);
				case "login_uName"://用户名
					return regExp(val,defaults.check_user)?showMsg(_this,defaults.tips_success,true):showMsg(_this,defaults.tips_user,false);
				case "login_pwd"://密码
					return regExp(val,defaults.check_pwd)?showMsg(_this,defaults.tips_success,true):showMsg(_this,defaults.tips_pwd,false);
				case "login_mobile"://登录手机号
					return regExp(val,defaults.check_mobile)?showMsg(_this,defaults.tips_success,true):showMsg(_this,defaults.tips_moible,false);
				case "login_code"://登录手机号验证码
					return regExp(val,defaults.check_yzm)?showMsg(_this,defaults.tips_success,true):showMsg(_this,defaults.tips_yzm,false);
				case "re_email"://邮箱
					return 1>0;
				case "re_born_year"://出生日期年
					return regExpBorn(val,defaults.check_born_year,1)?showBorn(_this,true):showBorn(_this,false);
				case "re_born_month"://出生日期月
					return regExpBorn(val,defaults.check_born_month,2)?showBorn(_this,true):showBorn(_this,false);
				case "re_born_day"://出生日期日
					return regExpBorn(val,defaults.check_born_day,3)?showBorn(_this,true):showBorn(_this,false);
				default:
					break;
			}
		}
		
		var checkBtn=function(_this,id,val){
			switch(id){
				case "re_mobile"://注册手机号
					return regExp(val,defaults.check_mobile);
				case "re_code"://手机号验证码
					return regExp(val,defaults.check_yzm);
				case "re_password"://密码
					password = val;
					return regExp(val,defaults.check_pwd);
				case "re_rpassword"://确认密码
					return checkPwd(password,val);
				case "login_uName"://用户名
					return regExp(val,defaults.check_user);
				case "login_pwd"://密码
					return regExp(val,defaults.check_pwd);
				case "login_mobile"://登录手机号
					return regExp(val,defaults.check_mobile);
				case "login_code"://登录手机号验证码
					return regExp(val,defaults.check_yzm);
				case "re_email"://邮箱
					return 1>0;
				case "re_born_year"://出生日期年
					return regExpBorn(val,defaults.check_born_year,1);
				case "re_born_month"://出生日期月
					return regExpBorn(val,defaults.check_born_month,2);
				case "re_born_day"://出生日期日
					return regExpBorn(val,defaults.check_born_day,3);
				default:
					break;
			}
		}
		
		var regExp=function(nowVal,reg){
			return reg.test(nowVal);
		}

		var regExpBorn=function(nowVal,reg,classify){
			if(classify == 1 && reg.test(nowVal)){
				if(nowVal>=1900 && nowVal <=2020){
					return true;
				}else{return false;}
			}
			if(classify == 2 && reg.test(nowVal)){
				nowVal=parseInt(nowVal);
				if(nowVal>=1 && nowVal <=12){
					if(nowVal<=9){
						if(add0){
							$("#re_born_month").val("0"+nowVal);
						}
						
						//alert($("#re_born_month").val("0"+nowVal));
					}
					return true;
				}else{return false;}
			}
			if(classify == 3 && reg.test(nowVal)){
				nowVal=parseInt(nowVal);
				if(nowVal>=1 && nowVal <=31){
					if(nowVal<=9){
						if(add0){
						$("#re_born_day").val("0"+nowVal);}
					}
					return true;
				}else{return false;}
			}
			return false;
		}
		var checkPwd=function(pwd,rpwd){
			return pwd == rpwd ? true : false;
		}
		/* 本地验证码 */
		var random_sixcode=function(){
			var a=Math.floor(Math.random()*900000+100000);//[0,900000)+100000=[100000,1000000)
			return a;
		}
		/* 服务器验证码 */
		var getVerificationCode_Reg=function(){
			var reMobile="userPhone="+$("#re_mobile").val();
			var parameter="flag=1"+"&"+reMobile;
			var requestURL="http://192.144.131.190:8080/mind/user/getCode";
			AjaxRequest(GET_VERIFICATION_CODE_REG,parameter,REQUEST_GET,requestURL);
		}
		var getVerificationCode_Log=function(){
			var reMobile="userPhone="+$("#login_mobile").val();
			var parameter="flag=0"+"&"+reMobile;
			var requestURL="http://192.144.131.190:8080/mind/user/getCode";
			AjaxRequest(GET_VERIFICATION_CODE_LOG,parameter,REQUEST_GET,requestURL);
		}
		
		var showBorn=function(_this,isTrue){

			if(isTrue){//如果为假边框变红
				_this.css("color","#fff");
				/* alert("ee"); */
			}else{
				/* alert("11"); */
				_this.css("color","#ff5500");
			}
			return isTrue;
		}
		
		var showMsg=function(_this,msg,isTrue){
			/* alert("原来是这里有问题：真假："+isTrue); */
			(_this).next().children().remove();
			if(isTrue){//如果为真则打勾，否则×
				$(_this).next().html($(_this).next().html()+" "+"<img src='"+defaults.img_success2+"' style=''/>");
			}else{
				$(_this).next().html($(_this).next().html()+" "+"<img src='"+defaults.img_error2+"' style=''/>"+"<font style='font-size:10px;color:gray;'>"+msg+"</font>");
			}
			//$(_this).after(show_html);
			//$(_this).prev().html($(_this).prev().html()+"×");
			return isTrue;
		}
		/* 登录方式1账号密码登录 */
		$("#loginUP").click(function(){//登录
			mui(this).button('loading');
			//请求登录
			setTimeout(function() {
				if(flag){
					LogRequest();
				}	
			}.bind(this), 1000);
		});
		/* 登录方式2手机验证码登录 */
		$("#loginMC").click(function(){//登录2
			mui(this).button('loading');
			setTimeout(function() {
			    mui(this).button('reset');
				if(s_log>=0 &&  userPhone == $("#login_mobile").val() &&  random_Captcha_log==$("#login_code").val()){
					//在线状态保存
					addLocalStorageOnline();
					intoIndex();
				} else{
					//alert("用户名或密码错误!");
					//mui($("#loginMC")).button('reset');
					mui.alert('手机号或验证码有误!', '登录失败','确认', function() {
						//info.innerText = '你刚关闭了警告框';
					},'div');
				}
			}.bind(this), 1000);
		});
		/* 模拟注册 */
		$("#register_btn").click(function(){//注册
			mui(this).button('loading');
			setTimeout(function() {
				//发出注册请求
				if(s_reg>=0 &&  userPhone == $("#re_mobile").val() && random_Captcha_reg == $("#re_code").val()){
					RegRequest();
				}else{
					mui($("#register_btn")).button('reset');
					mui.alert('验证码有误或超时', '注册失败','确认', function() {
						//
					},'div');
				}
				//注册请求完成
			}.bind(this), 1000);
		});

		$("#login_code_btn").click(function(){//验证码登录
			if(!regExp($("#login_mobile").val(),defaults.check_mobile)){
				mui.alert("手机号码格式不对，无法获取验证码!","提醒","确认",function() {
						//info.innerText = '你刚关闭了警告框';
					},'div');
				return;
			}
			//random_Captcha_log=random_sixcode();
			//random_Captcha_log=
			getVerificationCode_Log();
			//$(this).attr("disabled",true);
			//var s=60;

		});
		$("#reg_code_btn").click(function(){//验证码注册
			if(!regExp($("#re_mobile").val(),defaults.check_mobile)){
				mui.alert("手机号码格式不对，无法获取验证码!","提醒","确认", function() {
				
			},'div');
				return;
			}
			//random_Captcha_reg=random_sixcode();
			//random_Captcha_reg=
			getVerificationCode_Reg();
			//$(this).attr("disabled",true);
			//var s=60;
					});
		//登录注册页面切换
		$(".tab").click(function(){
			var id_page=$(this).attr("id");
			if(!$(this).hasClass("sign-active")){
					if(id_page=="switch_log"){
						$(this).next().removeClass("sign-active");
						$(this).addClass("sign-active");
						$(".sign-up-htm").removeClass("pre-scrollable");//不能直接在代码加pre-scrollable，QQ浏览器等不兼容
						$("#form2").removeClass("sign-active");
						$("#form1").addClass("sign-active");
						//$(".table_remind").html('忘记密码？<br><a href="#" class="text-white font-weight-bold table_switchLogin">点击</a>切换登录方式');
						$(".table-wb1").text("忘记密码？");
						$(".table-wb2").text("切换登录方式");
					}else if(id_page=="switch_reg"){
						$(this).prev().removeClass("sign-active");
						$(this).addClass("sign-active");
						$(".sign-up-htm").addClass("pre-scrollable");//不能直接在代码加pre-scrollable，QQ浏览器等不兼容
						if($("#form1").hasClass("sign-active")){
							$("#form1").removeClass("sign-active");
						}else if($("#form3").hasClass("sign-active")){
							$("#form3").removeClass("sign-active");
						}
						$("#form2").addClass("sign-active");
						//$(".login-html").css("padding-top","60px");//注册页面太长，适当缩短
						//$(".table_remind").html('已经注册？<br><a href="#" class="text-white font-weight-bold table_directLogin">点击</a>直接登录');
						$(".table-wb1").text("已经注册？");
						$(".table-wb2").text("直接登录");
					}
			}	
			
		});
		/* 登录注册提醒切换
		 form1登录方式1；form2登录方式2；form3注册方式
		 table_switchLoginReg为最下方
		 */
		$(".table_switchLoginReg").click(function(){
				if($("#form1").hasClass("sign-active")){
					//登录1转登录2
					$("#form1").removeClass("sign-active");
					$("#form3").addClass("sign-active");
				}else if($("#form3").hasClass("sign-active")){
					//登录2转登录1
					$("#form3").removeClass("sign-active");
					$("#form1").addClass("sign-active");
				}else if($("#form2").hasClass("sign-active")){
					//注册转登录1
					$("#switch_log").addClass("sign-active");
					$("#switch_log").next().removeClass("sign-active");
					$("#form2").removeClass("sign-active");
					$("#form1").addClass("sign-active");
					$(".sign-up-htm").removeClass("pre-scrollable");//不能直接在代码加pre-scrollable，QQ浏览器等不兼容
					//测试
					$(".table-wb1").text("忘记密码？");
					$(".table-wb2").text("切换登录方式");
				}
		});
		$(".table-wb1").click(function(){
			if($("#form1").hasClass("sign-active") || $("#form3").hasClass("sign-active")){
				window.location.href="forgotpassword.html";
			}
		});
		//登录方式切换 弃用
		/* $(".table_switchLogin").click(function(){
				if($("#form1").hasClass("sign-active")){
					$("#form1").removeClass("sign-active");
					$("#form3").addClass("sign-active");
				}else{
					$("#form3").removeClass("sign-active");
					$("#form1").addClass("sign-active");
				}
		});
		$(".table_directLogin").click(function(){//注册转登录
				$("#switch_log").addClass("sign-active"); 
				$("#switch_log").next().removeClass("sign-active");
				$("#form2").removeClass("sign-active");
				$("#form1").addClass("sign-active");
		}); */
		
		//性别切换
		$(".tab_sex").each(function(index,element){
			/* var _this=$(this); */
			$(this).click(function(){
				$(this).siblings().removeClass("sex_active");
				$(this).addClass("sex_active");
			});
			
		});
		//登录注册页面到首页暂不用
		
		//星座
		function getConstellation(month,day){
			var filterString=month+day;
			var filter=parseInt(filterString);
			//alert("filter:"+filter+",321:"+filterString);
			if(filter>=120 && filter<=218){
				return "水瓶座";
			}else if(filter>=219 && filter<=320){
				return "双鱼座";
			}else if(filter>=321 && filter<=419){
				return "白羊座";
			}else if(filter>=420 && filter<=520){
				return "金牛座";
			}else if(filter>=521 && filter<=621){
				return "双子座";
			}else if(filter>=622 && filter<=722){
				return "巨蟹座";
			}else if(filter>=723 && filter<=822){
				return "狮子座";
			}else if(filter>=823 && filter<=922){
				return "处女座";
			}else if(filter>=923 && filter<=1023){
				return "天秤座";
			}else if(filter>=1024 && filter<=1122){
				return "天蝎座";
			}else if(filter>=1123 && filter<=1221){
				return "射手座";
			}else if((filter>=1222 && filter<=1231)|| (filter>=11 && filter<=119)){
				return "魔羯座";
			}else{
				alert("error:"+filter);
			}
			
		}
		/**
		 * 获取手机号来得到用户id
		 * 
		 */
		function getUserID(){
			/* var userPhone=-1;
			if($("#form1").hasClass("sign-active")){
				userPhone=$("#login_uName").val();
			}else if($("#form3").hasClass("sign-active")){
				userPhone=$("#login_mobile").val();
			} */
			var userPhoneRequest="userPhone="+userPhone;
			var parameter=userPhoneRequest;
			var requestURL="http://wzixuan.com:8080/mind/user/findUserByPhone";
			AjaxRequest(GET_USER_ID,parameter,REQUEST_GET,requestURL);
		}
		function LogRequest(){
			var logUserName="userPhone="+$("#login_uName").val();
			var logUserPwd="userPwd="+$("#login_pwd").val();
			/* 包装 */
			var parameter=logUserName+"&"+logUserPwd;
			var requestURL="http://wzixuan.com:8080/mind/user/login";
			AjaxRequest(CALL_METHOD_LOG,parameter,REQUEST_GET,requestURL);
		}
		function RegRequest(){
			//encodeURIComponent暂时用不到
			//手机号
			var reMobile="userPhone="+$("#re_mobile").val();
			var reSex="userSex=";
			//性别
			$(".ul_sex li").each(function(index,element){
				if($(this).hasClass("sex_active")){
					if(index == 0){
						//男
						reSex+="男";
					}else if(index == 1){
						//女
						reSex+="女";
					}else if(index == 2){
						//私密
						reSex+="私密";
					}
				}
			});
			//出生年月
			var reBornYear=$("#re_born_year").val();
			var reBornMonth=$("#re_born_month").val();
			var reBornDay=$("#re_born_day").val();
			//alert(reBornYear+"/"+reBornMonth+"/"+reBornDay);
			var reBorn="userBri="+(reBornYear+"-"+reBornMonth+"-"+reBornDay);
			//年龄
			var reAge="userAge="+(2020-reBornYear);
			//星座
			var reConString=getConstellation(reBornMonth,reBornDay);
			//alert(reConString);
			var reCon="userCon="+reConString;
			//昵称
			var NickName="未命名";
			var reNickName="userNickName="+NickName;
			//密码
			var rePassword="userPwd="+$("#re_password").val();
			//记住用户名密码
			mn_regPhone=$("#re_mobile").val();
			mn_regPwd=$("#re_password").val();
			/* 包装 */
			var parameter=reAge+"&"+reBorn+"&"+reCon+"&"+reNickName+"&"+reMobile+"&"+rePassword+"&"+reSex;//待了解
			var requestURL="http://wzixuan.com:8080/mind/user/register";
			var method=CALL_METHOD_REG;
			AjaxRequest(method,parameter,REQUEST_POST,requestURL);
			
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
								//alert("响应成功");
								requestCodeMethod(callMethod,xmlHttpReq.responseText);
								//document.getElementById("tst").innerHTML=xmlHttpReq.responseText;
								//alert(xmlHttpReq.responseText);
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
								//requestErrorCode(callMethod,xmlHttpReq.status);
								break;
						}
					}
				}
			}
			
		}
		/* 
		-0:表示未初始化，对象已经建立，但是没调用onen方法
		
		-1：对象已建立，但是未调用send方法
		
		-2：发送数据，已调用send方法，但当前状态及http头未知
		
		-3：已接收部分数据，但是数据不全
		
		-4：数据接收完毕
		
		4、常用属性和方法 
		*/
		function requestCodeMethod(callMethod,responseText){
			switch(callMethod){
				case CALL_METHOD_REG:
					requestCodeReg(responseText);
					break;
				case CALL_METHOD_LOG:
					requestCodeLog(responseText);
					break;
				case GET_VERIFICATION_CODE_LOG:
					verificationCodeLog(responseText);
					break;
				case GET_VERIFICATION_CODE_REG:
					verificationCodeReg(responseText);
					break;
				case GET_USER_ID:
					userIDData(responseText);
					break;
				default:
					break;
			}
		}
		function parseReturnJson(responseText){
			var obj=JSON.parse(responseText);
			return obj.code;
		}
		function parseReturnObj(responseText){
			var obj=JSON.parse(responseText);
			return obj;
		}
		/**
		 * 用户ID获取
		 * @param {Object} responseText
		 */
		function userIDData(responseText){
			var obj=parseReturnObj(responseText);
			var userID=obj.userId;
			addLocalStorageUID(userID);
			//alert("userID:"+userID);
			//测试window.location.href="index.html?userid="+userID;
			window.location.href="index.html";
		}
		/**得到注册验证码
		 * @param {Object} responseText
		 */
		function verificationCodeReg(responseText){
			var requestCode=parseReturnJson(responseText);
			//alert(requestCode);
			switch(requestCode){
				case 105:
					//继续解析
					var obj=parseReturnObj(responseText);
					//var objCode=JSON.parse();
					random_Captcha_reg=obj.object.code;
					userPhone=$("#re_mobile").val();//手机号
					$("#reg_code_btn").attr("disabled",true);
					var time_code_reg=setInterval(function(){
						$("#reg_code_btn").text(--s_reg+"s");
						if(s_reg==0){
							clearInterval(time_code_reg);
							$("#reg_code_btn").text("获取验证码");
							$("#reg_code_btn").attr("disabled",false);
							s_reg = 60;
							random_Captcha_reg=-1;
							}
					
					}, 1000);　
					
					mui.alert(''+random_Captcha_reg, '注册验证码',"确定", function() {
						
					},'div');
					//alert("注册验证码："+obj.object.code);
					break;
				case 106:
					//验证码长度为0，获取失败
					mui.alert('验证码获取失败，请重新尝试', '注册提示','确认', function() {
					},'div');
				    break;
				case 107:
					mui.alert('手机号已注册!', '注册提示','确认', function() {
					},'div');
				    break;
				default:
					mui.alert('验证码获取失败', '错误提醒','确认', function() {
					},'div');
					break;
			}
		}
		/**
		 * 得到登录验证码
		 * @param {Object} responseText
		 */
		function verificationCodeLog(responseText){
			var requestCode=parseReturnJson(responseText);
			//alert(requestCode);
			switch(requestCode){
				case 105:
					//继续解析
					var obj=parseReturnObj(responseText);
					//var objCode=JSON.parse();
					random_Captcha_log=obj.object.code;
					userPhone=$("#login_mobile").val();//手机号
					$("#login_code_btn").attr("disabled",true);
					var time_code_log=setInterval(function(){
						$("#login_code_btn").text(--s_log+"s");//+"s后重新获取"
						if(s_log==0){
							clearInterval(time_code_log);
							$("#login_code_btn").text("获取验证码");
							$("#login_code_btn").attr("disabled",false);
							s_log = 60;
							random_Captcha_log=-1;
							}
					}, 1000);　
					mui.alert(''+random_Captcha_log, '登录验证码','确定', function() {
						
					},'div');
					//alert("登录验证码："+obj.object.code);
					break;
				case 106:
					//验证码长度为0，获取失败
					mui.alert('验证码获取失败，请重新尝试', '登录提示','确认', function() {
					},'div');
				    break;
				case 107:
					mui.alert('登录失败', '登录提示','确认', function() {
					},'div');
				    break;
				default:
					mui.alert('登录失败', '错误提醒','确认', function() {
					},'div');
					break;
			}
		}
		function requestCodeLog(responseText){
			var requestCode=parseReturnJson(responseText);
			//alert(requestCode);
			switch(requestCode){
				case 101:
					mui($("#loginUP")).button('reset');
					logSuccess();
					break;
				case 102:
					mui($("#loginUP")).button('reset');
					mui.alert('用户名或密码有误!', '登录提示','确认', function() {
					},'div');
				    break;
				default:
					break;
			}
		}
		function requestCodeReg(responseText){
			var requestCode=parseReturnJson(responseText);
			switch(requestCode){
				case 103:
					mui($("#register_btn")).button('reset');
					regSuccess();
					break;
				case 104:
					mui($("#register_btn")).button('reset');
					mui.alert('注册失败', '注册提示','确认', function() {
					},'div');
				    break;
				default:
					break;
			}
		}
		
		function logSuccess(){
				userPhone=$("#login_uName").val();
				if($("#check").is(":checked")){
					addLocalStorageLogin(userPhone,$("#login_pwd").val());
				}else{
					clearLocalStorageLogin();
				}
				//在线状态保存
				addLocalStorageOnline();
				intoIndex();
		}
		function intoIndex(){
			mui.toast('欢迎来到Mood社区~',{ duration:'short', type:'div' });
			//long3500ms short 2000ms
			if("true" != localStorage.getItem(IS_PROMPT)){
				//alert("true");
				var btnArray = ['暂时不急', '完善'];
				mui.confirm('登录成功，是否立即完善个人信息？', 'Hello Mood', btnArray, function(e) {
					if (e.index == 1) {
						//info.innerText = '确认';
						//window.location.href="index.html";//进入个人资料设置页
						mui.alert('功能测试中，请等待开发人员完善~', '提示','确认', function() {
							getUserID();
						},'div');
						//mui.toast('功能正在测试，请等待开发人员完善~',{ duration:'short', type:'div' });
					} else {
						//info.innerText = '操作取消'
						//window.location.href="index.html";//直接进入主页
						getUserID();
					}
					addLocalStoragePrompt();
				},'div');
			}else if("true" == localStorage.getItem(IS_PROMPT)){
				getUserID();
				//alert("false");
			}
		}
		function regSuccess(){
			var btnArray = ['暂时不急', '登录'];
			mui.confirm('注册成功，是否立即登录？', 'Hello Mood', btnArray, function(e) {
				if (e.index == 1) {
					$(".sign-active").removeClass("sign-active");
					$(".sign-up-htm").removeClass("pre-scrollable");
					$("#switch_log").addClass("sign-active");
					$("#form1").addClass("sign-active");
					$(".table-wb1").text("忘记密码？");
					$(".table-wb2").text("切换登录方式");
					//立即登录应该自动填写账号密码，只待滑块验证
					$("#login_uName").focus();
					$("#login_uName").val(mn_regPhone);
					$("#login_pwd").focus();
					$("#login_pwd").val(mn_regPwd);
					
				} else {
					//info.innerText = '操作取消'
					window.location.href="index.html";
					mui.toast('登录取消，返回首页',{ duration:'short', type:'div' });
				}
				mn_regPhone="";
				mn_regPwd="";
			},'div');
		}
		/**
		 * 记住密码
		 */
		/* if($("#check").is(":checked")){
			var getLoginData=getLocalStorageLogin();
			if(typeof(getLoginData[0]) != "undefined" && typeof(getLoginData[1]) != "undefined"){
				//$("#login_uName").focus();
				$("#login_uName").parent().addClass("active");
				$("#login_uName").val(getLoginData[0]);
				//$("#login_pwd").focus();
				$("#login_pwd").parent().addClass("active");
				$("#login_pwd").val(getLoginData[1]);
				//alert(getLoginData[0]+":"+getLoginData[1]);
			}
		} */
		if("true" == localStorage.getItem(IS_REMEMBER_ACCOUNT)){
			$("#check").prop("checked", true);
			var getLoginData=getLocalStorageLogin();
			if(typeof(getLoginData[0]) != "undefined" && typeof(getLoginData[1]) != "undefined"){
				//$("#login_uName").focus();
				$("#login_uName").parent().addClass("active");
				$("#login_uName").val(getLoginData[0]);
				//$("#login_pwd").focus();
				$("#login_pwd").parent().addClass("active");
				$("#login_pwd").val(getLoginData[1]);
				//alert(getLoginData[0]+":"+getLoginData[1]);
			}
		}else if("false" == localStorage.getItem(IS_REMEMBER_ACCOUNT)){
			//alert("false");
			$("#check").prop("checked", false);
		}else{
			$("#check").prop("checked", true);//新用户默认记住密码
			//mui.alert('记住密码出错!', '提示','确认', function() {},'div');
		}
		//getLocalStorageLogin();
		function getLocalStorageLogin(){
			var arr=new Array();
			//var uName=localStorage.getItem(LOCAL_STORAGE_USERNAME);
			//var uPwd=localStorage.getItem(LOCAL_STORAGE_PASSWORD);
			arr[0]=localStorage.getItem(LOCAL_STORAGE_USERNAME);
			arr[1]=localStorage.getItem(LOCAL_STORAGE_PASSWORD);
			//alert(arr[0]+","+arr[1]);
			return arr;
			//alert("uName"+uName+",uPwd"+uPwd);
		}
		function addLocalStorageLogin(username,password){
			localStorage.setItem(IS_REMEMBER_ACCOUNT,true);
			localStorage.setItem(LOCAL_STORAGE_USERNAME,username);
			localStorage.setItem(LOCAL_STORAGE_PASSWORD,password);
			//getLocalStorageLogin();
		}
		function clearLocalStorageLogin(){
			localStorage.setItem(IS_REMEMBER_ACCOUNT,false);
			localStorage.removeItem(LOCAL_STORAGE_USERNAME);
			localStorage.removeItem(LOCAL_STORAGE_PASSWORD);
		}
		$("#check").click(function(){
			if($(this).is(":checked")){
				mui.toast('记住密码已勾选',{ duration:'short', type:'div' });
				//$(this).prop("checked", true);
				//alert("true");
				localStorage.setItem(IS_REMEMBER_ACCOUNT,true);
			}else{
				mui.toast('取消记住密码',{ duration:'short', type:'div' });
				clearLocalStorageLogin();
				//alert("false");
			}
		});
		//保存登录状态
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
		function addLocalStoragePrompt(){
			localStorage.setItem(IS_PROMPT,true);
		}
		function changeLocalStoragePrompt(flag){
			localStorage.setItem(IS_PROMPT,flag);
		}
		function clearLocalStoragePrompt(flag){
			localStorage.removeItem(IS_PROMPT);
		}
		/* function toLogin(){
			$(".sign-active").removeClass("sign-active");
			$(".sign-up-htm").removeClass("pre-scrollable");
			$("#switch_log").addClass("sign-active");
			$("#form1").addClass("sign-active");
			$(".table-wb1").text("忘记密码？");
			$(".table-wb2").text("切换登录方式");
			
		} */
		/* function requestErrorCode(callMethod,errorCode){
			switch(callMethod){
				case CALL_METHOD_REG:
					regError(errorCode);
					break;
				case CALL_METHOD_LOG:
					logError(errorCode);
					break;
				default:
					break;
			}
		} */
		
		var viewportWidth2 = document.documentElement.clientWidth;//屏幕宽度
		if(viewportWidth2<=520 && viewportWidth2>=410){//测试
			$(".sliderContainer").css({"width":"220px","height":"30px","line-height":"30px"});
			$(".sliderContainer_success .sliderMask").css("height","28px");
			$(".sliderContainer_fail .slider").css("height","28px");
			$(".sliderContainer_fail .sliderMask").css("height","28px");
			$(".sliderMask").css("height","30px");
			$(".slider").css({"width":"30px","height":"30px"});
			$(".sliderIcon").css({"top":"10px","left":"8px"});
			$(".hr").css("margin","60px 0 50px 0");//320px时横线挤压
		}else if(viewportWidth2<410 && viewportWidth2>=360){//测试
			$(".sliderContainer").css({"width":"220px","height":"30px","line-height":"30px"});
			$(".sliderContainer_success .sliderMask").css("height","28px");
			$(".sliderContainer_fail .slider").css("height","28px");
			$(".sliderContainer_fail .sliderMask").css("height","28px");
			$(".sliderMask").css("height","30px");
			$(".slider").css({"width":"30px","height":"30px"});
			$(".sliderIcon").css({"top":"10px","left":"8px"});
			$(".hr").css("margin","36px 0 50px 0");//320px时横线挤压
		}else if(viewportWidth2<360 && viewportWidth2>=320){//测试
			$(".sliderContainer").css({"width":"180px","height":"30px","line-height":"30px"});
			$(".sliderContainer_success .sliderMask").css("height","28px");
			$(".sliderContainer_fail .slider").css("height","28px");
			$(".sliderContainer_fail .sliderMask").css("height","28px");
			$(".sliderMask").css("height","30px");
			$(".slider").css({"width":"30px","height":"30px"});
			$(".sliderIcon").css({"top":"10px","left":"8px"});
			$(".hr").css("margin","5px 0 50px 0");//320px时横线挤压
		}else if(viewportWidth2<320){//测试
			$(".sliderContainer").css({"width":"120px","height":"30px","line-height":"30px"});
			$(".sliderContainer_success .sliderMask").css("height","28px");
			$(".sliderContainer_fail .slider").css("height","28px");
			$(".sliderContainer_fail .sliderMask").css("height","28px");
			$(".sliderMask").css("height","30px");
			$(".slider").css({"width":"30px","height":"30px"});
			$(".sliderIcon").css({"top":"10px","left":"8px"});
		}
		/* if(viewportWidth2<360){
				$(".mind_code_btn").text("获取");
		} */

		
	}
})(jQuery,window,document);
/*
在定义插件之前添加一个分号，可以解决js合并时可能会产生的错误问题；
undefined在老一辈的浏览器是不被支持的，直接使用会报错，js框架要考虑到兼容性，因此增加一个形参undefined，就算有人把外面的 undefined 定义了，里面的 undefined 依然不受影响；
把window对象作为参数传入，是避免了函数执行的时候到外部去查找。

为了让你开发的插件应用更加广泛，兼容性更加好，还要考虑到用插件的人的一些特殊的做法，例如，有些朋友为了避免jquery和zeptojs冲突，将jquery的前缀“$”,修改为“jQuery”，还有些朋友将默认的document等方法修改。为了让你的插件在这些东西修了了的情况下照常运行，那么我们的做法是，把代码包裹在如下里面

 */