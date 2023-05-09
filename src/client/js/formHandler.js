const uiControl = require('./uiControl')

const handleSubmit = async(event) => {
    event.preventDefault()

    const location = document.getElementById('location').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    console.log({location, start, end})

    if(!(location && start && end)){
        alert('Location and date range required.')
        return
    }

    if((new Date(end) - new Date(start))<0){
        alert('End date must be after start date.')
        return
    }

    try {
        const res = await fetch('http://localhost:3001/api/trip', {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({location, start, end})
        })
        const data = await res.json()
        console.log(data)
        await uiControl.updateUi()

    } catch (err) {
        console.error(err);
    }
}

export { handleSubmit }