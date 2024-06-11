document.getElementById('memberForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const data = {
      rank: document.getElementById('rank').value,
      username: document.getElementById('username').value,
      power: document.getElementById('power').value,
      level: document.getElementById('level').value
  };
  const method = data.username ? 'PUT' : 'POST';
  const url = data.username ? `/members/${data.username}` : '/members';

  fetch(url, {
      method: method,
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  }).then(response => {
      if (response.ok) {
          resetForm();
          showSuccessMessage(method === 'PUT' ? 'Member updated successfully' : 'Member added successfully');
          displayUsers();  // Refresh the user list
      } else {
          response.json().then(data => {
              console.error('Error:', data);
              showErrorMessage(data.message);
          });
      }
  }).catch(error => console.error('Error:', error));
});

document.querySelector('.update').addEventListener('click', function () {
  const data = {
      rank: document.getElementById('rank').value,
      username: document.getElementById('username').value,
      power: document.getElementById('power').value,
      level: document.getElementById('level').value
  };
  fetch(`/members/${data.username}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  }).then(response => {
      if (response.ok) {
          resetForm();
          showSuccessMessage('Member updated successfully');
          displayUsers();  // Refresh the user list
      } else {
          response.json().then(data => {
              console.error('Error:', data);
              showErrorMessage(data.message);
          });
      }
  }).catch(error => console.error('Error:', error));
});

document.querySelector('.delete').addEventListener('click', function () {
  const username = document.getElementById('username').value;
  fetch(`/members/${username}`, {
      method: 'DELETE'
  }).then(response => {
      if (response.ok) {
          resetForm();
          showSuccessMessage('Member deleted successfully');
          displayUsers();  // Refresh the user list
      } else {
          response.json().then(data => {
              console.error('Error:', data);
              showErrorMessage(data.message);
          });
      }
  }).catch(error => console.error('Error:', error));
});

function resetForm() {
  document.getElementById('memberForm').reset();
}

function showSuccessMessage(message) {
  const successMessage = document.createElement('div');
  successMessage.textContent = message;
  successMessage.classList.add('success-message');
  document.querySelector('.container').appendChild(successMessage);
  setTimeout(() => {
      successMessage.remove();
  }, 3000);
}

function showErrorMessage(message) {
  const errorMessage = document.createElement('div');
  errorMessage.textContent = message;
  errorMessage.classList.add('error-message');
  document.querySelector('.container').appendChild(errorMessage);
  setTimeout(() => {
      errorMessage.remove();
  }, 3000);
}

function displayUsers() {
  fetch('/members')
      .then(response => response.json())
      .then(data => {
          const userList = document.getElementById('userList');
          userList.innerHTML = '';
          data.forEach(user => {
              const userDiv = document.createElement('div');
              userDiv.classList.add('user-item');
              userDiv.innerHTML = `
                  <p>Rank: ${user.rank}</p>
                  <p>Username: ${user.username}</p>
                  <p>Power: ${user.power}</p>
                  <p>Level: ${user.level}</p>
              `;
              userList.appendChild(userDiv);
          });
      });
}

document.getElementById('searchBar').addEventListener('input', function (e) {
  const query = e.target.value.toLowerCase();
  const userItems = document.querySelectorAll('.user-item');
  userItems.forEach(item => {
      const username = item.querySelector('p:nth-child(2)').textContent.toLowerCase();
      if (username.includes(query)) {
          item.style.display = '';
      } else {
          item.style.display = 'none';
      }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  displayUsers();  // Load users on page load
});
