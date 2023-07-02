const APIURL = 'https://api.github.com/users/';

const form = document.getElementById('form');
const searchInput = document.getElementById('search');
const main = document.getElementById('main');

async function getUser(username) {
  try {
    const response = await fetch(APIURL + username);
    if (response.ok) {
      const userData = await response.json();
      const reposData = await fetch(userData.repos_url);
      if (reposData.ok) {
        const repos = await reposData.json();
        displayUser(userData, repos);
      } else {
        throw new Error('Unable to fetch repositories');
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    displayError(error.message);
  }
}

function displayUser(user, repos) {
  main.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" alt="User Avatar" class="avatar">
      <div class="user-info">
        <h2>${user.name}</h2>
        <ul>
          <li>
            <strong>Followers:&nbsp;</strong> ${user.followers}
          </li>
          <li>
            <strong>Following:&nbsp;</strong> ${user.following}
          </li>
          <li>
            <strong>Repos:&nbsp;</strong> ${user.public_repos}
          </li>
        </ul>
        <h3>Repositories:</h3>
        <div class="repos-container">
          <div class="row">
            ${repos.slice(0, 2).map(repo => `<div class="repo">${repo.name}</div>`).join('')}
          </div>
          <div class="row">
            ${repos.slice(2, 4).map(repo => `<div class="repo">${repo.name}</div>`).join('')}
          </div>
        <a href="${user.html_url}" target="_blank" class="repo">View Profile on GitHub</a>
      </div>
    </div>
  `;
}


function displayError(message) {
  main.innerHTML = `<p class="error">${message}</p>`;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    await getUser(searchTerm);
    searchInput.value = '';
  }
});