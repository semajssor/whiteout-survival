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
     } else {
       throw new Error('Failed to add/update member');
     }
   }).catch(error => console.error('Error:', error));
});
 
document.querySelector('.update').addEventListener('click', function() {
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
     } else {
       throw new Error('Failed to update member');
     }
   }).catch(error => console.error('Error:', error));
});
 
document.querySelector('.delete').addEventListener('click', function() {
   const username = document.getElementById('username').value;
   fetch(`/members/${username}`, {
     method: 'DELETE'
   }).then(response => {
     if (response.ok) {
       resetForm();
       showSuccessMessage('Member deleted successfully');
     } else {
       throw new Error('Failed to delete member');
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
   document.body.appendChild(successMessage);
   setTimeout(() => {
     successMessage.remove();
   }, 3000); 
}
