const playersPerPage = 10;
let currentPage =1;
let totalPlayers = 25;

function fetchPlayers() {
    fetch("https://www.balldontlie.io/api/v1/players").then(res=>res.json()).then(data=>{
        // console.log(data)
        totalPlayers = data.data.length;
        // console.log(totalPlayers,"play")
        const playersContainer = document.getElementById("players-container");
        playersContainer.innerHTML="";
        const startIndex = (currentPage -1) * playersPerPage;
        const endIndex = startIndex + playersPerPage;

        const playersToShow = data.data.slice(startIndex,endIndex);
        playersToShow.forEach(player => {
            const playerCard = document.createElement("div");
            playerCard.className= "player-card";
            playerCard.innerHTML= `
            <img src="./Img.jpg" alt="Player-image">
            <h3>${player.first_name} ${player.last_name}</h3>
            <p>Position: ${player.position}</p>
            <button class="team-details-button" data-team-id="${player.team.id}">Team Details</button> `;
            playersContainer.appendChild(playerCard);
        });
    }).catch(err=>console.log(err));
}


function updatePaginationButton() {
    // console.log("pagination")
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";
    let totalPages = Math.ceil(totalPlayers / playersPerPage);
    // console.log(totalPlayers,"totalplayers")
    // console.log(totalPages,"totalpages")
    for(let i=1;i<=totalPages;i++){
        // console.log(i)
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("pagination-button");
        // button.className="pagination-button"

        if(i=== currentPage){
            button.classList.add("active")
        }
        button.addEventListener("click",() => {
            currentPage = i;
            fetchPlayers();
            updatePaginationButton();
        })
        paginationContainer.appendChild(button);
    }
}

document.addEventListener("click",async event => {
    if(event.target.classList.contains("team-details-button")){
        const teamid = event.target.getAttribute("data-team-id");
        try {
            const response = await fetch(`https://www.balldontlie.io/api/v1/teams/${teamid}`);
            const team = await response.json();
            const playerCard = event.target.closest(".player-card");

            const existingTeamDetails = playerCard.querySelector(".team-details");
            if(existingTeamDetails){
                existingTeamDetails.remove();
                return;
            }

            const teamDetailsContainer = playerCard.querySelector(".team-details");
            const allTeamDetails = document.querySelectorAll(".team-details");
            allTeamDetails.forEach(details => details.remove());

                if(!teamDetailsContainer){
                    const newTeamDetailsContainer = document.createElement("div");
                   newTeamDetailsContainer.className="team-details";
           newTeamDetailsContainer.innerHTML=`
            <h3>TEAM DETAILS</h3>
            <p><strong>Team Name:</strong>${team.full_name}</p>
            <p><strong>Abbr:</strong>${team.abbreviation}</p>
            <p><strong>Conference:</strong>${team.conference}</p>
            <p><strong>Division:</strong>${team.division}</p>
            <p><strong>City:</strong>${team.city}</p>
            `;
            playerCard.appendChild(newTeamDetailsContainer);
                } 
        } catch (error) {
            console.log(error)
        }
    }
});

document.getElementById('search-input').addEventListener('input', event => {
    const searchTerm = event.target.value.toLowerCase();
    fetch('https://www.balldontlie.io/api/v1/players')
      .then(response => response.json())
      .then(data => {
        const filteredPlayers = data.data.filter(player =>
          player.first_name.toLowerCase().includes(searchTerm) ||
          player.last_name.toLowerCase().includes(searchTerm)
        );
        totalPlayers = filteredPlayers.length;
        currentPage = 1; // Reset page when searching
        const playersContainer = document.getElementById('players-container');
        playersContainer.innerHTML = ''; // Clear previous content
        const startIndex = (currentPage - 1) * playersPerPage;
        const endIndex = startIndex + playersPerPage;
        const playersToShow = filteredPlayers.slice(startIndex, endIndex);
        playersToShow.forEach(player => {
          const playerCard = document.createElement('div');
          playerCard.className = 'player-card';
          playerCard.innerHTML = `
            <img src="./Img.jpg" alt="Player-image">
            <h3>${player.first_name} ${player.last_name}</h3>
            <p>Position: ${player.position}</p>
            <button class="team-details-button" data-team-id="${player.team.id}">Team Details</button> `;
          playersContainer.appendChild(playerCard);
        });
        updatePaginationButton();
      })
      .catch(err => console.log(err));
  });

fetchPlayers();
updatePaginationButton()

