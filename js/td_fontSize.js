fontjsize01=1;
function font_enlarge(){
	if(fontjsize01>0.9){
		fontjsize01++;
	}
	else{
		fontjsize01+=0.1;
	}
	obj_css01 = document.querySelector(":root");
	obj_css01.style.setProperty("--fontjsize00", fontjsize01+"rem");
}

function font_deflate(){
	if(fontjsize01>1){
		fontjsize01--;
	}
	else{
		fontjsize01-=0.1;
	}
	obj_css01 = document.querySelector(":root");
	obj_css01.style.setProperty("--fontjsize00", fontjsize01+"rem");
}

