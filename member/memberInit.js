var memberInit = function()
{
	//動的にメンバー情報作成する為に本体を取得
	var member_main = window.document.getElementById( "member_main" );
	
	for(var i=0,len=memberInfo.length; i<len; i++)
	{
		//member_main_column
		var member = document.createElement('div');
		member.setAttribute('id', "id_"+memberInfo[i].codename);
		member.setAttribute('class', 'member_main_column');
		member.style.cursor = "pointer";
		member.style.backgroundColor = ["#888","#999"][i%2];
		
		//本体に連結
		member_main.appendChild(member);
		
		
		//member_usericon
		var member_usericon = document.createElement('div');
		member_usericon.setAttribute('class', 'member_usericon');
		member_usericon.style.position = "absolute";
		member_usericon.style.width = "120px";
		member_usericon.style.height = "120px";
		member_usericon.style.top = "5px";
		member_usericon.style.left = "10px";
		
		//member_usericon_img
		var member_usericon_img = document.createElement('img');
		member_usericon_img.setAttribute('src', memberInfo[i].icon);
		member_usericon_img.setAttribute('width', 120);
		member_usericon_img.setAttribute('height', 120);
		member_usericon.appendChild(member_usericon_img);
		
		//memberに連結
		member.appendChild(member_usericon);
		
		
		//member_codename
		var member_codename = document.createElement('div');
		member_codename.style.position = "absolute";
		member_codename.style.width = "120px";
		member_codename.style.height = "40px";
		member_codename.style.top = "125px";
		member_codename.style.left = "10px";
		
		//member_codename_value
		var member_codename_value = document.createElement('div');
		member_codename_value.style.position = "absolute";
		member_codename_value.style.width = "120px";
		member_codename_value.style.height = "40px";
		member_codename_value.style.textAlign = "center";
		member_codename_value.style.fontSize = "16px";
		member_codename_value.style.fontWeight = "bold";
		member_codename_value.innerHTML = memberInfo[i].codename;
		member_codename.appendChild(member_codename_value);
		
		//memberに連結
		member.appendChild(member_codename);
		
		
		//member_gameicon
		var member_gameicon = document.createElement('div');
		member_gameicon.style.position = "absolute";
		member_gameicon.style.top = "160px";
		member_gameicon.style.left = "10px";
		member_gameicon.style.width = "120px";
		
		var game = memberInfo[i].game;
		for(var g=0; g<Object.keys(game).length; g++)
		{
			var gameName = [];
			for(key in game)
			{
				gameName.push(key);
			}
			
			//member_gameicon_kind
			var member_gameicon_kind = document.createElement('div');
			member_gameicon_kind.style.float = "left";
			member_gameicon_kind.style.marginRight = "4px";
			
			//member_gameicon_kind_img
			var member_gameicon_kind_img = document.createElement('img');
			member_gameicon_kind_img.setAttribute('src', "icon/icon_game_"+gameName[g]+".png");
			member_gameicon_kind_img.setAttribute('class', 'member_gameicon');
			member_gameicon_kind.appendChild(member_gameicon_kind_img);
			
			//member_gameicon_kindに連結
			member_gameicon.appendChild(member_gameicon_kind);
		}
		
		//memberに連結
		member.appendChild(member_gameicon);
		
		//member_hitbox
		var member_hitbox = document.createElement('a');
		member_hitbox.setAttribute('id', "member_hitbox_"+i);
		member_hitbox.style.position = "absolute";
		member_hitbox.style.width = "140px";
		member_hitbox.style.height = "190px";
		member_hitbox.style.backgroundColor = "#FFF";
		member_hitbox.style.opacity = "0";
		member_hitbox.href = "page/"+memberInfo[i].codename;
		
		//本体に連結
		member.appendChild(member_hitbox);
		
		//member_hitbox mouseover
		function onMouseHitBox(i,flag)
		{
			return function(evt)
			{
				if( flag )  document.getElementById( "member_hitbox_"+i ).style.opacity = "0.5";
				else		document.getElementById( "member_hitbox_"+i ).style.opacity = "0";
			}
		}
		document.getElementById( "member_hitbox_"+i ).addEventListener( "mouseover", onMouseHitBox(i,true), true );
		document.getElementById( "member_hitbox_"+i ).addEventListener( "mouseout", onMouseHitBox(i,false), true );
		
		
	}
	
	/*/たてサイズ変更
	member_main.style.height = (250*memberInfo.length)+"px";
	
	var index_main_content = window.document.getElementById( "index_main_content" );
	index_main_content.style.height = (250*memberInfo.length)+(300)+"px";
	*/
	
};


