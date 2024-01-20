var username = '';

// initial page size is 10
var reposPerPage = 10;

const maxReposPerPage = 100;

// initial page is 1
var page = 1;
const gitUserDataUrl = `https://api.github.com/users`;
var totalRepos = 0;

/*
* function to fetch user data from github api
*/
const fetchUserData = () => {
      document.getElementById('loader-overlay').style.display = 'flex';

      username = document.getElementById('username').value;

      // validate username
      if (username === '' || username === null || username === undefined) {
            document.getElementById('errorMessage').innerHTML = 'Username cannot be empty';
            return;
      }

      var userDataUrl = gitUserDataUrl + `/${username}`;

      fetch(userDataUrl)
            .then(response => {
                  if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }

                  return response.json();
            })
            .then(user => {

                  document.getElementById('errorMessage').innerHTML = '';
                  document.getElementById('loginPage').style.display = 'none';
                  document.getElementById('userInfo').style.display = 'block';
                  document.getElementById('changeUserNav').style.display = 'block';

                  // update user data
                  document.getElementById('profileImg').src = user.avatar_url;
                  document.getElementById('bio').textContent = user.bio || 'No bio available';
                  document.getElementById('usernameLink').textContent = user.login;
                  document.getElementById('usernameLink').href = user.html_url;
                  document.getElementById('loggedUser').textContent = user.name || 'No name available';
                  document.getElementById('location').textContent = user.location || 'No location available';
                  totalRepos = user.public_repos;

                  // fetch repos data
                  fetchReposData();
            })
            .catch(error => {
                  document.getElementById('loader-overlay').style.display = 'none';
                  document.getElementById('errorMessage').innerHTML = 'User not found';
                  console.error('Error:', error);
            });
}

/*
* function to fetch repos data from github api
*/
const fetchReposData = () => {

      document.getElementById('loader-overlay').style.display = 'flex';
      var userReposUrl = `https://api.github.com/users/${username}/repos` + `?per_page=${reposPerPage}&page=${page}`

      fetch(userReposUrl)
            .then(response => {
                  if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
            })
            .then(repos => {
                  updateGrid(repos);
                  updatePagePerSize();
                  updatePagination();
            })
            .catch(error => {
                  document.getElementById('loader-overlay').style.display = 'none';
                  console.error('Error:', error);
            });
};

/*
* function to update grid with repos data
*/
const updateGrid = (repos) => {
      const gridContainer = document.getElementById('repoGrid');
      gridContainer.innerHTML = '';
      const noReposMessage = document.getElementById('noReposMessage');
      noReposMessage.style.display = 'none';
      const showFilters = document.getElementById('filters');
      showFilters.style.display = 'block';

      reposData = repos;
      var index = page === 1 ? 1 : (page - 1) * reposPerPage + 1;

      if (reposData.length > 0) {

            reposData.forEach(repo => {
                  const repoElement = document.createElement('div');
                  repoElement.className = 'container';

                  const colors = ['secondary', 'success', 'danger', 'warning', 'info'];
                  const topicsButtons = repo.topics.length > 0 ? repo.topics.map((topic, index) => `<button type="button" class="btn btn-${colors[index]} btn-sm">${topic}</button>`).join(' ')
                        : 'No topics available';

                  repoElement.innerHTML = `
                  <div class="row">
                        <div class="card">
                              <div class="card-body">
                              <h5 class="card-title">
                                    <a href="${repo.html_url}" target="_blank" class="repo-link">${index}. ${repo.name}</a>
                              </h5>
                              <p class="card-text">${repo.description || 'No description available'}</p>
                              <p class="card-text"><strong>Topics:</strong> ${topicsButtons}</p>
                              </div>
                        </div>
                  </div>
                  `;
                  gridContainer.appendChild(repoElement);
                  index++;
            });
      } else {
            noReposMessage.style.display = 'block';
            showFilters.style.display = 'none';

      }
      document.getElementById('loader-overlay').style.display = 'none';
};

/*
* function to update page per size dropdown
*/
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
                  fetchReposData();
            });

            listItem.appendChild(link);
            perPageDropdown.appendChild(listItem);
      }
}

/*
* function to update pagination
*/
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

/*
* function to fetch repos data by search
* created new function search beacuse, search should not be based on pagination
*/
const fetchDataBySearch = () => {
      document.getElementById('loader-overlay').style.display = 'flex';
      var searchName = document.getElementById('searchInput').value;

      if (searchName === '' || searchName === null || searchName === undefined) {
            document.getElementById('searchErrorMessage').innerHTML = 'Search cannot be empty';
      } else {
            var userReposUrl = `https://api.github.com/users/${username}/repos`;
            document.getElementById('pagination').style.display = 'none';
            document.getElementById('dropdownMenu').style.display = 'none';
            document.getElementById('clear').style.display = 'block';
            document.getElementById('searchErrorMessage').innerHTML = '';

            fetch(userReposUrl)
                  .then(response => {
                        if (!response.ok) {
                              throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                  })
                  .then(repos => {

                        const filteredRepos = repos.filter(repo => repo.name.toLowerCase().includes(searchName.toLowerCase()));
                        if (filteredRepos.length === 0) {
                              const gridContainer = document.getElementById('repoGrid');
                              gridContainer.innerHTML = '';

                              const noReposMessage = document.getElementById('noReposMessage');
                              noReposMessage.style.display = 'block';
                              return;
                        }
                        currentRepoSize = filteredRepos.length;
                        updateGrid(filteredRepos);
                  })
                  .catch(error => {
                        console.error('Error:', error);
                  });
      }
      document.getElementById('loader-overlay').style.display = 'none';
}

/*
* function to clear search
*/
const clearSearch = () => {
      document.getElementById('searchInput').value = '';
      document.getElementById('pagination').style.display = 'flex';
      document.getElementById('dropdownMenu').style.display = 'block';
      document.getElementById('clear').style.display = 'none';
      document.getElementById('searchErrorMessage').innerHTML = '';
      fetchReposData();
}

/*
* function to change user
*/
function changeUser() {
      window.location.reload();
}