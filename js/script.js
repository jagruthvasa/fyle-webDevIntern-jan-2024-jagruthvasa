var username = '';

var reposPerPage = 10;
const maxReposPerPage = 100;
var page = 1;
const gitUserDataUrl = `https://api.github.com/users`;
var totalRepos = 0;

const fetchUserData = () => {
      document.getElementById('loader-overlay').style.display = 'flex';

      username = document.getElementById('username').value;
      console.log('username', username);

      if (username === '' || username === null || username === undefined) {
            document.getElementById('errorMessage').innerHTML = 'Username cannot be empty';
            return;
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

                  document.getElementById('errorMessage').innerHTML = '';
                  document.getElementById('loginPage').style.display = 'none';
                  document.getElementById('userInfo').style.display = 'block';
                  document.getElementById('changeUserNav').style.display = 'block';

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
                  document.getElementById('loader-overlay').style.display = 'none';
                  document.getElementById('errorMessage').innerHTML = 'User not found';
            });
}

const fetchReposData = () => {

      document.getElementById('loader-overlay').style.display = 'flex';
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
                  document.getElementById('loader-overlay').style.display = 'none';
                  console.error('Error:', error);
            });
};

const updateGrid = (repos) => {
      const gridContainer = document.getElementById('repoGrid');
      gridContainer.innerHTML = '';
      const noReposMessage = document.getElementById('noReposMessage');
      noReposMessage.style.display = 'none';

      reposData = repos;
      var index = page === 1 ? 1 : (page - 1) * reposPerPage + 1;

      if (reposData.length > 0) {

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
      }
      document.getElementById('loader-overlay').style.display = 'none';
};

const updatePagePerSize = () => {
      const perPageDropdown = document.getElementById('perPageDropdown');
      perPageDropdown.innerHTML = '';
      page = 1;

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

const fetchDataBySearch = () => {
      document.getElementById('loader-overlay').style.display = 'flex';
      var searchName = document.getElementById('searchInput').value;
      console.log('searchName', searchName);

      if (searchName === '' || searchName === null || searchName === undefined) {
            document.getElementById('searchErrorMessage').innerHTML = 'Search cannot be empty';
      } else {
            var userReposUrl = `https://api.github.com/users/${username}/repos`;
            console.log('userReposUrl', userReposUrl);
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
                              console.log('No repos found');
                              return;
                        }
                        currentRepoSize = filteredRepos.length;
                        console.log(filteredRepos);
                        updateGrid(filteredRepos);
                  })
                  .catch(error => {
                        console.error('Error:', error);
                  });
      }
      document.getElementById('loader-overlay').style.display = 'none';
}

const clearSearch = () => {
      document.getElementById('searchInput').value = '';
      document.getElementById('pagination').style.display = 'flex';
      document.getElementById('dropdownMenu').style.display = 'block';
      document.getElementById('clear').style.display = 'none';
      document.getElementById('searchErrorMessage').innerHTML = '';
      fetchReposData();
}

function changeUser() {
      window.location.reload();
}

// fetchUserData();
