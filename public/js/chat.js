const socket = io()

// Elments
const $sendBtn = document.querySelector('#send')
const $input = document.querySelector('#textInput')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#chat__sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})

const auroScroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of message container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled ?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    const createdAt = moment(message.createdAt).format('H:mm')
    const html = Mustache.render(messageTemplate, { message: message.text, createdAt, username: message.username })
    $messages.insertAdjacentHTML('beforeend', html)
    auroScroll()
})

socket.on('locationMessage', (location) => {
    const createdAt = moment(location.createdAt).format('H:mm')
    const html = Mustache.render(locationTemplate, {locationUrl: location.url, createdAt, username: location.username})
    $messages.insertAdjacentHTML('beforeend', html)
    auroScroll()
})

$sendBtn.addEventListener('click', event => {
    event.preventDefault()
    $sendBtn.setAttribute("disabled","disabled")

    // disable
    const message = $input.value


    socket.emit('messageSent', message, (error) => {
        // enable
        $sendBtn.removeAttribute('disabled')
        $input.value = ''
        $input.focus()
        if (error) {
            return console.log(error)
        }

        console.log('message delivered')
    });
    console.log(event.target.value)
    event.target = '';
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {users, room})
    $sidebar.innerHTML = html
})


$sendLocation.addEventListener('click', event => {
    event.preventDefault()
    $sendLocation.setAttribute('disabled', 'disabled');
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser') 
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const location = { latitude: position.coords.latitude, longitude: position.coords.longitude}
        socket.emit('sendLocation', location, () => {
            $sendLocation.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})