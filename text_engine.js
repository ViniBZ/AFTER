//------------------------------------------- TEXT DIV KEYDOWN
function insert_text(text)
{
	
	let n = 0;
	if(sel_s != sel_e)
	{
		n = sel_e - sel_s;
	}
	track_log('INS:'+text+'. inslen:'+text.length+'. TEXT_LEN:'+TEXT_LEN+'. TEXT.length:'+TEXT.length+'. n:'+n);
	let before_str = TEXT.substring(0, sel_s);
	let after_str = TEXT.substring(sel_s + n);
	TEXT = before_str + text + after_str;
	let ins_len = text.length;
	TEXT_LEN += text.length - n;
	// track_log('N:'+n+'. SELS:'+sel_s+'. TEXT LEN:'+TEXT_LEN+'. TEXT_FORMAT LEN:'+TEXT_FORMAT.length+'. inslen:'+ins_len);
	
	let ins_arr = [];
	let c = 0;
	while(c < ins_len)
	{
		let F = new FORMAT(active_f.type, active_f.format, DEF_COLOR, DEF_FS);
		ins_arr[c] = F;
		c++;
	}
	TEXT_FORMAT.splice(sel_s, n, ...ins_arr);

	
	// track_log('N:'+n+'. SELS:'+sel_s+'. TEXT LEN:'+TEXT_LEN+'. TEXT_FORMAT LEN:'+TEXT_FORMAT.length+'. inslen:'+ins_len);
	save_to_file('metadata.txt', all_text_metadata());
	// return;
	make_formatted_html(text_div);
	set_selection(sel_s+1, sel_s+1);	
}
//------------------------------------------- TEXT DIV KEYDOWN
function remove_text(i, n)
{
    // track_log('SPLICE I:'+i+'. N:'+n);
    TEXT_FORMAT.splice(i, n);
	let before_str = TEXT.substring(0, i);
	let after_str = TEXT.substring(i + n);
	TEXT = before_str + after_str;
	// track_log('before:'+before_str+'. after:'+after_str);
    TEXT_LEN -= n;
}
//------------------------------------------- TEXT DIV KEYDOWN
function insert_br(i, n)
{
	let f = new FORMAT(0, 0, PH_color, PH_size);
	TEXT_FORMAT.splice(i, n, f);
	let before_str = TEXT.substring(0, i);
	let after_str = TEXT.substring(i+n);
	TEXT = before_str + "\n" + after_str;
	TEXT_LEN += (1 - n);
}


//------------------------------------------- TEXT DIV KEYDOWN
function enter_pressed(event)
{
	let n = 0;
	if(sel_s != sel_e){n = sel_e - sel_s;}

	insert_br(sel_s, n);
	make_formatted_html(text_div);
	set_selection(sel_s+1, sel_s+1);
	// log('ENTER INSERTED');
	return false;
}
//------------------------------------------- TEXT DIV KEYDOWN
function backspace_pressed(event)
{
    // track_log('HERE 555');
    let n = 1;
	// track_log('00 SEL_S:'+sel_s+'. SEL_E:'+sel_e);
	if(sel_s != sel_e)
	{
		n = sel_e - sel_s;
		remove_text(sel_s, n);
		make_formatted_html(text_div);
		set_selection(sel_s, sel_s);
	}else{
		if(cursor == 0){return;}
		remove_text(cursor-1, 1);
		make_formatted_html(text_div);
		set_selection(cursor-1, cursor-1);
	}
	// track_log('01 SEL_S:'+sel_s+'. SEL_E:'+sel_e);
}

//------------------------------------------- TEXT DIV KEYDOWN
function delete_pressed(event)
{
	// track_log('HERE 555');
	// track_log('HERE 555');
	// track_log('10 SEL_S:'+sel_s+'. SEL_E:'+sel_e);
	let n = 1;
	if(sel_s != sel_e)
	{
		n = sel_e - sel_s;
		remove_text(sel_s, n);
		make_formatted_html(text_div);
		set_selection(sel_s, sel_s);
	}else{
		if(cursor >= TEXT_LEN){return;}
		remove_text(cursor, 1);
		make_formatted_html(text_div);
		set_selection(cursor, cursor);
	}
	// track_log('11 SEL_S:'+sel_s+'. SEL_E:'+sel_e);
}