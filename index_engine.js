//DEFAULT VALUES
const DEF_FS = 10;
const DEF_COLOR = 0;

let AUTO_LOG_C = 0
let EDIT_LOG_C = 0
let SEL_C = 0;
let INPUT_C = 0;

var text_editor_div;
var text_div;
var text_div_lock = false;

//--------------- TEXT DATA SCTUCTURE
//TEXT NODE OFFSET START / END
//TNS / TNE
//how many char before said node

var TEXT;
var LINES = [];//pos and n
var TNS = [];
var TNE = [];

//text nodes
var TEXT_FORMAT = [];
class FORMAT
{
	constructor(type, format, color, size)
	{
		this.type = type;
		this.format = format;
		this.color = color;
		this.size = size;
		this.ref_type = 0;
		this.ref_node = 0;
	}
};

class LINE
{
	constructor(s, e)
	{
		this.s = s;
		this.e = e;
	}
};

class TABLE
{
	constructor(tr_n, td_n)
	{
		this.tr_n = tr_n;
		this.td_n = td_n;
	}
};

var TEXT_LEN = 0;//with br
///////// TYPE
// 0:normal char
// 1:br
// 2:space(&nbsp;)

///////// FORMAT (this list is little endian)
// 0[1]   : bold
// 1[2]   : italic
// 2[4]   : underline
// 3[8]   : overline
// 4[16]  : crossed
// 5[32]  : 
// 6[64]  : has_color
// 7[128] : has_size

///////// COLOR
// *(color if has_color, otherwise font size if has_size) 

///////// SIZE
// *(font size if has_color and has_size)

// PARSE HTML VARIABLES
var PH_C = 0;

var PH_bold = false;
var PH_ita = false;
var PH_und = false;
var PH_overl = false;
var PH_cross = false;
var PH_color = false;
var PH_size = false;
//---------------
var active_f = new FORMAT(0, 0, PH_color, PH_size);
var group_0_val = [1, 2, 4, 8, 16];
//---------------

var observer = new MutationObserver(text_changed);
var buttons = [];
//----
var change_i = 0;
var drop = false;
//----
var cursor;
var sel_s;
var sel_e;

//---------------------------- DEFAULT VALUES
var font_size = 10;

window.onload = function() {
  load_editor();
}
// ---------------------------------------- GET ELM BY ID
function ELM(id)
{
    return document.getElementById(id);
}
// ---------------------------------------- CREATE ELM OF TYPE
function NEW_ELM(type)
{
    return document.createElement(type);
}
// ---------------------------------------- LOAD EDITOR
function load_editor()
{

	text_editor_div = ELM("text-editor-div");
	var button_div = NEW_ELM("div");
	button_div.style.display = 'flex';
	button_div.style.textAlign = "center";
	
	var PAD = 10;
	//with padding
	var WID = 612;
	var HEI = 300;
	var button_n = 15;		
	var button_wid = parseInt((WID / button_n)-1);
	var button_img_wid = button_wid - 20;
	var text_pad = 5;
	var text_div_wid = WID - (2*PAD+2*text_pad);
	var text_div_hei = HEI - ((3*PAD+2*text_pad) + button_wid);
	
	//------------------------------------------- TEXT EDITOR DIV STYLE
	text_editor_div.style.position = "relative";
	text_editor_div.style.margin = "0 auto";
	text_editor_div.style.padding = PAD+"px";
	text_editor_div.style.boxSizing = "border-box";
	text_editor_div.style.border = "1px solid black";
	text_editor_div.style.width = WID+"px";
	text_editor_div.style.height = HEI+"px";
	
	//------------------------------------------- CREATING TOOLS
	// var buttons = []
	
	for (var i = 0; i < button_n; i++) {
	    buttons[i] = NEW_ELM("button");
	    buttons[i].id = "VZTE-button-"+i;
	    buttons[i].className = "VZTE-button";
	    buttons[i].setAttribute('onclick', 'button_response('+i+',event)');
	    
		if(i == 0)
		{
			buttons[i].innerText = font_size+'pt';

			
		}else{

			var img = NEW_ELM("img");
			img.setAttribute("src", "img/btn_img_"+i+".png");
			img.style.width = button_img_wid+"px";
			img.style.height = button_img_wid+"px";
			buttons[i].appendChild(img);
		}
		buttons[i].style.borderStyle = 'none';
	    buttons[i].style.width = button_wid+"px";
	    buttons[i].style.height = button_wid+"px";
	    
	    button_div.appendChild(buttons[i]);
	}
	//------------------------------------------- TEXT AREA DIV PROPERTIES
	text_div = NEW_ELM("div");
	text_div.id = "text-area";
	text_div.className = "text-area-div";
	// text_div.setAttribute("oninput", "text_div_input(event)");
	text_div.setAttribute("onkeydown", "text_div_keydown(event)");
	text_div.setAttribute("oninput", "text_div_input(event)");
	text_div.setAttribute("onbeforeinput", "text_div_before_input(event)");
	text_div.setAttribute("compositionupdate", "text_div_conposition_update(event)");
	text_div.setAttribute("contenteditable", "true");
	// text_div.setAttribute("onkeydown", "text_div_keydown(event)");
	// text_div.style.wordWrap = 'break-word';
	//text_div.setAttribute("onchange", "text_changed()");
	text_div.style.width = text_div_wid+"px";
	text_div.style.height = text_div_hei+"px";
	text_div.style.marginTop = PAD+"px";
	text_div.style.padding = text_pad+"px";
	text_div.style.overflow = "scroll";
	text_div.style.whiteSpace = "pre";
	
	//text_div.innerHTML = "<span style=\"background-color:white;\"></span>"
	//text_div.innerHTML += "<span style=\"color:blue;\">SOMETHING</span>"
		
	//------------------------------------------- SETTING OBSERVER
	var config = { attributes: true, childList: true, subtree: true, characterData: true };
	observer.observe(text_div, config);
	//------------------------------------------- SETTING 
	text_editor_div.appendChild(button_div);
	text_editor_div.appendChild(text_div);
	//------------------------------------------- FONT SIZE DROPDOWN
	let d = NEW_ELM('div');
	d.classList.add('dropdown');
	d.setAttribute('id', 'font-size-dropdown');
	d.style.position = 'absolute';
	d.style.top = '55px';
	d.style.backgroundColor = '#f9f9f9';
	d.style.padding = '8px';
	// d.style.height = '140px';
	// d.style.width = '60px';
	d.style.display = 'none';

	let s = NEW_ELM('input');
	s.setAttribute('type', 'range');
	s.setAttribute('min', '8');
	s.setAttribute('max', '30');
	s.setAttribute('orient', 'vertical');
	s.setAttribute('value', font_size);
	s.setAttribute('id', 'font-size-slider');
	s.setAttribute('oninput', 'set_font_size(this.value)');
	s.setAttribute('onchange', 'set_font_size(this.value)');
	s.style.height = '120px';
	s.style.width = '26px';

	d.append(s);
	button_div.append(d);
	// text_div.addEventListener('input', text_div_input);
	document.addEventListener('selectionchange', text_sel_change);
	
	read_from_file('text_sample_html.txt');
	// load_html_from_file('html_system_test.txt');
	
}
//------------------------------------------- BUTTON RESPONSE
function text_changed()
{
	// parse_html(text_div, 0);
	// make_formatted_html(text_div);
	// set_selection(sel_s, sel_e);

}
//------------------------------------------- BUTTONS EXTRA
function text_sel_change()
{
	
	var selection = window.getSelection();
	const range = selection.getRangeAt(0);
	if(selection_in_text_div(range))
	{
		get_selection();
		if(cursor == 0)
		{
			// active_f = TEXT_FORMAT[0];
			active_f.format = TEXT_FORMAT[0].format;
		}else{
			// active_f = TEXT_FORMAT[cursor-1];
			active_f.format = TEXT_FORMAT[cursor-1].format;
		}
	}
	save_to_file('metadata.txt', all_text_metadata());
	
}
//------------------------------------------- BUTTONS EXTRA
function text_div_before_input(event)
{
	return;
	track_log('ON BEFORE INPUT');
	event.preventDefault();
}
//------------------------------------------- BUTTONS EXTRA
async function text_div_input(event)
{
	event.preventDefault();
	return;
	// event.stopPropagation();
	const startTime = new Date();
	// track_log('INPUT');
	
	get_selection();
	// track_log('GOT SELECTION');
	if(event.inputType == 'insertText')
	{
		// track_log('FROM TEXT 2');
		// insert_text(event.data);
		const endTime = new Date();
		const elapsedTime = endTime - startTime; 
	}
	if(event.inputType == 'insertFromPaste')
	{
		// track_log('FROM PASTE 2');
		let text = await text_from_clipboard();
		// insert_text(text);
		// track_log('INPUT DATA:'+obj_to_str(event));
	}
	
	
	

	// track_log("<br><br>"+'INPUT TX:'+window.clipboardData.getData('Text'));
	// track_log('INPUT TIME:'+elapsedTime);

}
//------------------------------------------- TEXT FROM CLIPBOARD
async function text_from_clipboard()
{
	return navigator.clipboard.readText();
}

//------------------------------------------- BUTTONS EXTRA
function text_div_keydown(event)
{
	const startTime = new Date();
	// test_node_system();
	// return;
	let k = event.keyCode;
	// track_log('K:'+k);
	// track_log(obj_to_str(event));
	// INPUT_C++;
	// log_counters();
	let f = new FORMAT(0,1,0,0);
	
	// get_selection();
	// track_log('1 SEL S:'+sel_s+'. SEL E:'+sel_e+'. CUR:'+cursor);
	if(k > 32 && k < 41)
	{		
		// track_log('here 1'+"\n\n");
		return;
	}
	if(k == 13)
	{
		// track_log('here 3'+"\n\n");
		enter_pressed(event);
		event.preventDefault();
		const endTime = new Date();
		const elapsedTime = endTime - startTime; 
		track_log('TIME FOR EVENT:'+elapsedTime);
		return;
	}

	if(k == 8)
	{
		// track_log('here 4'+"\n\n");
		backspace_pressed(event);
		event.preventDefault();
		const endTime = new Date();
		const elapsedTime = endTime - startTime; 
		track_log('TIME FOR EVENT:'+elapsedTime);
		return;
	}
	if(k == 46)
	{
		// track_log('here 5'+"\n\n");
		delete_pressed(event);
		event.preventDefault();
		const endTime = new Date();
		const elapsedTime = endTime - startTime; 
		track_log('TIME FOR EVENT:'+elapsedTime);
		return;
	}
	if(k == 86 && event.ctrlKey)
	{
		event.preventDefault();
		let p = navigator.clipboard.readText();
		p.then((clip_text) => {
			insert_text(clip_text);
			});
		// insert_text(text);
		// track_log(obj_to_str(navigator));
		// track_log('PASTE V');
		return;	
	}
	if(k >47 && k < 124)
	{
		insert_text(event.key);
	}
	//insert_text(event.key);
	event.preventDefault();
	
}
//------------------------------------------- BUTTONS EXTRA
function buttons_extra()
{
	let d = NEW_ELM('div');
	d.classList.add('dropdown');
	d.setAttribute('id', 'font-size-dropdown');

	let s = NEW_ELM('input');
	s.setAttribute('type', 'range');
	s.setAttribute('min', '8');
	s.setAttribute('max', '30');
	s.setAttribute('value', '10');
	s.setAttribute('id', 'font-size-slider');
	s.setAttribute('onchange', 'set_font_size(this.value)');

	d.append(s);
	text_editor_div.append(d);
}

//------------------------------------------- GET SELECTION
function selection_in_text_div(range)
{
	let node = range.startContainer;
	if(node.parent == text_div){return true;}
	let i = 0;
	while(i < 20)
	{
		// track_log('nodename:'+node.nodeName+'. id:'+node.id);
		if(node == null)
		{
			
			return false;
		}
		if(node == text_div){return true;}
		if(node.nodeName == 'body'){return false;}
		node = node.parentNode;
		i++;
	}
	// track_log('OUTSIDE 2');
	return false;
}
//------------------------------------------- GET NODE INDEX
function get_node_index(node)
{
	return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}
//------------------------------------------- GET NODE INDEX
function get_node_offset(node, pos)
{
	let node_ni = get_node_ni(node);
	if(node_ni === false){return false;}
	return TNS[node_ni]+pos;
}
//------------------------------------------- GET NODE INDEX
function get_node_ni(node)
{
	let name = node.nodeName;
	if(name != 'SPAN'){return false;}
	let id = node.id;
	if(id === undefined){return false;}
	let id_sub = id.substring(2);
	let id_num = parseInt(id_sub);
	return id_num;
}
//------------------------------------------- GET SELECTION
function get_selection()
{	
	
	if (window.getSelection)
	{
		
		var selection = window.getSelection();
      	// var selected_text = selection.toString();
		let cursor_valid = true;

		if(selection.rangeCount <= 0)
		{
			cursor_valid = false;
			return false;
		}
		const range = selection.getRangeAt(0);
		if(selection_in_text_div(range) === false)
		{
			return false;
		}
		let start_offset = get_node_offset(range.startContainer.parentNode, range.startOffset);
		if(start_offset === false){return false;}
		
		let end_offset = get_node_offset(range.endContainer.parentNode, range.endOffset);
		if(end_offset === false){return false;}

		sel_s = start_offset;
		sel_e = end_offset;
		cursor = sel_s;
		if(selection.focusNode != range.startContainer || selection.focusOffset != range.startOffset)
		{
			cursor = sel_e;
		}		
		// track_log('S:'+sel_s+'. E:'+sel_e+'. C:'+cursor);
		return true;
		
	}
	
	return false;
}

//------------------------------------------- SET SELECTION
function set_selection(s, e, cursor_on_s = false)
{
	
	if(s > TEXT_LEN){s = TEXT_LEN;}
	if(s < 0){s = 0;}

	if(e > TEXT_LEN){e = TEXT_LEN;}
	if(e < 0){e = 0;}

	if(s > e)
	{
		let aux = s;
		s = e;
		e = aux;
	}
	
	text_div.focus();

	let start_ni = TEXT_FORMAT[s].node;
	let start_node = ELM('TE'+start_ni);
	let in_s = s - TNS[start_ni];

	let end_ni = TEXT_FORMAT[e].node;
	let end_node = ELM('TE'+end_ni);
	let in_e = e - TNS[end_ni];	
	
	var selection = window.getSelection();
	let range = document.createRange();
	range.setStart(start_node.childNodes[0], in_s);
	range.setEnd(end_node.childNodes[0], in_e);
	
	selection.removeAllRanges();
	selection.addRange(range);
	
	sel_s = s;
	sel_e = e;
	if(cursor_on_s == true)
	{
		cursor = sel_s;
	}else{
		cursor = sel_e;
	}
	
}

//------------------------------------------- GET TEXT BEFORE ELEMENT
function getTextBeforeElement(element) 
{
	const previousSibling = element.previousSibling;
	log()
	if (!previousSibling) {
	  return "";
	}
  
	if (previousSibling.nodeType === Node.TEXT_NODE) {
	  return previousSibling.textContent.trim();
	} else {
	  return getTextBeforeElement(previousSibling);
	}
}


//------------------------------------------- PARSE HTML
function make_format()
{
	let format = 0;
	if(PH_bold){format += 1;}
	if(PH_ita){format += 2;}
	if(PH_und){format += 4;}
	if(PH_overl){format += 8;}
	if(PH_cross){format += 16;}

	return format;
}
//------------------------------------------- PARSE HTML
function remove_br10(content)
{	
	let i = 0;
	let t = 0;
	let len = content.length;
	let res_content="";
	while(i < len)
	{
		let code = content.charCodeAt(i);
		if(code != 10)
		{
			res_content += content[i];
		}
		i++;
	}
	return res_content;

}
//------------------------------------------- PARSE HTML
function parse_html(elm, level)
{	
	const startTime = new Date();
	// track_log('FOLLOW 7');
	if(level == 0)
	{
		// log_auto_text();
		TEXT = '';
		PH_C = 0;
		TEXT_FORMAT = [];
		TEXT_LEN = 0;
	}
	// track_log('NODE NAME:'+elm.nodeName+'. SUBNODES N:'+elm.childNodes.length);
	var format = 0;
	//------
	let str = '';
	let log_str = '';
	//------
	let nodes = elm.childNodes;
	for (let i = 0; i < nodes.length; i++) 
	{
		let node = nodes[i];
		if(node.nodeType == Node.COMMENT_NODE){continue;}
	
		if(node.nodeType == Node.ELEMENT_NODE)
		{
			// -------------------- PREV
			let prev_bold = PH_bold;
			let prev_ita = PH_ita;
			let prev_und = PH_und;
			let prev_overl = PH_overl;
			let prev_cross = PH_cross;
			let prev_color = PH_color;
			let prev_size = PH_size;

			let has_format = 0;
			

			// -------------------- BOLD
			has_format = is_text_bold(node);
			if(has_format === true){PH_bold = true;}
			if(has_format === false){PH_bold = false;}
			// -------------------- ITALIC
			has_format = is_text_italic(node);
			if(has_format === true){PH_ita = true;}
			if(has_format === false){PH_ita = false;}
			// -------------------- UNDERLINE
			has_format = is_text_underlined(node);
			if(has_format === true){PH_und = true;}
			// -------------------- OVERLINE
			has_format = is_text_overlined(node);
			if(has_format === true){PH_overl = true;}
			// -------------------- STRIKETHROUGH / CROSSED
			has_format = is_text_crossed(node);
			if(has_format === true){PH_overl = true;}

			//MARKER: Maybe depending on the css of text_div
			//div won't be a line break
			//MARKER: consider also line breaks(10) that
			//are being counted as char in the string from file			
			// -------------------- BR
			if(node.nodeName == 'BR')
			{
				format = make_format();
				TEXT_FORMAT[PH_C] = new FORMAT(0, format, PH_color, PH_size);
				TEXT += "\n";
				PH_C++;
			}

			parse_html(node, level+1);

			PH_bold = prev_bold;
			PH_ita = prev_ita;
			PH_und = prev_und;
			PH_overl = prev_overl;
			PH_cross = prev_cross;
			PH_color = prev_color;
			PH_size = prev_size;
		}
		if(node.nodeType == Node.TEXT_NODE)
		{
			let c = 0;
			format = make_format();
			while(c < node.textContent.length)
			{
				TEXT_FORMAT[PH_C] = new FORMAT(0, format, PH_color, PH_size);
				TEXT += node.textContent[c];
				PH_C++;
				c++;
			}
			
		}
		
	}//nodes loop
	
	if(level == 0)
	{
		
		TEXT_LEN = PH_C;
		const endTime = new Date();
		const elapsedTime = endTime - startTime; // Time in milliseconds
	}
	// print_ch_nodes();
	return;
}

//----------------------------------------- MAKE FORMATTED HTML
function make_formatted_html(elm)
{
	let i = 0;
	let content = "";
	
	LINES = [];
	let LI = 0;
	let new_line = true;

	//offsets of each node, counted in chars
	TNS = [];
	let NI = 0;
	let opened_span = false;

	let cur_format = 0;
	for (i = 0; i < TEXT_LEN; i++)
	{
		// track_log('I:'+i+'. CH:'+TEXT[i].charCodeAt(0));
		
		if(new_line == true)
		{
			LINES[LI] = new LINE(i, i);
			new_line = false;
		}	
		
		if(opened_span && cur_format != TEXT_FORMAT[i].format)
		{
			content += '</span>';
			opened_span = false;
			NI++;
		}

		if(opened_span == false)
		{
			let style_str = make_style_format_str(TEXT_FORMAT[i].format);
			content += '<span id="TE'+NI+'" '+style_str+'>';
			TNS[NI] = i;
			opened_span = true;
			cur_format = TEXT_FORMAT[i].format;
		}	
		content += TEXT[i];
		TEXT_FORMAT[i].node = NI;

		if(TEXT[i] == "\n")
		{
			LINES[LI].e = i+1;
			LI++;
			new_line = true;
		}
	
	}//-------- END LOOP

	if(opened_span)
	{
		content += '</span>';
	}

	if(new_line == false)
	{
		LINES[LI].e = i;
	}

	// track_log('content length:'+content.length);
	i = 0;
	// while(i < LINES.length)
	// {
	// 	track_log('LINES['+i+'] s:'+LINES[i].s+'. e:'+LINES[i].e);
	// 	i++;
	// }
	// track_log('TEXT_LEN:'+TEXT_LEN);
	// save_to_file('content_after.txt', content);
	save_to_file('metadata.txt', all_text_metadata());

	elm.innerHTML = content;
}


//----------------------------------------- MAKE FORMATTED HTML
//creating elements instead of making them in the string
function make_formatted_html_dir(elm)
{
	text_div.innerHTML = "";
	let i = 0;
	let content = "";
	
	LINES = [];
	let LI = 0;
	let new_line = true;

	//offsets of each node, counted in chars
	TNS = [];
	let NI = 0;
	let opened_span = false;
	let new_elm;

	let cur_format = 0;
	for (i = 0; i < TEXT_LEN; i++)
	{
		// track_log('I:'+i+'. CH:'+TEXT[i].charCodeAt(0));
		
		if(new_line == true)
		{
			LINES[LI] = new LINE(i, i);
			new_line = false;
		}	
		
		if(opened_span && cur_format != TEXT_FORMAT[i].format)
		{

			new_elm.innerText = content;
			elm.appendChild(new_elm);
			content = "";
			opened_span = false;
			NI++;
		}

		if(opened_span == false)
		{
			// let style_str = make_style_format_str(TEXT_FORMAT[i].format);
			// content += '<span id="TE'+NI+'" '+style_str+'>';
			new_elm = document.createElement('span');
			set_span_style(new_elm, TEXT_FORMAT[i].format);
			TNS[NI] = i;
			opened_span = true;
			cur_format = TEXT_FORMAT[i].format;
		}	
		content += TEXT[i];
		TEXT_FORMAT[i].node = NI;

		if(TEXT[i] == "\n")
		{
			LINES[LI].e = i+1;
			LI++;
			new_line = true;
		}
	
	}//-------- END LOOP
	// track_log('MAKING FORMT 1');
	if(opened_span)
	{
		new_elm.innerText = content;
		elm.appendChild(new_elm);
	}

	if(new_line == false)
	{
		LINES[LI].e = i;
	}

	// track_log('content length:'+content.length);
	// i = 0;
	// while(i < LINES.length)
	// {
	// 	track_log('LINES['+i+'] s:'+LINES[i].s+'. e:'+LINES[i].e);
	// 	i++;
	// }
	// track_log('TEXT_LEN:'+TEXT_LEN);
	// save_to_file('content_after.txt', content);
	// save_to_file('metadata.txt', all_text_metadata());

	// elm.innerHTML = content;
}
//----------------------------------------- SET SPAN STYLE
function set_span_style(elm, format)
{
	let dec_str = "";
	let got_dec = false;
	if((format & group_0_val[0]) == group_0_val[0])
	{
		// log(format & 2);
		elm.style.fontWeight = 'bold';
	}
	if((format & group_0_val[1]) == group_0_val[1])
	{
		// log(format & 4);
		// style_str += 'font-style:italic;';
		elm.style.fontStyle = 'italic';
	}
	if((format & group_0_val[2]) == group_0_val[2])
	{
		// log(format & 8);
		dec_str += 'underline';
		got_dec = true;
	}
	if((format & group_0_val[3]) == group_0_val[3])
	{
		// log(format & 16);
		if(got_dec){dec_str += ' ';}
		dec_str += 'overline';
		got_dec = true;
	}
	if((format & group_0_val[4]) == group_0_val[4])
	{
		// log(format & 32);
		if(got_dec){dec_str += ' ';}
		dec_str += 'line-through';
		got_dec = true;
	}
	if(got_dec === true)
	{
		elm.style.textDecoration = dec_str;
	}
}
//----------------------------------------- IS TEXT BOLD
function make_style_format_str(format)
{
	let style_str = 'style="';

	let dec_str = '';
	let got_style = false;
	let got_dec = false;
	if((format & group_0_val[0]) == group_0_val[0])
	{
		// log(format & 2);
		style_str += 'font-weight:bold;';
		got_style = true;
	}
	if((format & group_0_val[1]) == group_0_val[1])
	{
		// log(format & 4);
		style_str += 'font-style:italic;';
		got_style = true;
	}
	if((format & group_0_val[2]) == group_0_val[2])
	{
		// log(format & 8);
		dec_str += 'underline';
		got_dec = true;
	}
	if((format & group_0_val[3]) == group_0_val[3])
	{
		// log(format & 16);
		if(got_dec){dec_str += ' ';}
		dec_str += 'overline';
		got_dec = true;
	}
	if((format & group_0_val[4]) == group_0_val[4])
	{
		// log(format & 32);
		if(got_dec){dec_str += ' ';}
		dec_str += 'line-through';
		got_dec = true;
	}
	if(got_dec === true)
	{
		style_str += 'text-decoration:'+dec_str+';';
		got_style = true;
	}
	if(got_style === true)
	{
		style_str += '"';
		return style_str;
	}
	return '';
}
//----------------------------------------- IS TEXT BOLD
function is_text_bold(elm)
{
	if(elm.nodeName == 'b' || elm.nodeName == 'strong')
	{
		return true;
	}
	
	let bold = window.getComputedStyle(elm).fontWeight;
	if(bold === 'bold' || bold === 'bolder'){return true;}
	if(bold === 'normal' || bold === 'lighter'){return false;}
	let bold_int = parseInt(bold);
	if(isNaN(bold_int)){return 0;}
	if(bold_int >= 550)
	{
		return true;
	}else{
		return false;
	}
	return 0;
}
//--------------------------------------- IS TEXT ITALIC
function is_text_italic(elm)
{
	if(elm.nodeName == 'i')
	{
		return true;
	}
	let italic = window.getComputedStyle(elm).fontStyle;
	if(italic === 'italic'){return true;}
	if(italic === 'normal'){return false;}
	return 0;

}
//--------------------------------------- IS TEXT UNDERLINED
function is_text_underlined(elm)
{
	if(elm.nodeName == 'u')
	{
		return true;
	}
	
	let und = window.getComputedStyle(elm).textDecoration;
	if(und.includes('underline')){return true;}
	return 0;
}
//--------------------------------------- IS TEXT OVERLINED
function is_text_overlined(elm)
{
	let und = window.getComputedStyle(elm).textDecoration;
	if(und.includes('overline')){return true;}
	return 0;
}
//--------------------------------------- IS TEXT OVERLINED
function is_text_crossed(elm)
{
	if(elm.nodeName == 's')
	{
		return true;
	}
	let cross = window.getComputedStyle(elm).textDecoration;
	if(cross.includes('line-through')){return true;}
	return 0;
}
//-------------------------------------------- HAS FORMAT
function TF_has_format(group, value, f)
{
	if(group == 0)
	{
		let bit_val = group_0_val[value];
		if((f.format & bit_val) == bit_val){return true;}
		return false;
	}
	if(group == 1)
	{
		if(f.color == value){return true;}
		return false;
	}
	if(group == 2)
	{
		if(f.size == value){return true;}
		return false;
	}
	return false;
}
//-------------------------------------------- HAS FORMAT
function TF_apply_format(group, value, f)
{
	
	if(group == 0)
	{
		let bit_val = group_0_val[value];
		if((f.format & bit_val) == 0)
		{
			f.format += bit_val;
		}
		return f;
	}
	if(group == 1)
	{
		f.color = value;
		return f;
	}
	if(group == 2)
	{
		f.size = value;
		return f;
	}
}
//-------------------------------------------- HAS FORMAT
function TF_remove_format(group, value, f)
{

	if(group == 0)
	{
		let bit_val = group_0_val[value];
		if((f.format & bit_val) == bit_val)
		{
			f.format -= bit_val;
		}
		return f;
	}
	// if(group == 1)
	// {
	// 	f.color = DEF_COLOR;
	// 	return f;
	// }
	// if(group == 2)
	// {
	// 	f.size = DEF_FS;
	// 	return f;
	// }
}

//-------------------------------------------- PRINT TN
function print_TEXT()
{
	let i = 0;
	while(i < TEXT_LEN)
	{
		// log('<br>FORMAT:'+TEXT[i].format+'. COLOR:'+TEXT[i].color+'. SIZE:'+TEXT[i].size);
		i++;
	}	
}
//------------------------------------------- ESCAPE HTML
function escape_HTML(str) 
{
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}
//------------------------------------------- PARSE TAGS
function parse_text() 
{
	text_div.innerHTML
	var c = 0;	
}

//------------------------------------------- SAVE TO FILE
function save_to_file(filename, content) 
{
	// Get the form element and div element
			
	// Create an AJAX request
	var xhr = new XMLHttpRequest();
	xhr.open('POST', './save_to_file.php', true);
	form_data = new FormData;
	form_data.append('filename', filename);
	form_data.append('content', content);

	// Define the AJAX response callback
	xhr.onload = function() {
		if (xhr.status === 200) 
		{
		//sleep(2);
		// Update the div element with the response text                
			ELM('res-div').innerHTML += '<br>RESPONSE: '+xhr.responseText;
			
		}else{
			//MARKER: load something in case of failure
			ELM('res-div').innerHTML += '<br>REQUEST FAILED';			
			
		}
	};

	// Send the AJAX request with the form data
	xhr.send(form_data);    
}

//------------------------------------------- READ FROM FILE
function read_from_file(filename) 
{
	// Get the form element and div element
			
	// Create an AJAX request
	var xhr = new XMLHttpRequest();
	xhr.open('POST', './read_from_file.php', true);
	form_data = new FormData;
	form_data.append('filename', filename);

	// Define the AJAX response callback
	xhr.onload = function() {
		if (xhr.status === 200) 
		{
		//sleep(2);
		// Update the div element with the response text       
			let orig_content = xhr.responseText;
			// orig_content = remove_br10(orig_content);
			
			text_div.innerHTML = orig_content;
			log_before_text(text_div.innerHTML);
			save_to_file('content_orig.txt', orig_content);
			
			parse_html(text_div, 0);
			const startTime = new Date();
			make_formatted_html(text_div);
			const endTime = new Date();
			const elapsedTime = endTime - startTime; 
			track_log('TIME TO LOAD:'+elapsedTime);
			
		}
	};

	// Send the AJAX request with the form data
	xhr.send(form_data);    
}
//------------------------------------------- READ FROM FILE
function load_html_from_file(filename) 
{
	// Get the form element and div element
			
	// Create an AJAX request
	var xhr = new XMLHttpRequest();
	xhr.open('POST', './read_from_file.php', true);
	form_data = new FormData;
	form_data.append('filename', filename);

	// Define the AJAX response callback
	xhr.onload = function() {
		if (xhr.status === 200) 
		{
		//sleep(2);
		// Update the div element with the response text                
			text_div.innerHTML = xhr.responseText;
			parse_html(text_div, 0);
			make_formatted_html(text_div);	
			
			save_to_file('metadata.txt', all_text_metadata());
			save_to_file('content_after.txt', text_div.innerHTML);
		}
	};

	// Send the AJAX request with the form data
	xhr.send(form_data);    
}

//------------------------------------------- SET CARET POS
function set_caret_pos(pos) 
{
  var range = document.createRange();
  var sel = window.getSelection();
  
  range.setStart(text_div.childNodes[2], 5);
  range.collapse(true);
  
  sel.removeAllRanges();
  sel.addRange(range);
}

//------------------------------------------- SET CARET POS
function add_c_lnbr_to_html_str(code) 
{
	let i = 0;
	let res = '';
	let got_lnbr = false;
	while(i < code.length)
	{
		if(got_lnbr === false)
		{
			if(i > 0 && code[i] == '<')
			{
				res += "\n";

			}
		}else{
			got_lnbr = false;
		}
		res += code[i];
		if(i < code.length-1 && code[i] == '>')
		{
			res += "\n";
			got_lnbr = true;
		}
		i++;
	}
	return res;
}


//------------------------------------------- UPDATE TEXT LOGS
function update_text_logs() 
{
	log_before_text();
	log_after_text();
}
//------------------------------------------- SET CARET POS
function log_counters() 
{
	clear_log();
	// log('AUTO_LOG_C:'+AUTO_LOG_C+' ::: EDIT_LOG_C:'+EDIT_LOG_C+' ::: INPUT_C:'+INPUT_C+' ::: SEL_C:'+SEL_C);
}