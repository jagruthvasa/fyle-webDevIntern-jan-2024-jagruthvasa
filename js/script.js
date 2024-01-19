const username = 'jagruthvasa';

const userDataUrl = `https://api.github.com/users/${username}`;
const userReposUrl = `https://api.github.com/users/${username}/repos`;
var totalRepos = 0;
var tagsUrl = '';

fetch(userDataUrl)
      .then(response => {
            if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
      })
      .then(user => {
            document.getElementById('profileImg').src = user.avatar_url;
            document.getElementById('bio').textContent = user.bio || 'No bio available';
            document.getElementById('usernameLink').textContent = user.login;
            document.getElementById('usernameLink').href = user.html_url;
            document.getElementById('username').textContent = user.name || 'No name available';
            document.getElementById('location').textContent = user.location || 'No location available';
            console.log(user);
            totalRepos = user.public_repos;
      })
      .catch(error => {
            console.error('Error fetching user data:', error);
      });

const fetchData = () => {
      fetch(userReposUrl)
            .then(response => {
                  if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
            })
            .then(repos => {
                  totalRepos = repos.length;
                  console.log(repos);
                  updateGrid(repos);
            })
            .catch(error => {
                  console.error('Error:', error);
            });
};

const updateGrid = (repos) => {
      const gridContainer = document.getElementById('repoGrid');
      gridContainer.innerHTML = '';
      currentPage = 1;
      itemsPerPage = 10;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const reposData = repos.slice(startIndex, endIndex);

      reposData.forEach(repo => {
            console.log('topics', repo.name, ' ', repo.topics);
            const repoElement = document.createElement('div');
            repoElement.className = 'card';
            repoElement.innerHTML = `
            <div class="card-body">
                  <h5 class="card-title">${repo.name}</h5>
                  <p class="card-text">${repo.description || 'No description available'}</p>
                  <p class="card-text"><strong>Topics:</strong> ${repo.topics.join(', ') || 'No topics available'}</p>
                  <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View on GitHub</a>
            </div>
          `;
            gridContainer.appendChild(repoElement);
      });
};

fetchData();
