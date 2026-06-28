
function function_table_click(obj01){
	i01=7;
	while(i01--){
		if(obj01.tagName=="MYDIV"){
				c=obj01.getAttribute("class");
				if(c=="css01"){
					obj01.setAttribute("class","css02");
				}else{
					obj01.setAttribute("class","css01");
				}
		}
		obj01=obj01.parentNode;
	}
}
