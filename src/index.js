import debounce from "lodash/debounce";
import { loadTeamsRequest, createTeamRequest, deleteTeamRequest, updateTeamRequest } from "./request";
import { $, sleep } from "./utilities";
// const utilities = require('./utilities');

let allTeams = [];
let editId;

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

async function onSubmit(e) {
  e.preventDefault();

  const team = readTeam();
  let status = { success: false };
  if (editId) {
    team.id = editId;

    const status = await updateTeamRequest(team);
    if (status.success) {
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
    }
  } else {
    const status = await createTeamRequest(team);
    console.warn("status", status.success, status.id);
    if (status.success) {
      team.id = status.id;

      allTeams = [...allTeams, team];
    }
  }
  if (status.success) {
    displayTeams(allTeams);
    e.target.reset();
  }
}

function prepareEdit(id) {
  const team = allTeams.find(team => team.id === id);
  editId = id;

  writeTeam(team);
}
function searchTeams(search) {
  return allTeams.filter(team => {
    return team.promotion.indexOf(search) >= 0;
  });
}

function initEvents() {
  const form = $("#editForm");
  form.addEventListener("submit", onSubmit);
  form.addEventListener("reset", () => {
    editId = undefined;
  });

  $("#search").addEventListener(
    "input",
    debounce(e => {
      const teams = searchTeams(e.target.value);

      displayTeams(teams);
      console.log("search");
    }, 300)
  );

  $("#teams tbody").addEventListener("click", async e => {
    if (e.target.matches("a.removeBtn")) {
      const id = e.target.dataset.id;

      const status = await deleteTeamRequest(id);
      if (status.success) {
        loadTeams();
        // TODO homework: don't load all teams...
      }
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.dataset.id;
      prepareEdit(id);
    }
  });
}
loadTeams();
initEvents();
// TODO move in external file
console.info("sleep");
sleep(1000).then(r => {
  console.info("done1", r);
});
console.warn("after sleep");

(async () => {
  console.info("start");
  var r2 = await sleep(5000);
  console.warn("done2", r2);
})();
