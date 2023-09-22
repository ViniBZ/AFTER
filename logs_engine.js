
//------------------------------------------- LOG
function track_log(text)
{
	ELM("track-log-div").innerHTML += '<br>'+text;
}
//------------------------------------------- LOG
function log(text)
{
	// ELM("log-div").innerHTML += '<br>'+text;
}
//------------------------------------------- CLEAN LOG
function clear_log()
{
	// ELM("log-div").innerHTML = '';
}
// ---------------------------------------- PRINT ELEMENTS IN TEXT
function print_e()
{
	let i = 0;
	while(i < N)
	{
		log('<br>E['+i+']:'+E[i]);
		i++;
	}
}

// ---------------------------------------- OBJ TO STRING
function obj_to_str(o)
{
    var out = '';
    for (var p in o)
    {
        out += '<br>'+ p + ': ' + o[p] + '\n';
    }
    return out;
}

//------------------------------------------- NODE TREE
function node_tree(elm, level)
{

	let log_str = '';
	let nodes = elm.childNodes;
	for (let i = 0; i < nodes.length; i++) 
	{

		let node = nodes[i];
		if(i != 0)
		{
			log_str += '<br>';
		}
		let l = 0;
		while(l < level)
		{
			log_str += ' - ';
			l++;
		}
		if(node.nodeType == Node.ELEMENT_NODE)
		{
			log_str += '['+level+']Child '+(i + 1)+' : '+node.nodeName;
			if(node.hasAttribute('id'))
			{
				log_str += ' : ID: '+node.id;
			}
			log_str += ' :: NODE TYPE: ELM';
			log_str += ' :: SUBNODE N: '+node.childNodes.length;
			log_str += ' :: CONTENT: '+node.textContent;
			log_str += ' :: TEXT_LEN: '+node.textContent.length;
			
			if(node.childNodes.length > 0)
			{
				log_str += node_tree(node, level+1);
			}
		}
		if(node.nodeType == Node.TEXT_NODE || node.nodeType == Node.COMMENT_NODE)
		{
			log_str += '['+level+']Child '+(i + 1)+' : ';
			if(node.nodeType == Node.TEXT_NODE)
			{
				log_str += ' :: NODE TYPE: TEXT';
			}else{
				log_str += ' :: NODE TYPE: COMM';
			}
			log_str += ' :: CONTENT: '+node.textContent.trim();
		}
	}
	if(level != 0)
	{
		log_str = '<br>'+log_str;
	}
	// log('WORKED 55:'+nodes.length);
	return log_str;
}
//------------------------------------------- DOM TREE
function dom_tree(elm, level)
{
	let log_str = '';
	const children = elm.children;
	for (let i = 0; i < children.length; i++) 
	{
		const child = children[i];
		if(i != 0)
		{
			log_str += '<br>';
		}
		let l = 0;
		while(l < level)
		{
			log_str += ' - ';
			l++;
		}
		log_str += '['+level+']Child '+(i + 1)+':'+child.nodeName;
		if(child.hasAttribute('id'))
		{
			log_str += ' : ID: '+child.id;
		}
		let node_type = 'TEXT';
		if(child.nodeType == Node.COMMENT_NODE)
		{
			node_type = 'COMMENT';
		}
		if(child.nodeType == Node.ELEMENT_NODE)
		{
			node_type = 'ELEMENT';
		}
		log_str += ' : NODE TYPE: '+node_type;
		
		if(child.children.length > 0)
		{
			log_str += dom_tree(child, level+1);
		}
	}
	if(level != 0)
	{
		log_str = '<br>'+log_str;
	}
	return log_str;
}
//------------------------------------------- ARR TO STR
function arr_to_str(arr) 
{

	let content = '';
	for(let i = 0; i < arr.length; i++)
	{
		const element = arr[i];
		if(Array.isArray(arr[i])) 
		{
			// content += 'ITS ARRAY';
			content += '<br>['+i+']:'
			for (let j = 0; j < element.length; j++) 
			{
				if(j > 0)
				{
					content += '. ';
				}
				content += '['+j+']:'+element[j];
			}
		}else{
			content += '<br>['+i+']:'+element;
		}
	  }
	  return content;
}
//------------------------------------------- SET SELECTION
function print_ch_nodes()
{
	let i = 0;
	while(i < TEXT_LEN)
	{
		log('N[0]:'+TEXT_FORMAT[i].node[0]+'. N[1]:'+TEXT_FORMAT[i].node[1]);
		i++;
	}
}
//------------------------------------------- SET SELECTION
function all_text_metadata()
{
	let content = '';
	let text_len = TEXT_FORMAT.length;
	content += 'TEXT_FORMAT[] length:'+text_len+'. TEXT_LEN:'+TEXT_LEN+"\n";
	let i = 0;
	while(i < text_len)
	{
		content += "\n";
		content += "\n"+'['+i+']TEXT                :'+TEXT[i];
		content += "\n"+'['+i+']TEXT_FORMAT type    :'+TEXT_FORMAT[i].type;
		content += "\n                 "+'. format  :'+TEXT_FORMAT[i].format;
		content += "\n                 "+'. color   :'+TEXT_FORMAT[i].color;
		content += "\n                 "+'. size    :'+TEXT_FORMAT[i].size;
		content += "\n                 "+'. ref_type:'+TEXT_FORMAT[i].ref_type;
		content += "\n                 "+'. ref_node:'+TEXT_FORMAT[i].ref_node;
		i++;
	}
	content += "\n";
	
	i = 0;
	let tn_len = TNS.length;
	
	while(i < tn_len)
	{
		content += "\n"+'['+i+']TNS:'+TNS[i]; 
		i++;
	}
	content += "\n";
	i = 0;
	let lines_len = LINES.length;
	while(i < lines_len)
	{
		content += "\n"+'['+i+']LINE start:'+LINES[i].s+'. end:'+LINES[i].e;
		i++;
	}
	return content;
}
//------------------------------------------- SAVE TO FILE
function format_data_to_str() 
{
	let str = '';
	str += '\nTEXT_LEN:'+TEXT_LEN;
	str += '\nTEXT.length:'+TEXT.length;
	let i = 0;
	while(i < TEXT_LEN)
	{
		str += "\n"+'['+i+']: TEXT:'+TEXT[i];
		str += '. TYPE:'+TEXT_FORMAT[i].type;
		str += '. FORMAT:'+TEXT_FORMAT[i].format;
		str += '. COLOR:'+TEXT_FORMAT[i].color;
		str += '. SIZE:'+TEXT_FORMAT[i].size;
		
		i++;
	}
	return str;
}
//------------------------------------------- SET CARET POS
function log_before_text(text) 
{
	
	AUTO_LOG_C++;
	log_counters();
	// text = escape_HTML(text);
	text = add_c_lnbr_to_html_str(text);
	// ELM('before-text-log-div').innerText = text;
}

//------------------------------------------- SET CARET POS
function log_after_text(text) 
{
	
	EDIT_LOG_C++;
	log_counters();
	// text = escape_HTML(text);
	text = add_c_lnbr_to_html_str(text);
	// ELM('after-text-log-div').innerText = text;
}
//------------------------------------------- SET CARET POS
function test_node_system() 
{
	
	// save_to_file('content_after.txt', text_div.innerHTML);
	track_log('TEST NODE SYSTEM:::');
	if (window.getSelection)
	{
		
		var selection = window.getSelection();
		const range = selection.getRangeAt(0);
		let start_node = range.startContainer;
		track_log('START OFFSET:'+range.startOffset);
		track_log('START NODE:'+start_node.nodeName);
		track_log('START ID:'+start_node.id);
		track_log('START PAR NODE:'+start_node.parentNode.nodeName);
		track_log('START PAR ID:'+start_node.parentNode.id);
		track_log('PAR CONTENT:'+start_node.parentNode.textContent);
		track_log('PAR CONTENT LEN:'+start_node.parentNode.textContent.length);
		track_log('TEXT_LEN:'+TEXT_LEN);
		track_log('<br><br>');
		// track_log(node_tree(text_div,0));
		return;
		let i = 0;
		let elm_id = 0;
		if(start_node.nodeType == Node.TEXT_NODE)
		{
			const ind = Array.prototype.indexOf.call(start_node.parentNode.childNodes, start_node);
			track_log('IND:'+ind);
			if(ind == 0)
			{
				if(start_node.parentNode == text_div)
				{
					track_log('PAR ID:'+start_node.parentNode.id);
					track_log('ABS OFFSET:'+range.startOffset);
				}else{
					elm_id = start_node.parentNode.id.substring(4);
					elm_id = parseInt(elm_id);
					track_log('PAR ID:'+elm_id);
					track_log('ABS OFFSET:'+(parseInt(TNS[elm_id]) + parseInt(range.startOffset)));
				}
				
			}else{
				elm_id = start_node.parentNode.childNodes[ind-1].id;
				track_log('BEF ID:'+elm_id);
				elm_id = elm_id.substring(4);
				elm_id = parseInt(elm_id);
				let bef_cont_n = start_node.parentNode.childNodes[ind-1].textContent.length;
				bef_cont_n = parseInt(par_cont_n);
				track_log('BEF CONT N:'+bef_cont_n);
				track_log('BEF ID:'+elm_id);
				track_log('ABS OFFSET:'+(parseInt(TNE[elm_id])+ par_cont_n + parseInt(range.startOffset)));
			}

		}else{
			const ind = Array.prototype.indexOf.call(start_node.parentNode.childNodes, start_node);
			track_log('IND:'+ind);
			elm_id = start_node.id.substring(4);
			elm_id = parseInt(elm_id);
			track_log('OWN ID:'+elm_id);
			track_log('ABS OFFSET:'+(parseInt(TNS[elm_id]) + parseInt(range.startOffset)));
		}
		
	}

	track_log("<br><br>-------------------------------<br><br>");
	track_log(node_tree(text_div, 0));

}