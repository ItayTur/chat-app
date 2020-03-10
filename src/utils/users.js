const users = []

const addUser = ({ id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Invalid username or room!'
        }
    }

    const exisitingUser = users.find(user => {
        return user.username === username && user.room === room
    })

    if (exisitingUser) {
        return {
            error: 'Username already exist in this room!'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return {user}
}

const removeUser = ( id ) => {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
        return users.splice(userIndex, 1)[0]
    } 
}

const getUser = id => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = room => {
    room = room.trim().toLowerCase()
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}