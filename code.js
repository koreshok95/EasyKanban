let arr_new=[];
let arr_todo=[];
let arr_done=[];
const today = Date.now();
function init_on_load_done(){
	x=document.getElementsByName("new_task");
	let red_task=0;
	let blue_task=0;
	let gren_task=0;
	let ts1=x.length;
	//const today = Date.now();
	for (let i=0;i<x.length;i++){
		arr_new.push(x[i].id);
		let i_date=new Date(x[i].querySelector('.newdate').value).getTime();
		if (i_date && i_date<=today)
		{
			red_task++
			x[i].style.borderColor='red';
		}
		else{
			blue_task++
			x[i].style.borderColor='blue';
		}
	}
	x=document.getElementsByName("todo_task");
	let ts2=x.length;
	for (let i=0;i<x.length;i++){
		arr_todo.push(x[i].id);
		let  i_date= new Date(x[i].querySelector('.newdate').value).getTime();
		if (i_date && i_date<=today)
		{
			red_task++
			x[i].style.borderColor='red';
		}
		else{
			blue_task++
			x[i].style.borderColor='blue';
		}
	}
	x=document.getElementsByName("done_task");
	let ts3=x.length;
	for (let i=0;i<x.length;i++){
		arr_done.push(x[i].id);
		gren_task++
		x[i].style.borderColor='green';
	}
	let y=document.getElementsByName("stat")[0];
    y.innerText=   `Статистика: Срочные: ${red_task} | Ожидают выполнения: ${blue_task} | Выполнены: ${gren_task}`;
	y=document.getElementById("1");
    y.innerText=   `Задачи: ${ts1}`;
	y=document.getElementById("2");
    y.innerText=   `В работе: ${ts2}`;
	y=document.getElementById("3");
    y.innerText=   `Выполнено: ${ts3}`;
	//alert(arr_new[0].id);
	//const uuid = crypto.randomUUID();
	//console.log(uuid);
}
function create_task(){
	tfrm=document.getElementsByName("create_task");
	txt=tfrm[0].querySelector('.tasktxt').value;
	deadline=tfrm[0].querySelector('.newdate').value;
	par_e=document.getElementsByName("new_task_clm")[0];
	if (txt!="")
	{
		new_id=crypto.randomUUID();
		par_e.innerHTML+=`<div name="new_task" id="${new_id}" style="padding: 5px;border: 3px solid #ccc;">
					<p><textarea class="tasktxt" readonly style="resize: none;width: 100%; box-sizing: border-box;" rows="4" >${txt}</textarea> </p>
					<p>
						<input value="${deadline}" readonly class="newdate" type="date"></input>
						<button onclick="take_task(this)" class="btn1">Взять задачу</button>
						<button onclick="delete_task(this)" class="btn2" >Удалить</button>
					</p>
				</div>`;
		arr_new.push(new_id);
	}
	saveToFile();
	init_on_load_done()
}
function take_task(btn)
{
	task_div_e=btn.parentElement.parentElement;
	txt=task_div_e.querySelector('.tasktxt').value;
	deadline=task_div_e.querySelector('.newdate').value;
	par_e=document.getElementsByName("todo_task_clm")[0];
	par_e.innerHTML+=`<div name="todo_task" id="${task_div_e.id}" style="padding: 5px;border: 3px solid #ccc;">
					<p><textarea class="tasktxt" readonly style="resize: none;width: 100%; box-sizing: border-box;" rows="4" >${txt}</textarea> </p>
					<p>
						<input value="${deadline}" readonly class="newdate" type="date"></input>
						<button onclick="refuse_task(this)" class="btn1">Вернуть задачу</button>
						<button onclick="complite_task(this)" class="btn2" >Выполнить</button>						
					</p>
				</div>`;
	arr_todo.push(task_div_e.id);
	arr_new=arr_new.filter(item=>item!=task_div_e.id)
	task_div_e.remove();
	saveToFile();
	init_on_load_done()
}
function delete_task(btn)
{
	task_div_e=btn.parentElement.parentElement;
	if (task_div_e) {
		if (arr_new.includes(task_div_e.id))
		{
			arr_new=arr_new.filter(item=>item!=task_div_e.id);
		}
		else if (arr_new.includes(task_div_e.id))
		{
			arr_done=arr_done.filter(item=>item!=task_div_e.id);
		}
		task_div_e.remove();
	}
	saveToFile();
	init_on_load_done()
}
function refuse_task(btn)
{
	task_div_e=btn.parentElement.parentElement;
	txt=task_div_e.querySelector('.tasktxt').value;
	deadline=task_div_e.querySelector('.newdate').value;
	par_e=document.getElementsByName("new_task_clm")[0];
	par_e.innerHTML+=`<div name="new_task" id="${task_div_e.id}" style="padding: 5px;border: 3px solid #ccc;">
					<p><textarea class="tasktxt" readonly style="resize: none;width: 100%; box-sizing: border-box;" rows="4" >${txt}</textarea> </p>
					<p>
						<input value="${deadline}" readonly class="newdate" type="date"></input>
						<button onclick="take_task(this)" class="btn1">Взять задачу</button>
						<button onclick="delete_task(this)" class="btn2" >Удалить</button>						
					</p>
				</div>`;
	arr_new.push(task_div_e.id);
	arr_todo=arr_new.filter(item=>item!=task_div_e.id)
	task_div_e.remove();
	saveToFile();
	init_on_load_done()
}
function complite_task(btn)
{
	task_div_e=btn.parentElement.parentElement;
	txt=task_div_e.querySelector('.tasktxt').value;
	deadline=task_div_e.querySelector('.newdate').value;
	par_e=document.getElementsByName("done_task_clm")[0];
	par_e.innerHTML+=`<div name="done_task" id="${task_div_e.id}" style="padding: 5px;border: 3px solid green;">
					<p><textarea class="tasktxt" readonly style="resize: none;width: 100%; box-sizing: border-box;" rows="4" >${txt}</textarea> </p>
					<p>
						<input value="${deadline}" readonly class="newdate" type="date"></input>
						<button onclick="refuse_task(this)" class="btn1" >Вернуть задачу</button>
						<button onclick="delete_task(this)" class="btn2" >Удалить</button>		
						<input value="${today}" readonly class="cmpdate" type="hidden"></input>
					</p>
				</div>`;
	arr_new.push(task_div_e.id);
	arr_todo=arr_new.filter(item=>item!=task_div_e.id)
	task_div_e.remove();
	saveToFile();
	init_on_load_done()
}
init_on_load_done();





