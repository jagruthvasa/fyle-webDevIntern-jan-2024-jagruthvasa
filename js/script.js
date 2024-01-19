const username = 'jagruthvasa';

var reposPerPage = 10;
const maxReposPerPage = 100;
var page = 1;
const gitUserDataUrl = `https://api.github.com/users`;
var totalRepos = 0;

const fetchUserData = () => {

      if (!username || username === '' || username === null) {
            username = document.getElementById('usernameInput').value;
      }

      var userDataUrl = gitUserDataUrl + `/${username}`;
      console.log('userDataUrl', userDataUrl);

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
                  fetchReposData();
            })
            .catch(error => {
                  console.error('Error fetching user data:', error);
            });
}

const fetchReposData = () => {

      var userReposUrl = `https://api.github.com/users/${username}/repos` + `?per_page=${reposPerPage}&page=${page}`
      console.log('userReposUrl', userReposUrl);
      fetch(userReposUrl)
            .then(response => {
                  if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
            })
            .then(repos => {
                  console.log(repos);
                  updateGrid(repos);
                  updatePagePerSize();
                  updatePagination();
            })
            .catch(error => {
                  console.error('Error:', error);
            });
};

const updateGrid = (repos) => {
      const gridContainer = document.getElementById('repoGrid');
      gridContainer.innerHTML = '';
      reposData = repos;

      reposData.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.className = 'container';

            const colors = ['secondary', 'success', 'danger', 'warning', 'info'];
            const topicsButtons = repo.topics.map((topic, index) => `<button type="button" class="btn btn-${colors[index]} btn-sm">${topic}</button>`).join(' ');

            repoElement.innerHTML = `
            <div class="row">
                  <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">
                              <a href="${repo.html_url}" target="_blank" class="repo-link">${repo.name}</a>
                        </h5>
                        <p class="card-text">${repo.description || 'No description available'}</p>
                        <p class="card-text"><strong>Topics:</strong> ${topicsButtons}</p>
                        </div>
                  </div>
            </div>
            `;
            gridContainer.appendChild(repoElement);
      });
};

const updatePagePerSize = () => {
      const perPageDropdown = document.getElementById('perPageDropdown');
      perPageDropdown.innerHTML = '';

      const maxPages = totalRepos > maxReposPerPage ? maxReposPerPage : totalRepos;

      for (let i = 1; i <= maxPages; i++) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.classList.add('dropdown-item');
            link.href = '#';
            link.textContent = i;

            link.addEventListener('click', function () {
                  reposPerPage = i;
                  console.log(`Selected page: ${i}`);
                  fetchReposData();
            });

            listItem.appendChild(link);
            perPageDropdown.appendChild(listItem);
      }
}

const updatePagination = () => {
      const paginationContainer = document.querySelector('.pagination');
      paginationContainer.innerHTML = '';

      const totalPages = Math.ceil(totalRepos / reposPerPage);
      const maxPageLinks = 5;

      let startPage = Math.max(1, page - Math.floor(maxPageLinks / 2));
      let endPage = Math.min(startPage + maxPageLinks - 1, totalPages);

      if (endPage - startPage + 1 < maxPageLinks) {
            startPage = Math.max(1, endPage - maxPageLinks + 1);
      }

      const createPageLink = (pageNumber) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.classList.add('page-link');
            link.href = '#';
            link.textContent = pageNumber;

            link.addEventListener('click', function () {
                  page = pageNumber;
                  fetchReposData();
            });

            listItem.appendChild(link);
            return listItem;
      };

      for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createPageLink(i));
      }
};

fetchUserData();
