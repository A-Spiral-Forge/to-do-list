// Import part

// Import ends

// Adding a task

const addtask = document.getElementById('add');
const newtask = document.getElementById('newtask');
let tasks=[];
let num=0;
let totaltaskcount = 0;
let taskdonecount = 0;
let totaltask = document.getElementById('totaltask');
let taskdone = document.getElementById('taskdone');

addtask.addEventListener('click', function() {
    let taskname = document.getElementById('newtask').value;
    if(taskname == "")
    {
        alert(`Empty task now allowed. Please specify some task.`);
    }
    else
    {
        document.getElementById('tasklist').innerHTML += `<li class="task" id="l${num}"><input type="checkbox" name="completed" class="check" id="c${num}"> <span class="taskname" id="t${num}">${taskname}</span><button class="delete" id="d${num}" onclick="removeTask(this)"><i class="fa fa-minus-circle"></i></button></li>`
        tasks.push(taskname);
        num++;
        totaltaskcount++;
        totaltask.innerHTML = totaltaskcount;
    }
    document.getElementById('newtask').value = "";
    document.getElementById('newtask').focus();
});

newtask.addEventListener('keydown',function(event) {
    if(event.keyCode === 13)
    {
        document.getElementById('add').click();
    }
});

// Strikethrough completed tasks

$(document).on('click', '[type=checkbox]', function() {
    $(this).each(function(){
        let checkid = $(this).attr("id");
        let spanid = $(this).next('span').attr("id");
        const spanele = document.getElementById(spanid);
        if(document.getElementById(checkid).checked)
        {
            
            spanele.style.textDecoration = 'line-through';
            spanele.style.textDecorationColor = 'red';
            taskdonecount++;
        }
        else
        {
            spanele.style.textDecoration = 'none';
            taskdonecount-=1;
        }
        taskdone.innerHTML = taskdonecount;
    });
});

// Delete task when delete button clicked
function removeTask(e)
{
    let c = e.parentElement.childNodes;
    if(c[0].checked == true)
    {
        taskdonecount-=1;
    }
    totaltaskcount-=1;
    taskdone.innerHTML = taskdonecount;
    totaltask.innerHTML = totaltaskcount;
    e.parentElement.remove();
};

// About division update

$(document).ready( function() {
    $("#about").on("click", function() {
        $("#abtdetails").load("../html/aboutme.html");
    });
});

$(document).ready( function() {
    $("#version").on("click", function() {
        $("#abtdetails").load("../html/abtversion.html");
    });
});

$(document).ready( function() { 
    $("#opened").on("click", function() {
        $("#abtdetails").load("../html/reserve.html");
        // taskdone.innerHTML = taskdonecount;
        // totaltask.innerHTML = totaltaskcount;
    });
});

$(document).ready( function() { 
    $("#copyright").on("click", function() {
        $("#abtdetails").load("../html/copyright.html");
    });
});

$(document).ready( function() { 
    $("#feedback").on("click", function() {
        window.open('https://forms.gle/VM9xPW3bL8aQhHV6A','_blank');
    });
});

// Menu button for small screen
document.getElementById('menu').addEventListener('click',function() {
    const navbar = document.getElementById('navbar');
    if(navbar.style.display == 'none')
    {
        navbar.style.display = 'flex';
    }
    else
    {
        navbar.style.display = 'none';
    }
});