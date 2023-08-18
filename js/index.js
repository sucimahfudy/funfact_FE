document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded");  
    init();
    });

const init = () => {
    bindEventListeners();
    displayTodaysDate();
    getFunFact();
};

const bindEventListeners = () => {
    document 
      .getElementById("oneMoreBtn")
      .addEventListener("click", handleOneMoreBtn); 
    document
      .getElementById("newFactForm")
      .addEventListener("submit", handleAddNewFact);
    document
      .getElementById("viewMyFactsForm")
      .addEventListener("submit", handleViewMyFacts);
    document
      .getElementById("editFactForm")
      .addEventListener("submit", handleEditFact);
};

const handleOneMoreBtn = async e => {
    try {
        await getFunFact();
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const handleViewMyFacts = async e => {
    try {
        e.preventDefault();
        const userName = String(e.target[0].value).toLowerCase(); 
        event.target.reset();
        getMyFacts(userName);
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const handleAddNewFact = e => {
    try {
        e.preventDefault();
        let newFactObj = {};
        for (let i = 0; i < e.target.length - 1; i++) {
          if (!e.target[i].name) {
            alert("Please fill in all form fields");
            return;
          } else {
            if (e.target[i].name === "userName") {
                newFactObj[e.target[i].name] = String(e.target[i].value).toLowerCase();
            } else {
                newFactObj[e.target[i].name] = String(e.target[i].value);
            }
          }
        }
        event.target.reset();
        postNewFact(newFactObj);
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const handleEditFact = e => {
    try {
        e.preventDefault();
        const factIdElem = document.getElementById("editTextArea");
        const factId = factIdElem.getAttribute("editFactId");
        const userName = factIdElem.getAttribute("originalUserName");
        let editFactObj = {};
        for (let i = 0; i < e.target.length - 1; i++) {
            if (!e.target[i].name) {
                alert("Please fill in all form fields");
                return;
            } else {
                if (e.target[i].name === "userName") {
                    editFactObj[e.target[i].name] = String(e.target[i].value).toLowerCase();
                } else {
                    editFactObj[e.target[i].name] = String(e.target[i].value);
                }
            }
        }
        console.log(editFactObj);
        const card5 = document.getElementById("editFactContainer");
        card5.style.display = "none";
        window.location.href = "#myFactsTitle";
        editFact(editFactObj,factId,userName);
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const handleDeleteFact = async e => {
    try {
        const targetElem = e.target;
        const factId = e.target.dataset.factid;
        const factObj = await getOneFact(factId);
        const userName = String(factObj.userName);
        let confirmation = window.confirm("Are you sure you want to delete this fun fact?");
        if (confirmation === true) {
            deleteFact(factId,userName);
            return;
        }
        targetElem.checked = false;
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const displayTodaysDate = () => {
    try {
        let todaysDate = "";
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const todaysDateObj = new Date();
        const dateToday = todaysDateObj.getDate();
        const currentMonth = months[todaysDateObj.getMonth()];
        const currentYear = todaysDateObj.getFullYear();
        todaysDate = `${currentMonth} ${dateToday}, ${currentYear}`;
        const todaysDateElem = document.getElementById("todaysDate"); 
        todaysDateElem.innerHTML = `${todaysDate}`;
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const displayFunFact = (randomFactObj) => {
    try {
        if (!randomFactObj) {
            return;
        }
        const randomFact = randomFactObj.fact;
        const funFactElem = document.getElementById("randomFact"); 
        funFactElem.innerHTML = `${randomFact}`;
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const displayMyFacts = (myFactsArr) => {
    try {
        if (!myFactsArr) {
            alert("You do not have any facts.");
            return;
        }
        makeTable(myFactsArr);
        const card4 = document.getElementById('myFactsList');
        card4.style.display = "block";
        window.location.href = "#myFactsTitle";
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const makeTable = async (myFactsArr) => {
    try {
        if (!myFactsArr) {
            return;
        }
        const table = document.getElementById('dataTable');
        const tHead = document.getElementById('dataTableHead');
        table.innerHTML = null;
        tHead.innerHTML = null;
        tHead.appendChild(createHead(myFactsArr[0]));
        myFactsArr.forEach(fact => {
          table.appendChild(createRow(fact))
        })
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const createHead = (fact) => {
    try {
        if (!fact) {
            return;
        }
        const row = document.createElement('tr');
        for (let key in fact) {
            if (key !== '_id' && key !== '__v') {
                const th = document.createElement('th');
                th.innerText = spacesToCamelCase(key);
                row.appendChild(th)
            }
        }
        const thDelete = document.createElement('th');
        thDelete.innerText = 'Delete Fact';
        row.appendChild(thDelete);
        const thEdit = document.createElement('th');
        thEdit.innerText = 'Edit Fact';
        row.appendChild(thEdit);
        return row;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const spacesToCamelCase = (str) => {
    try {
        if (!str) {
            return;
        }
        const withSpaces = str.split(/(?=[A-Z]+)/).join(' ');
        const allWords = [];
        for (let i = 0; i < withSpaces.length; i++) {
            allWords.push(withSpaces[i]);
        };
        allWords[0] = allWords[0][0].toUpperCase() + allWords[0].slice(1, allWords[0].length);
        return allWords.join('');
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
};

const createRow = (fact) => {
    try {
        if (!fact) {
            return;
        }
        const row = document.createElement('tr');
        for (let key in fact) {
            const td = document.createElement('td');
            switch (key) {
                case '_id':
                case '___v':
                break;
                case 'fact':
                    td.innerHTML = `${fact[key].slice(0, 40)}...`;
                    break;
                case 'sourceLink':
                    td.innerHTML = `${fact[key].slice(0, 10)}...`;
                    break;
                case 'userName':
                    const nameOfUser = fact[key];    
                    td.innerHTML = spacesToCamelCase(nameOfUser);
                    break;
                default:
                    td.innerHTML = fact[key];
                    break;
            }
            if (key !== '_id' && key !== '__v') {
                td.setAttribute('data-factid', fact._id)
                td.setAttribute('data-target', '#editFactModal');
                row.appendChild(td)
            }
        }
        row.append(createDeleteButton(fact._id))
        row.append(createEditButton(fact._id))
        return row;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const createDeleteButton = (id) => {
    try {
        if (!id) {
            return;
        }
        const deleteTd = document.createElement('td');
        const deleteCheckbox = document.createElement('input');
        deleteCheckbox.setAttribute('type', 'checkbox');
        deleteCheckbox.setAttribute('data-factid', id);
        deleteCheckbox.addEventListener('click', handleDeleteFact);
        deleteTd.appendChild(deleteCheckbox);
        return deleteTd;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const createEditButton = (id) => {
    try {
        if (!id) {
            return;
        }
        const editTd = document.createElement('td');
        const editCheckbox = document.createElement('input');
        editCheckbox.setAttribute('type', 'checkbox');
        editCheckbox.setAttribute('class', 'no-left-margin');
        editCheckbox.setAttribute('data-factid', id);
        editCheckbox.addEventListener('click', displayEditForm);
        editTd.appendChild(editCheckbox);
        return editTd;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const displayEditForm = async (e) => {
    try {
        const card5 = document.getElementById('editFactContainer');
        card5.style.display = "block";
        window.location.href = "#editFactTitle";
        const factId = e.target.dataset.factid;
        const factObj = await getOneFact(factId);
        const originalUserName = (factObj.userName);
        const factKeysArr = ['fact','sourceLink','userName'];
        const formIdsArr = ['editTextArea','editSourceLink','editUserName'];
        for (let i = 0; i < factKeysArr.length; i++) {
            let key = factKeysArr[i];
            let formElement = document.getElementById(formIdsArr[i]);
            if (key === "userName") {
                formElement.value = spacesToCamelCase(factObj[key]);
            } else {
                formElement.value = factObj[key];
            }
            formElement.setAttribute("editFactId", factId);
            formElement.setAttribute("originalUserName", originalUserName);
        }
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const getFunFact = async () => {
    try {
        const { data } = await axios.get(`http://localhost:3001/funFact/randomFact`).catch(err => {
            console.log(err);
        });
        displayFunFact(data[0]);
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const postNewFact = async (newFactObj) => {
    try {
        if (!newFactObj) {
            return;
        }
        const resolved = await axios.post("http://localhost:3001/funFact/createFact",{newFactObj: newFactObj}).catch((err) => {
            throw 'There was a problem making your request'
        });
        getMyFacts(newFactObj.userName);
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const getMyFacts = async (userName) => {
    try {
        if(userName){
            response = await axios.get(`http://localhost:3001/funFact/author/${userName}`).catch(err => {
                console.log(err);
              });
            if (response.data.length === 0) {
                alert('No user with this name exists');
                return;
            }
        } else {
            alert('Please enter a valid user name');
            return;
        }
        displayMyFacts(response.data) 
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const getOneFact = async (factId) => {
    try {
        if (!factId) {
            return;
        }
        let response = await axios.get(`http://localhost:3001/funFact/${factId}`).catch(err => {
            console.log(err);
        });
        return response.data[0];
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const editFact = async (editFactObj,factId,userName) => {
    try {
        if (!editFactObj || !factId || !userName) {
            return;
        }
        let response = await axios.put(`http://localhost:3001/funFact/updateFact/${factId}`, {editFactObj: editFactObj}).catch(err => {
            console.log(err);
        });
        getMyFacts(userName);
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}

const deleteFact = async (factId,userName) => {
    try {
        if (!factId || !userName) {
            return;
        }
        let response = await axios.delete(`http://localhost:3001/funFact/deleteFact/${factId}`).catch(err => {
            console.log(err);
        });
        getMyFacts(userName);
        return;
    }
    catch(error) {
        console.log(`Ooops: ${error}`);
        return;
    }
}