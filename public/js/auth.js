
const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-node-loren.herokuapp.com/api/auth/';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value;
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp =>{
            if(resp.ok) {
                return resp.json();
            }            
            throw new Error('fallo en la autenticación');
        })
        .then(({token}) => {
            console.log(token);
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => alert(err));

});

function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const body = { id_token: response.credential };

    fetch(url + 'google', { // URL del server actual
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({ token, user }) => {
            console.log(token);
            localStorage.setItem('email', user.email);
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);

}

const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}