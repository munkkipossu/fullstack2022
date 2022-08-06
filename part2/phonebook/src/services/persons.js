import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    return axios
        .get(baseUrl)
        .then(response => response.data)
}

const create = newObject => {
    return axios
        .post(baseUrl, newObject)
        .then(response => response.data)
}

const update = newObject => {
    return axios
        .put(`${baseUrl}/${newObject.id}`, newObject)
        .then(response => response.data)
}

const deletePerson = id => {
    return axios
        .delete(`${baseUrl}/${id}`)
        .then(response => {
            console.log(response);
            return response
        })

}

export default {getAll, create, update, deletePerson}