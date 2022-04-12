import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";

export function getUsers() {
    return axios.get(`user`).then(response => response.data);
}

export function postUser(username) {
    return axios.post(`user`, { username, typing: false });
}

export function updateNickname(userId, username) {
    return axios.put(`user`, { userId, username });
}

export function getMessages() {
    return axios.get(`message`).then(response => response.data);
}

export function postMessage(message) {
    return axios.post(`message`, message);
}

export function deleteLastMessage(userId) {
    return axios.delete(`message/${userId}`);
}

export function fadeLastMessage(userId) {
    return axios.put(`fade-message`, { userId });
}
