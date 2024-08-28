let add = document.querySelector(".add");
let addSalary = document.querySelector(".add-salary");
let data ;
let amounts;
let resetAmounts = {expenses : 0,
                    salary : 0,
                    totalBalance : 0,
                    debitExpenses : 0,
                    creditExpenses : 0,
                    transactions : 0,
                    deletedBalance : 0,
                    financialHealth : 0,
                    };

addSalary.addEventListener("click", () =>{
    data = JSON.parse(localStorage.getItem("localData")) || [];
    amounts = JSON.parse(localStorage.getItem("localAmounts")) || resetAmounts;
    amounts.salary = Number(document.querySelector(".total-salary").value);
    if (amounts.salary<0) amounts.salary = -amounts.salary
    document.querySelector(".total-salary").value = "";
    addSalary.innerText = "Change Salary"
    document.querySelector(".total-salary").setAttribute("placeholder", "Enter salary")

    display();
    localStorage.setItem("localData", JSON.stringify(data));
    localStorage.setItem("localAmounts", JSON.stringify(amounts));
})

// if(amounts.salary === 0){add.disabled = true
// }else {add.disabled = false}

add.addEventListener("click",() =>{ 
    data = JSON.parse(localStorage.getItem("localData")) || [];
    amounts = JSON.parse(localStorage.getItem("localAmounts")) || resetAmounts;
    let description = document.querySelector(".expense-input").value || "Expense";
    let expenseAmount = document.querySelector(".amount-input").value || 0;
    let expenseMethod = document.querySelector(".method-input").value || "debit";
    data.unshift(currentDate());
    data.unshift(expenseMethod);
    data.unshift(expenseAmount);
    data.unshift(description);
    if (expenseMethod === "credit"){amounts.creditExpenses += Number(expenseAmount)
        expenseAmount = -(expenseAmount)}else
        {amounts.debitExpenses += Number(expenseAmount)}
    amounts.expenses += Number(expenseAmount);
    amounts.totalBalance = amounts.salary + amounts.creditExpenses - amounts.debitExpenses;
    amounts.transactions += 1;
    document.querySelector(".expense-input").value = "";
    document.querySelector(".amount-input").value = "";
    display();
    localStorage.setItem("localData", JSON.stringify(data));
    localStorage.setItem("localAmounts", JSON.stringify(amounts));
})

function display(){

    let displayData = document.querySelector(".display-data");
    let html = "";
    for (let i = 0; i < data.length; i += 4){
        j = i
        if (data[i+2] == "debit"){
            html += `<div class="display-data1">
                <span class="js-1">${data[i]}</span>
                <span class="js-2" style= "color: rgb(255, 0, 0);">${data[i+1] < 0 ? '+' : '-'}${Math.abs(data[i+1]).toFixed(2)}</span>
                <span class="js-3">${data[i+3]}</span>
                <span class="js-4" style= "color: rgb(255, 0, 0);">${data[i+2]}</span>
                <button class="js-5" onclick= "dltDb(${data[i+1]}, ${i})">Delete</button>
                </div>`}
        else{
            html += `<div class="display-data2">
                <span class="js-1">${data[i]}</span>
                <span class="js-2" style= "color: green">${data[i+1] < 0 ? '-' : '+'}${Math.abs(data[i+1]).toFixed(2)}</span>
                <span class="js-3">${data[i+3]}</span>
                <span class="js-4" style= "color: green">${data[i+2]}</span>
                <button class="js-5" onclick= "dltCr(${data[i+1]}, ${i})">Delete</button>
            </div>`}
    }
    displayData.innerHTML = html;
    amounts.totalBalance = amounts.salary + amounts.creditExpenses - amounts.debitExpenses;
    document.querySelector(".expenses").innerText = (amounts.debitExpenses+amounts.creditExpenses).toFixed(2);
    document.querySelector(".total-balance").innerText = amounts.totalBalance.toFixed(2);
    document.querySelector(".debit-expenses").innerText = amounts.debitExpenses.toFixed(2);
    document.querySelector(".credit-expenses").innerText = amounts.creditExpenses.toFixed(2);
    document.querySelector(".transactions").innerText = amounts.transactions;
    document.querySelector(".deleted-balance").innerText = amounts.deletedBalance.toFixed(2);
    document.querySelector(".left-days").innerText = leftDays();
    document.querySelector(".total-days").innerText = totalDays();
    document.querySelector(".date1").innerText = currentDate();
    amounts.financialHealth = (amounts.totalBalance / amounts.salary * 100) / (leftDays() / totalDays());
    amounts.financialHealth = (amounts.financialHealth === 0)? amounts.financialHealth : amounts.financialHealth || 100;
    if (amounts.financialHealth>=100)amounts.financialHealth = 100;
    if (amounts.financialHealth<=0)amounts.financialHealth = 0;
    document.querySelector(".financial-health").innerText = amounts.financialHealth.toFixed(2)


    const color = `rgb(${255 - (amounts.financialHealth / 100) * 255}, ${amounts.financialHealth / 100 * 255}, 0)`;
    document.querySelector(".div-01").style.backgroundColor = color;
    const draggable = document.querySelector('.div-01');
        let offsetX, offsetY, isDragging = false;

    draggable.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - draggable.getBoundingClientRect().left;
        offsetY = e.clientY - draggable.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    function onMouseMove(e) {
        if (isDragging) {
            draggable.style.left = `${e.clientX - offsetX}px`;
            draggable.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    document.querySelector(".salary").innerHTML = `${Number(amounts.salary || 0).toFixed(2)}`;
    if (amounts.salary){addSalary.innerText = "Change Salary"
    document.querySelector(".total-salary").setAttribute("placeholder", "Enter Salary")}
}

function dltDb(dat1, i){
    amounts.deletedBalance += dat1
    amounts.expenses += dat1
    amounts.debitExpenses -= dat1
    amounts.transactions -= 1
    amounts.totalBalance += dat1
    data.splice(i, 4)
    localStorage.setItem("localData", JSON.stringify(data));
    localStorage.setItem("localAmounts", JSON.stringify(amounts));
    data = JSON.parse(localStorage.getItem("localData")) || [];
    amounts = JSON.parse(localStorage.getItem("localAmounts")) || resetAmounts;
    display();
}
function dltCr(dat1, i){
    amounts.deletedBalance += dat1
    amounts.expenses -= dat1
    amounts.creditExpenses -= dat1
    amounts.transactions -= 1
    amounts.totalBalance -= dat1
    data.splice(i, 4)
    localStorage.setItem("localData", JSON.stringify(data));
    localStorage.setItem("localAmounts", JSON.stringify(amounts));
    data = JSON.parse(localStorage.getItem("localData")) || [];
    amounts = JSON.parse(localStorage.getItem("localAmounts")) || resetAmounts;
    display();
}
document.querySelector(".reset-deleted").addEventListener("click", () =>{
    data = JSON.parse(localStorage.getItem("localData")) || [];
    amounts = JSON.parse(localStorage.getItem("localAmounts")) || resetAmounts;
    amounts.deletedBalance = 0;
    display();
    localStorage.setItem("localData", JSON.stringify(data));
    localStorage.setItem("localAmounts", JSON.stringify(amounts));
})
document.querySelector(".reset-all").addEventListener("click", () =>{
    data = [];
    amounts = resetAmounts;
    display();
    addSalary.innerText = "Add"
    document.querySelector(".total-salary").setAttribute("placeholder", "Enter your Monthly salary")
    localStorage.setItem("localData", JSON.stringify(data));
    localStorage.setItem("localAmounts", JSON.stringify(amounts));
})
function leftDays() {
    const nowUtc = new Date();
    const options = { timeZone: 'Asia/Karachi', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const pakistaniDateParts = formatter.formatToParts(nowUtc);
    const year = parseInt(pakistaniDateParts.find(part => part.type === 'year').value, 10);
    const month = parseInt(pakistaniDateParts.find(part => part.type === 'month').value, 10) - 1;
    const day = parseInt(pakistaniDateParts.find(part => part.type === 'day').value, 10);
    const pakistaniDate = new Date(year, month, day);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysLeft = Math.ceil((lastDayOfMonth - pakistaniDate) / (1000 * 60 * 60 * 24));
    return daysLeft;
}
function totalDays() {
    const pakistanTimezone = 'Asia/Karachi';
    const now = new Date();
    const pakistanDateTimeString = now.toLocaleString('en-US', {
    timeZone: pakistanTimezone,
    timeZoneName: 'short'
    });
    const pakistanDateTimeParts = pakistanDateTimeString.split(', ');
    const pakistanDateParts = pakistanDateTimeParts[0].split('/');
    const pakistanMonth = pakistanDateParts[0] - 1;
    const pakistanDay = pakistanDateParts[1];
    const pakistanYear = pakistanDateParts[2];
    const lastDayOfMonth = new Date(pakistanYear, pakistanMonth + 1, 0).getDate();
    return lastDayOfMonth;
}
function currentDate() {
    const date = new Date();
    return new Intl.DateTimeFormat('ur-PK', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date).replace(/\//g, '-');
}

data = JSON.parse(localStorage.getItem("localData")) || [];
amounts = JSON.parse(localStorage.getItem("localAmounts")) || resetAmounts;
display();
localStorage.setItem("localData", JSON.stringify(data));
localStorage.setItem("localAmounts", JSON.stringify(amounts));
