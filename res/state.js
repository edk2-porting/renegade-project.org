let num=0;
let messages=[];
function add_device(device){
	const cont=document.getElementById("content");
	const add_col=function(_tr,_content,_class){
		const td=document.createElement("td");
		if(_class)td.setAttribute("class",_class);
		td.innerText=_content;
		_tr.appendChild(td);
		return td;
	};
	const add_state=function(_tr,_state,_default,_message){
		const state=_state?_state:_default;
		const c=add_col(
			tr,
			state.toUpperCase(),
			"state-"+state.toLowerCase()
		);
		if(_message){
			let msg=null;
			let id=-1;
			let str=_message[locale.lang];
			for(let i=0;i<messages.length;i++){
				if(str!==messages[i].str)continue;
				msg=messages[i];
				id=msg.id;
			}
			if(id<0)id=++num;
			let x=document.createElement("sup");
			x.innerText=id.toString();
			c.number=id;
			c.appendChild(x);
			c.style.cursor="pointer";
			c.onclick=function(){
				const note=document.getElementById("note-"+this.number);
				const notes=note.style;
				if(parent)parent.scrollTo(0,note.offsetTop);
				else scrollTo(0,note.offsetTop);
				notes.backgroundColor="gray";
				setTimeout(function(){notes.backgroundColor=null},250);
                        };
			if(!msg){
				let m=document.createElement("li");
				m.id="note-"+id;
				m.innerText=id+": "+str;
				document.getElementById("messages").appendChild(m);
				document.getElementById("message").style.display=null;
				messages.push({id:id,str:str});
			}
		}
	};
	const tr=document.createElement("tr");
	let state=device.state,message=device.message;
	if(!state)state={};
	if(!message)message={};
	add_col(tr,device.name[locale.lang],null);
	add_col(tr,device.codename,null);
	cont.appendChild(tr);
	add_state(tr,state.uefi          ,"y",message.uefi);
	add_state(tr,state.windowspe     ,"y",message.windowspe);
	add_state(tr,state.fullsystem    ,"u",message.fullsystem);
	add_state(tr,state.usb           ,"y",message.usb);
	add_state(tr,state.ufs           ,"y",message.ufs);
	add_state(tr,state.display       ,"y",message.display);
	add_state(tr,state.buttons       ,"y",message.buttons);
	add_state(tr,state.touchscreen   ,"u",message.touchscreen);
	add_state(tr,state.wifi          ,"w",message.wifi);
	add_state(tr,state.bluetooth     ,"u",message.bluetooth);
	add_state(tr,state.battery       ,"w",message.battery);
	add_state(tr,state.charging      ,"w",message.charging);
	add_state(tr,state.virtualization,"n",message.virtualization);
	add_state(tr,state.gpu           ,"w",message.gpu);
	add_state(tr,state.lte           ,"w",message.lte);
	add_state(tr,state.audio         ,"t",message.audio);
	add_state(tr,state.call          ,"t",message.call);
	add_state(tr,state.sms           ,"t",message.sms);
	add_state(tr,state.gps           ,"t",message.gps);
	add_state(tr,state.sensor        ,"t",message.sensor);
	add_state(tr,state.camera        ,"t",message.camera);
}
function update_size(){
	if(!parent)return;
	const i=parent.document.getElementById("iframe");
	if(!i)return;
	i.height=document.body.scrollHeight;
}
function initialize(){
	const cont=document.getElementById("content");
	cont.innerText=locale.loading;
	try{
		let x;
		if(window.XMLHttpRequest)x=new XMLHttpRequest();
		else x=new ActiveXObject("Microsoft.XMLHTTP");
		x.open("GET","/devices.json",true);
		x.onreadystatechange=function(){
			try{
				if(x.readyState!==4)return;
				if(x.status!==200)throw new Error(locale.not_200+x.status);
				const j=JSON.parse(x.response);
				cont.innerHTML="";
				for(let i=0;i<j.length;i++)add_device(j[i]);
				update_size();
			}catch(e){
				cont.innerText=locale.load_failed+e;
				console.error(e);
			}
		}
		x.send();
	}catch(e){
		cont.innerText=locale.load_failed+e;
		console.error(e);
	}
}
