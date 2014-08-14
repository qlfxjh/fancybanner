

/* 通用使用css3动画效果的切换代码 */
//参数strId:wrapper div's ID; nTime:autoPlayer Interval Time
//引用格式如：var slider01 = new JW_fancyBanner("slider_02",4000);如果nTime==false， 不自动播放

function JW_fancyBanner(strId,nInterTime){
	var nInterTime;
	if(typeof(nTime)=="undefined"){
		nInterTime = 5000;
	}else{
		nInterTime = nTime;
	}
	var Index=0, oldIndex=0;
	var Wrapper = $('#'+strId);
	var WrapperInner = Wrapper.find('>.slider_content');
	var Items = WrapperInner.children();
	var ctrlWrapper = Wrapper.find(".slider_ctrl");
	var ctrlLis = Wrapper.find(".slider_ctrl span");
	var prev = Wrapper.find(".prev");
	var next = Wrapper.find(".next");
	var maxIndex = Items.length -1;
	var handleInter = null;
	var dir;
	var ifUnderMove = false;
	function init(){
		//nInterTime可以为false. 为false时不定时播放
		Wrapper.swipe({
		  swipe:onSwipe,
		  finger:0
		});
		
		if(ctrlLis.length>0){
			ctrlLis.bind("click",liClick);
		}
		if(prev.length>0){
			prev.bind("click",go_left);
		}
		if(next.length>0){
			next.bind("click",go_right);
		}
		
		
		//WrapperInner.css("height",offsetHeight+"px");
		Index = 0;
		console.debug(Items.length);
		var clip01, clip02;
		for(var i=0; i<Items.length; i++){
			Items.eq(i).css({"zIndex":Items.length -i});
			clip01 = document.createElement("div");
			clip01.className = "clip_01";
			clip02 = document.createElement("div");
			clip02.className = "clip_02";
			Items.eq(i).append(clip01).append(clip02);
			
		}
		Items.eq(0).show().addClass("moveenter");
		
		if(nInterTime){
			handleInter = setInterval(AutoRun,nInterTime);
		}
		
	}
	function onSwipe(event, direction, distance, duration, fingerCount){
		if(direction=="left"){
			_goRight();
		}else if(direction=="right"){
			_goLeft();
		}
	}
	
	//点击小点切换幻灯片
	function liClick(){
		var _index = ctrlLis.index(this);
		go_to(_index);
	}
	//自动播放
	function AutoRun(){
		go_right();
	}
	//播放器切换的前的准备工作
	function _shift(){
		ifUnderMove = true;
		if(ctrlLis.length>0){
			ctrlLis.removeClass("current");
			ctrlLis.eq(Index).addClass("current");
		}
		//Items.removeClass("moveout movein");
		//Items.eq(oldIndex).addClass("moveout");
		//Items.eq(Index).addClass("movein");
		//把item .con的节点复制插入clip
		for(var i=0; i<Items.length; i++){
			if(i!=Index&&i!=oldIndex){
				Items.eq(i).removeClass("moveenter moveout").hide();
			}
		}
		var con = Items.eq(Index).find(">.con");
		var clip01 =  Items.eq(Index).find(".clip_01");
		var clip02 =  Items.eq(Index).find(".clip_02");
		var oldCon = Items.eq(oldIndex).find(">.con");
		var oldClip01 =  Items.eq(oldIndex).find(".clip_01");
		var oldClip02 =  Items.eq(oldIndex).find(".clip_02");
		
		if(Index>oldIndex){
			//前进
			if(!!Items.eq(oldIndex).data("isCopy")){
				//表示已初始化过clip，就不需要设置clip内容了，而是直接显隐就可以了。
				oldCon.hide();
				if(oldIndex%4<2){
					oldClip01.show().removeClass("enter_left").addClass("leave_left");
					oldClip02.show().removeClass("enter_right").addClass("leave_right");
				}else{
					oldClip01.show().removeClass("enter_up").addClass("leave_up");
					oldClip02.show().removeClass("enter_down").addClass("leave_down");
				}
				
			}else{
				var conClone = oldCon.clone();
				var conClone2 = oldCon.clone();
				oldCon.hide();
				if(oldIndex%4<2){
					oldClip01.empty().show().append(conClone).addClass("leave_left");
					oldClip02.empty().show().append(conClone2).addClass("leave_right");	
				}else{
					oldClip01.empty().show().append(conClone).addClass("leave_up");
					oldClip02.empty().show().append(conClone2).addClass("leave_down");
				}
				
				Items.eq(oldIndex).data("isCopy",true);
			}
			con.show();
			clip01.hide();
			clip02.hide();

		}else{
			//后退
			if(!!Items.eq(Index).data("isCopy")){
				//表示已初始化过clip，就不需要设置clip内容了，而是直接显隐就可以了。
				con.hide();
				if(Index%4<2){
					clip01.show().removeClass("leave_left").addClass("enter_left");
					clip02.show().removeClass("leave_right").addClass("enter_right");
				}else{
					clip01.show().removeClass("leave_up").addClass("enter_up");
					clip02.show().removeClass("leave_down").addClass("enter_down");
				}
				
			}else{
				var conClone = con.clone();
				var conClone2 = con.clone();
				con.hide();
				if(Index%4<2){
					clip01.empty().append(conClone).addClass("enter_left");
					clip02.empty().append(conClone2).addClass("enter_right");
				}else{
					clip01.empty().append(conClone).addClass("enter_up");
					clip02.empty().append(conClone2).addClass("enter_down");
				}
				
				Items.eq(Index).data("isCopy",true);
			}
			
		}
		Items.eq(Index).show().removeClass("moveout").addClass("moveenter");
		Items.eq(oldIndex).removeClass("moveenter").addClass("moveout");
		setTimeout(function(){
			Items.eq(oldIndex).hide().removeClass("moveout");
			ifUnderMove = false;
		},1000);
		
		
		if(nInterTime&&handleInter!=null){
			clearInterval(handleInter);
			handleInter = setInterval(AutoRun,nInterTime);
		}

	}
	//播放器向右切换
	function _goRight(){
		if(ifUnderMove){
			return;
		}
		if(Index<maxIndex){
			oldIndex = Index;
			Index ++;
			_shift();
		}
		
	}
	this.goRight = _goRight;
	//播放器向左切换
	function _goLeft(){
		if(ifUnderMove){
			return; 
		}
		if(Index>0){
			oldIndex = Index;
			Index--;
			_shift();
		}
		
	}
	this.goLeft = _goLeft;
	//播放器切换到某一帧
	function go_to(idx){
		if(ifUnderMove){
			return;
		}
		var _idx = idx;
		if(_idx <0){
			_idx  = 0;
		}else if(_idx > maxIndex){
			_idx = maxIndex;
		}
		
		if(_idx==Index){
			return;	//如果要目的index跟当前的一样的话，就无需操作了。直接返回
		}
		oldIndex = Index;
		Index = _idx;
		
		_shift();
	}
	this.goTo = go_to;
	//读取当前显示的是第几帧
	this.getIndex = function(){
		return Index;
	}
	init();
	
}

