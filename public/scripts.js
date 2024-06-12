document.addEventListener('DOMContentLoaded', function () {
  // Add event listeners and functions inside this block to ensure DOM is fully loaded

  document.getElementById('memberForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
      rank: parseInt(document.getElementById('rank').value),
      username: document.getElementById('username').value,
      power: document.getElementById('power').value,
      level: parseInt(document.getElementById('level').value)
    };
    const method = data.username ? 'POST' : 'PUT';
    const url = method === 'PUT' ? `/members/${data.username}` : '/members'; // Determine URL based on method

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      resetForm();
      if (method === 'PUT') {
        showSuccessMessage('Member updated successfully');
      } else {
        showSuccessMessage('Member added successfully');
      }
      displayUsers(); // Refresh user list after add/update
    })
    .catch(error => {
      console.error('Error:', error);
      showErrorMessage('Error communicating with the server');
    });
  });

  document.querySelector('.update').addEventListener('click', function () {
    const data = {
      rank: parseInt(document.getElementById('rank').value),
      username: document.getElementById('username').value,
      power: document.getElementById('power').value,
      level: parseInt(document.getElementById('level').value)
    };
    fetch(`/members/${data.username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      resetForm();
      showSuccessMessage('Member updated successfully');
      displayUsers(); // Refresh user list after update
    })
    .catch(error => {
      console.error('Error:', error);
      showErrorMessage('Error updating member');
    });
  });

  document.querySelector('.delete').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    fetch(`/members/${username}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      resetForm();
      showSuccessMessage('Member deleted successfully');
      displayUsers(); // Refresh user list after delete
    })
    .catch(error => {
      console.error('Error:', error);
      showErrorMessage('Error deleting member');
    });
  });

  function resetForm() {
    document.getElementById('memberForm').reset();
  }

  function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.textContent = message;
    successMessage.classList.add('success-message');
    document.querySelector('.container').insertAdjacentElement('afterbegin', successMessage);
    setTimeout(() => {
      successMessage.remove();
    }, 4000);
  }

  function showErrorMessage(message) {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = message;
    errorMessage.classList.add('error-message');
    document.querySelector('.container').insertAdjacentElement('afterbegin', errorMessage);
    setTimeout(() => {
      errorMessage.remove();
    }, 4000);
  }

  function displayUsers() {
    fetch('/members')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const userList = document.getElementById('userList');
        if (!userList) {
          console.error('Error: #userList element not found');
          return;
        }
        userList.innerHTML = '';
        data.forEach(user => {
          const userDiv = document.createElement('div');
          userDiv.classList.add('user-item');
          userDiv.innerHTML = `
            <p><i class="fas fa-star"></i> Rank: ${user.rank}</p>
            <p><i class="fas fa-crown"></i> Username: ${user.username}</p>
            <p><i class="fas fa-hand-rock"></i> Power: ${user.power}</p>
            <p><i class="fas fa-chess-rook"></i> Level: ${user.level}</p>
          `;
          userList.appendChild(userDiv);
        });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        showErrorMessage('Error fetching users');
      });
  }

  document.getElementById('searchInput').addEventListener('input', function (e) {
    const query = e.target.value.trim().toLowerCase();
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

  document.querySelector('.clear-icon').addEventListener('click', function () {
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.user-item').forEach(item => {
      item.style.display = '';
    });
  });

  // Initial call to display users when the page is loaded
  displayUsers();
});
