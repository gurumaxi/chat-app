import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";

export function getMessages() {
    return axios.get(`message`).then(response => response.data);
}

export function postMessage(message) {
    return axios.post(`message`, message).then(response => response.data);
}
