let allTeams = [];
let editId;

function loadTeamsRequest() {
  return fetch("http://localhost:3000/teams-json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => r.json());
}

function createTeamRequest(team) {
  // const team = readTeam();
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function updateTeamRequest(team) {
  // const team = readTeam();
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  }).then(r => r.json());
}

function readTeam() {
  return {
    promotion: document.getElementById("promotion").value,
    members: document.getElementById("members").value,
    name: document.getElementById("name").value,
    url: document.getElementById("url").value
  };
}

function writeTeam({ promotion, members, name, url }) {
  // const { promotion, members, name, url } = team; //Destructuring
  document.getElementById("promotion").value = team.promotion;
  document.getElementById("members").value = team.members;
  document.getElementById("name").value = team.name;
  document.getElementById("url").value = team.url;
}
function getTeamsHtml(teams) {
  return teams
    .map(
      ({ promotion, members, name, url, id }) => `
        <tr>
            <td>${promotion}</td>
            <td>${members}</td>
            <td>${name}</td>
            <td>
            <a href="${url}" target="_blank">${url.replace("https://github.com", "")}</a>
            </td>
            <td>
              <a data-id= "${id}" class ="removeBtn">&#10006</a>
              <a data-id="${id}" class = "edit-btn">&#9998</a>
            </td>
            
        </tr>`
    )
    .join("");
}

let oldDisplayTeams;

function displayTeams(teams) {
  if (oldDisplayTeams === teams) {
    console.warn("save teams to display");
    return;
  }
  oldDisplayTeams = teams;
  // console.time("display");
  document.querySelector("#teams tbody").innerHTML = getTeamsHtml(teams);
  // console.timeEnd("display");
}
function loadTeams() {
  loadTeamsRequest().then(teams => {
    allTeams = teams;
    console.info(teams);
    displayTeams(teams);
  });
}

function onSubmit(e) {
  e.preventDefault();

  const team = readTeam();

  if (editId) {
    team.id = editId;

    updateTeamRequest(team).then(status => {
      if (status.success) {
        // load new teams...
        //loadTeams();

        allTeams = allTeams.map(t => {
          if (t.id === team.id) {
            console.warn("t", t, team);
            return {
              ...t,
              team
            };
          }
          return t;
        });

        displayTeams(allTeams);
        // displayTeams(allTeams);
        e.target.reset();
      }
    });
  } else {
    createTeamRequest(team).then(status => {
      console.warn("status", status.success, status.id);

      if (status.success) {
        // window.location.reload();

        //1.0 adaug id in team
        team.id = status.id;

        // 1. adaugam datele in tabel..
        //1.1 adaug in allTeams
        // allTeams.push(team);
        allTeams = [...allTeams, team]; // Spread syntax
        //1.2 apelam displayTeams(allTeams)
        displayTeams(allTeams);
        // 2. sterge datele din inputuri
        // varianta 1
        // writeTeam({promotion: "",name: "",url: "",members: ""});
        //  varianta 2
        e.target.reset();
      }
    });
  }
}

//TODO -rename

function prepareEdit(id) {
  const team = allTeams.find(team => team.id === id);
  editId = id;

  writeTeam(team);
}

function initEvents() {
  const form = document.getElementById("editForm");
  form.addEventListener("submit", onSubmit);
  form.addEventListener("reset", () => {
    editId = undefined;
  });
  document.querySelector("#teams tbody").addEventListener("click", e => {
    if (e.target.matches("a.removeBtn")) {
      const id = e.target.dataset.id;

      deleteTeamRequest(id).then(status => {
        if (status.success) {
          loadTeams();
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.dataset.id;
      prepareEdit(id);
    }
  });
}
loadTeams();
initEvents();
