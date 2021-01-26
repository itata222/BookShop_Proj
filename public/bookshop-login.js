
const myStorage = window.localStorage;
const login_email = document.getElementById('signin-email-text');
const login_password = document.getElementById('signin-password-text')
const successLogin = document.getElementsByClassName('successLogIn')[0];
const join_name = document.getElementById('join-name-text')
const join_age = document.getElementById('join-age-text')
const join_email = document.getElementById('join-email-text');
const join_password = document.getElementById('join-password-text')
const successJoin = document.getElementsByClassName('successJoin')[0];
const logout = document.getElementById('logout')

const joinUrl = 'http://localhost:4000/bookshop/create-user'
const loginUrl = 'http://localhost:4000/bookshop/login';
const logoutUrl = 'http://localhost:4000/bookshop/logout'
const deleteMyAccountUrl = 'http://localhost:4000/bookshop/delete-user';
const adminAddBookUrl = 'http://localhost:4000/bookshop/admins/create-book';
const adminEditBookUrl = 'http://localhost:4000/bookshop/admins/edit-book?id=';

const signInForm = document.getElementById('signInForm');
const JoinForm = document.getElementById('joinForm');
const errorLogin = document.getElementsByClassName('errorLogin')[0];
const errorJoin = document.getElementsByClassName('errorJoin')[0];


signInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    login();
    login_email.value = "";
    login_password.value = "";
})
JoinForm.addEventListener('submit', (event) => {
    event.preventDefault()
    join();

})


const userOnline = () => {
    setTimeout(() => {
        window.location.href = 'http://localhost:4000/bookShop-home.html';
    }, 2000)
}

const adminOnline = () => {
    setTimeout(() => {
        window.location.href = 'http://localhost:4000/bookShop-home.html';
    }, 20000)
}


const login = () => {
    const enteredEmail = login_email.value;
    const enteredPassword = login_password.value;
    const data = { email: enteredEmail, password: enteredPassword }
    console.log('you try to sign in')
    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.message) {
                errorLogin.classList.remove('none')
                errorLogin.classList.add('block')
            }
            else {
                if (data.user.isAdmin === true) {
                    errorLogin.classList.add('none')
                    errorLogin.classList.remove('block')
                    successLogin.className = "successLogIn block";
                    successLogin.innerHTML += ` Lord ${data.user.name.toUpperCase()}, you'll be in the Home Page in a few seconds`;
                    adminOnline()
                }
                else {
                    errorLogin.classList.add('none')
                    errorLogin.classList.remove('block')
                    successLogin.className = "successLogIn block";
                    successLogin.innerHTML += `${data.user.name.toUpperCase()}, count till 5 and you'll be in the Home Page `;
                    userOnline();
                }
                localStorage.setItem('myToken', data.currentToken);
                localStorage.setItem('isAdmin', data.user.isAdmin);
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
}

const join = () => {
    console.log('you try to sign up')

    const enteredName = join_name.value;
    const enteredAge = join_age.value;
    const enteredEmail = join_email.value;
    const enteredPassword = join_password.value;
    const data = { name: enteredName, age: enteredAge, email: enteredEmail, password: enteredPassword };
    fetch(joinUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.message) {
                errorJoin.classList.remove('none')
                errorJoin.classList.add('block')
                if (data.message.includes('E11000')) {
                    errorJoin.innerHTML = "Email already in use..."
                }
                else {
                    const startFromError = data.user.message.lastIndexOf(':')
                    errorJoin.innerHTML = data.user.message.slice(startFromError + 1)
                }
            }
            else {
                if (data.user.isAdmin === true) {
                    errorJoin.classList.remove('block')
                    errorJoin.classList.add('none')
                    adminOnline()
                }
                else {
                    errorJoin.classList.remove('block')
                    errorJoin.classList.add('none')
                    successJoin.className = "successLogIn block";
                    successJoin.innerHTML += `${data.user.name.toUpperCase()}, count till 5 and you'll be in the Home Page `;
                    userOnline();
                }
                localStorage.setItem('myToken', data.currentToken);
                localStorage.setItem('isAdmin', data.user.isAdmin);
            }
        })
        .catch((error) => {
            errorJoin.classList.remove('none')
            errorJoin.classList.add('block')
            errorJoin.innerHTML = error.message.slice(23)
            console.log('Error:', error);
        });
}

const logoutFunc = () => {
    const token = loggedToken;
    fetch(logoutUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = 'http://localhost:4000/bookShop-home.html';
        })
        .catch((error) => {
            alert('Error:', error);
        });
}
logout.addEventListener('click', logoutFunc)

