function function_array_sort_index(array01){ // function_array_sort_index s RETURN THE SORTED INEX OF DATA , SHOUD BE PUT IN THIS ORDER
var i01,i02,i03,array02,array03,int01,int02,int03;
int01=array01.length;
array02=new Array();
array03=new Array();
for(i01=0;i01<int01;i01++){ //for s init array
	array02[i01]=-1;
	array03[i01]=-1;
} //for e
for(i01=0;i01<int01;i01++){ //for s
	int02=0;
	int03=0;
	array04=new Array();
	if(array02[i01]==-1){ //if s
		for(i02=0;i02<int01;i02++){ //for s
			if(array01[i01]==array01[i02]) {
				int03++;
				array02[i02]=i01;
				array04.push(i02);
			}
			if(array01[i01]>array01[i02]) int02++;
		} //for e
//alert('int03:\t'+int03+'\nint02:\t'+int02+'\narray04:\t'+array04);
		for(i03=0;i03<int03;i03++){ //for s
			array03[int02+i03]=array04[i03];
//alert(array01+'\n'+array02+'\n'+array04+'\n'+array03);
		} //for e
	} //if e
} //for e
//alert(array01+'\n'+array02+'\n'+array03);
return array03;
}// function_array_sort_index e

boolean_sort_direction=0;//正序和反序

function td_sort(id,cellOffset,start_row){ // td_sort s cellOffset IS COLUMN INDEX FROM 0 TO N , START FROM ROW INEX start_row (0 TO N)
	tmp02_array=new Array();//SORT BASED ARRAY STORE HERE
	tmp04=document.getElementById(id);//TABLE OBJECT
	obja01=document.getElementById(id).rows;//ALL THE ROWS
	for(i01=start_row;i01<obja01.length;i01++){ //for s
		tmp02_array.push(obja01[i01].cells[cellOffset].innerHTML);
	} //for e
	tmp03_array=function_array_sort_index(tmp02_array);//NOW GET THE NEW ORDER
	if(boolean_sort_direction==0){ //if s
		for(i01=0;i01<tmp03_array.length;i01++){ //for s
			tmp02=obja01[tmp03_array[i01]+start_row].cloneNode(true);//复制元素,执行后元素直接复制与原元素内,只是不能显示而已,但参加
			tmp04.appendChild(tmp02);
		} //for e
		boolean_sort_direction=1;
	} //if e 
	else{ //else s
		for(i01=tmp03_array.length-1;i01>=0;i01--){ //for s
			tmp02=obja01[tmp03_array[i01]+start_row].cloneNode(true);//复制元素,执行后元素直接复制与原元素内,只是不能显示而已,但参加计数
			tmp04.appendChild(tmp02);
		} //for e
		boolean_sort_direction=0;
	} //else e
	for(i01=0;i01<tmp03_array.length;i01++){ //for s
		tmp04.deleteRow(start_row);
	} //for e
}// td_sort e

function mtd_sort(id,cellOffset,start_row,prefix,subfix){ // td_sort s cellOffset IS COLUMN INDEX FROM 0 TO N , START FROM ROW  INEX INCLUDE start_row (0 TO N) ,prefix NUMBER BEFORE KEY ROW 0 to N ,subfix MUNBER INCLUDE KEY ROW 1 TO N. 
	// prefix + subfix == FULL TRUNK ROW NUMBER 
	//
	//
	//------prefix
	//--------start_row
	//------subfix
	//
	//
	tmp02_array=new Array();//SORT BASED ARRAY STORE HERE
	tmp04=document.getElementById(id);//TABLE OBJECT
	obja01=document.getElementById(id).rows;//ALL THE ROWS
	for(i01=start_row;i01<obja01.length;i01+=prefix+subfix){ //for s
		tmp02_array.push(obja01[i01].cells[cellOffset].innerHTML);
	} //for e
	tmp03_array=function_array_sort_index(tmp02_array);//NOW GET THE NEW ORDER[0]=32,[1]=7,[2]=0 TRUE INDEX NUMBER OF TABLE ROW
	if(boolean_sort_direction==0){ //if s
		for(i01=0;i01<tmp03_array.length;i01++){ //for s
			for(tmp05=prefix;tmp05>0;tmp05--){
			}
			for(tmp05=0;tmp05<subfix;tmp05++){
				tmp04=document.getElementById(id);//TABLE OBJECT
				tmp06=tmp04.insertRow(-1);
				tmp06.innerHTML=obja01[tmp03_array[i01]*(prefix+subfix)+start_row+tmp05].innerHTML;
			}
		} //for e
		boolean_sort_direction=1;
	} //if e 
	else{ //else s
		for(i01=tmp03_array.length-1;i01>=0;i01--){ //for s
			for(tmp05=prefix;tmp05>0;tmp05++){
                                tmp02=obja01[tmp03_array[i01]*(prefix+subfix)+start_row-tmp05].cloneNode(true);//复制元素,执行后元素直接复制与原元素内,只是不能显示而已,但参加
                                tmp04.appendChild(tmp02);
                        }
                        for(tmp05=0;tmp05<subfix;tmp05++){
                                tmp02=obja01[tmp03_array[i01]*(prefix+subfix)+start_row+tmp05].cloneNode(true);//复制元素,执行后元素直接复制与原元素内,只是不能显示而已,但参加
                                tmp04.appendChild(tmp02);
                        }

		} //for e
		boolean_sort_direction=0;

	} //else e
	for(i02=0;i02<(prefix+subfix)*tmp03_array.length;i02++){ //for s
		tmp04.deleteRow(start_row-prefix);
	} //for e
}// td_sort e




