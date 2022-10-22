const User = require('../models/user')

const initialUsers = [
    {
        username: 'fool',
        password: 'merrywillneverthinkofthis',
        name: 'Peregrin Took'
    },
    {
        username: 'merry',
        password: 'hahiamsosmart',
        name: 'Meriadoc Brandybuck'
    },
]

module.exports = {
    initialUsers
}