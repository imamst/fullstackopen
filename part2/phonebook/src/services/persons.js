import axios from "axios";

const baseUrl = '/api/persons';

const getAll = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
}

const create = newPerson => {
  return axios.post(baseUrl, newPerson)
    .then(response => response.data)
}

const update = (updatedPersonId, updatedPersonData) => {
  return axios.put(`${baseUrl}/${updatedPersonId}`, updatedPersonData)
    .then(response => response.data)
}

const destroy = personId => {
  return axios.delete(`${baseUrl}/${personId}`)
    .then(response => response.data)
}

export default {
  getAll,
  create,
  update,
  destroy,
}