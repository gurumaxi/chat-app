import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";

export function getUsers() {
    return axios.get(`user`).then(response => response.data);
}

export function saveUser(username, userId = null) {
    return axios.post(`user`, { username, userId }).then(response => response.data);
}

export function getMessages() {
    return axios.get(`message`).then(response => response.data);
}

export function postMessage(message) {
    return axios.post(`message`, message).then(response => response.data);
}

export function deleteLastMessage(userId) {
    return axios.delete(`message/${userId}`).then(response => response.data);
}
