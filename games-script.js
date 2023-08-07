const gamesPerPage = 10;
let currentGamePage = 1;
let totalGames = 0;

function fetchGamesData(startDate, endDate) {
  fetch(`https://www.balldontlie.io/api/v1/games?start_date=${startDate}&end_date=${endDate}`).then(response => response.json()).then(data => {
        console.log(data)
      totalGames = data.data.length;
      const gamesContainer = document.getElementById('games-container');
      gamesContainer.innerHTML = ''; 
      const startIndex = (currentGamePage - 1) * gamesPerPage;
      const endIndex = startIndex + gamesPerPage;
      const gamesToShow = data.data.slice(startIndex, endIndex);
      gamesToShow.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        const result = determineGameResult(game); 
        gameCard.innerHTML = `
          <h3>${game.date}</h3>
          <p>${game.home_team.full_name} ${result}</p>
          <p>${game.visitor_team.full_name} ${result}</p>
        `;
        gamesContainer.appendChild(gameCard);
      });
      updateGamePaginationButtons();
    })
    .catch(error => console.error(error));
}


function updateGamePaginationButtons() {
  const paginationContainer = document.getElementById('games-pagination');
  paginationContainer.innerHTML = ''; 
  const totalPages = Math.ceil(totalGames / gamesPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('pagination-button');
    if (i === currentGamePage) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      currentGamePage = i;
      fetchGamesData(startDate, endDate);
    });
    paginationContainer.appendChild(button);
  }
}


function determineGameResult(game) {
  if (game.home_team_score > game.visitor_team_score) {
    return ' WON';
  } else if (game.home_team_score < game.visitor_team_score) {
    return ' LOST';
  } else {
    return ' TIE';
  }
}


document.getElementById('filter-button').addEventListener('click', () => {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  console.log(startDate,"xyz")
  currentGamePage = 1; 
  fetchGamesData(startDate, endDate);
});


const startDate = ''; 
const endDate = ''; 
fetchGamesData(startDate, endDate);