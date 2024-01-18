const username = 'jagruthvasa';

const userDataUrl = `https://api.github.com/users/${username}`;

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

      })
      .catch(error => {
            console.error('Error:', error);
      });