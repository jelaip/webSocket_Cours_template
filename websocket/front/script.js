let nameUser = '';
let room = '';
let socketid = '';
const roomArea = document.querySelector('#room');
const messageArea = document.querySelector('#message');
const nameArea = document.querySelector('#name');
const socket = io('http://localhost:3000');
socket.on('connect', () => {
    console.log('Connected');
});
socket.on('message', (data, user) => {
    console.log(data);
    const div = document.createElement('div');
    div.innerHTML = `<p>${user} : ${data}</p>`;
    document.querySelector('#data').appendChild(div);
});
socket.on('disconnect', () => {
    console.log('Disconnected');
});

socket.on('getHistory', (data) => {
    document.querySelector('#data').innerHTML = '';
    const div = document.createElement('div');
    data.forEach((msg) => {
        div.innerHTML += `<p>${msg}</p>`;
    });
    document.querySelector('#data').appendChild(div);
});

socket.on('joinUser', (room, user) => {
    console.log('join room: ' + room + ' user: ' + user);
    const div = document.createElement('div');
    div.innerHTML = `<p>${user} join ${room}</p>`;
    document.querySelector('#data').appendChild(div);
})

socket.on('leaveUser', (room, user) => {
    console.log('leave room: ' + room + ' user: ' + user);
    const div = document.createElement('div');
    div.innerHTML = `<p>${user} leave ${room}</p>`;
    document.querySelector('#data').appendChild(div);
})

let send = () => {
    console.log(messageArea.value);
    //socket.emit('message', `message : ${messageArea.value}`);
    socket.emit('room', roomArea.value, nameUser,  messageArea.value);
}
roomArea.addEventListener('change', (e) => {
    socket.emit('leave', room , nameUser);
    socket.emit('join', e.target.value, nameUser);
    room = e.target.value;
});

nameArea.addEventListener('change', (e) => {
    nameUser = e.target.value;
});
