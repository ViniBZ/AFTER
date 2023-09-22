function test_tools()
{
    log('TEST TOOLS 3 !!!');
}

//------------------------------------------- BUTTON RESPONSE
function button_response(b, event)
{
	event.preventDefault();
	switch (b) {
		case 0:
			font_size_click();
		break;
		case 1:
			alert("BUTTON:1:");
		break;
		case 2:
			set_text_color();
		break;
		case 3:
			alert("BUTTON:3:");
		break;
		case 4:
			//BOLD
			set_format(0, 0);
			
		break;
		case 5:
			//ITALIC
			set_format(0, 1);
			
		break;
		case 6:
			//UNDERLINE
			set_format(0, 2);
		break;
		case 7:
			//OVERLINE
			set_format(0, 3);
			
		break;
		case 8:
			//CROSSED
			set_format(0, 4);
		break;
		case 9:
			//OVERLINE
			
			save_to_file("content_after.txt", text_div.innerHTML);
		break;
		case 10:
			
		break;
		
		default:
      // code block
	}
	
	//log(selection);
}

//------------------------------------------- BUTTON RESPONSE
function font_size_click()
{
	if(!drop)
	{
		let d = ELM('font-size-dropdown');
		d.style.display = 'block';
		drop = true;
	}else{
		let d = ELM('font-size-dropdown');
		d.style.display = 'none';
		drop = false;
	}

}

//------------------------------------------- SET FONT SIZE
function set_font_size(value)
{
	font_size = parseInt(value);
	buttons[0].innerText = value+'pt';
}


//------------------------------------------- SET FONT SIZE
function set_text_color()
{
	const startTime = new Date();
	// save_to_file('content_orig.txt', text_div.innerHTML);
	
	// clear_log();
	parse_html(text_div, 0);

	
	make_formatted_html(text_div);
	let format_data = format_data_to_str();
	save_to_file('content_format.txt',format_data);
	log('WORKED 9');

	save_to_file('content_after.txt', text_div.innerHTML);

	const endTime = new Date();
	const elapsedTime = endTime - startTime; // Time in milliseconds

	log('Time taken: '+elapsedTime+' milliseconds');
	log(node_tree(text_div, 0));
	return;

	var div_elm = text_div.children[0];
	var div_elm_2 = div_elm.children[0];
	var str = 'outer div text:'+div_elm.innerText;
	str += '<br>inner div text:'+div_elm_2.innerText;
	str = getTextBeforeElement(div_elm_2);

	let div_2 = ELM('DIV-2');
	str = getTextBeforeElement(div_2);

	log(str);
	return;

	var sel_text = get_selection();
	var log_str = "SEL TEXT TYPE:"+typeof(sel_text);
	log_str += "<br>SEL TEXT:"+sel_text;
	log_str += "<br>CURSOR:"+cur;
	log_str += "<br>ANCHOR:"+anc;
	log_str += "<br>FOCUS:"+foc;
	log(log_str);
	if(sel_text === false){return;}
	
	// log('set_color:');
	// var content = '<span class="r">RED TEXT</span>';
	// content += '<span class="b">BLUE TEXT</span>';
	// content += '<span class="o">ORANGE <span style="font-size:20pt" class="TE_b">BOLD</span></span>';
	//text_div.innerHTML = content;
	let selected_text = '';
	let sel_s = 0;
	let sel_e = 0;
	let cursor = 0;
	let ran = 'NOR';
	let pre_str = '';
    if (window.getSelection)
	{
		
		var selection = window.getSelection();
      	selected_text = selection.toString();
		// window.getSelection().deleteFromDocument();
		const range = selection.getRangeAt(0);
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(text_div);
		preCaretRange.setEnd(range.endContainer, range.endOffset);
		pre_str = preCaretRange.toString(); 
		cursor = pre_str.length;
		if (selection.rangeCount > 0) 
		{
			// const range = selection.getRangeAt(0);
			// const preCaretRange = range.cloneRange();
			// preCaretRange.selectNodeContents(text_div);
			// preCaretRange.setEnd(range.endContainer, range.endOffset);
			// pre_str = preCaretRange.toString(); 
			// cursor = pre_str.length;
			sel_s = selection.anchorOffset;
			sel_e = selection.focusOffset;
			ran = 'RAN';
		}

		// log('YES CURSOR:'+cursor+'. sel_s:'+sel_s+'. sel_e:'+sel_e+'ran:'+ran);
    }
	
	let elm = NEW_ELM('span');
	elm.style.color = '#FF0000';
	elm.style.fontSize = '20pt';
	elm.innerText = selected_text;

	text_div.append(elm);
	

	//log('SEL:'+selected_text);
}
//------------------------------------------- SET BOLD
function set_bold()
{
	
}

//------------------------------------------- SET FORMAT
function set_format(group, value)
{
	if(isNaN(group)){return;}
	if(group < 0 || group > 2){return;}
	//group is:
	//0: format
	//1: color
	//2: size

	// track_log('FORMAT NUM:'+group_0_val[value]);
	
	const startTime = new Date();

	get_selection();

	if(sel_s == sel_e)
	{		
		let bo = 4;
		if(TF_has_format(group, value, active_f) == true)
		{
			//It wont get to remove format for color and size
			//just setting a different value that will apply
			active_f = TF_remove_format(group, value, active_f);
			if(group == 0)
			{
				buttons[value+bo].style.borderStyle = 'none';
			}
		}else{
			active_f = TF_apply_format(group, value, active_f);

			if(group == 0)
			{
				buttons[value+bo].style.borderStyle = 'inset';
			}
		}

		let cur_f = 0;
		while(cur_f < 5)
		{
			if(TF_has_format(0, cur_f, active_f))
			{
				track_log('F'+cur_f+' ACTIVE');
			}else{
				track_log('F'+cur_f+' INACTIVE');
			}
			cur_f++;
		}
		set_selection(sel_s, sel_e);
	}else{

		let f;
		let undo = false;
		let u_n = 0;
		let not_u_n = 0;
		if(group == 0)
		{
			undo = true;
			for(let i = sel_s;i < sel_e;i++)
			{
				f = TEXT_FORMAT[i];
				if(TF_has_format(group, value, f) === false)
				{
					undo = false;
					break;
				}
			}
		}
		// log('WORKED 3');
		//MARKER:perhaps for group 0, because undo only 
		//happens when all char in the range have the value, 
		//it wouldnt be necessary to check if the TEXT_FORMAT[i] 
		//has the value first in TF_remove_format()
		
		for(let i = sel_s;i < sel_e;i++)
		{
			f = TEXT_FORMAT[i]
			if(undo)
			{
				f = TF_remove_format(group, value, f);
			}else{
				f = TF_apply_format(group, value, f);
				
			}
		}
		
		
		make_formatted_html(text_div);
		set_selection(sel_s, sel_e);
	}
	const endTime = new Date();
	const elapsedTime = endTime - startTime; // Time in milliseconds
	// log('SET FORMAT TIME:'+elapsedTime);
	// log('WORKED 7');
		
}