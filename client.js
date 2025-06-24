const socket = io();
let room = '';
let username = '';

function joinRoom() {
  room = document.getElementById('roomInput').value.trim();
  username = document.getElementById('usernameInput').value.trim();
  if (!room || !username) {
    alert("Please enter both name and room.");
    return;
  }

  document.querySelector('.join-container').classList.add('hidden');
  document.querySelector('.chat-container').classList.remove('hidden');
  document.getElementById('roomName').textContent = room;

  socket.emit('joinRoom', { room, username });
}

document.getElementById('chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('msgInput');
  const msg = input.value.trim();
  if (!msg) return;

  const time = new Date().toLocaleTimeString();
  socket.emit('chatMessage', { msg, time, username });
  input.value = '';
});

socket.on('message', (data) => {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${data.username}</strong> <em>${data.time}</em>: ${data.msg}`;
  document.getElementById('messages').appendChild(div);
});
