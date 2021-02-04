
const myStorage = window.localStorage;
const login_email = document.getElementById('signin-email-text');
const login_password = document.getElementById('signin-password-text')
const login_AsAdmin = document.getElementById('signin-isAdmin-checkbox');
const successLogin = document.getElementsByClassName('successLogIn')[0];
const join_name = document.getElementById('join-name-text')
const join_age = document.getElementById('join-age-text')
const join_email = document.getElementById('join-email-text');
const join_password = document.getElementById('join-password-text')
const successJoin = document.getElementsByClassName('successJoin')[0];


const joinUrl = 'http://localhost:4000/bookshop/create-user'
const loginUrl = 'http://localhost:4000/bookshop/login';
const loginAdminsUrl = 'http://localhost:4000/bookshop/login-admin'
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
    }, 5000)
}

const adminOnline = () => {
    setTimeout(() => {
        window.location.href = 'http://localhost:4000/bookShop-adminPage.html';
    }, 5000)
}

const login = () => {
    const enteredEmail = login_email.value;
    const enteredPassword = login_password.value;
    const signAsAdmin = login_AsAdmin.checked;
    const data = { email: enteredEmail, password: enteredPassword }
    if (!signAsAdmin)
        fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success-User:', data);
                if (data.message) {
                    errorLogin.classList.remove('none')
                    errorLogin.classList.add('block')
                }
                else {
                    localStorage.setItem('connectedUserBooksLength', data.user.myBooks.length)
                    localStorage.setItem('myToken', data.currentToken);
                    console.log(localStorage.getItem('connectedUserBooksLength'))
                    errorLogin.classList.add('none')
                    errorLogin.classList.remove('block')
                    successLogin.className = "successLogIn block";
                    successLogin.innerHTML += `${data.user.name.toUpperCase()}, count till 5 and you'll be in the Home Page `;
                    userOnline();
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    else
        fetch(loginAdminsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {

                console.log('Success-Admin:', data);
                if (data.message) {
                    errorLogin.classList.remove('none')
                    errorLogin.classList.add('block')
                }
                else {
                    errorLogin.classList.add('none')
                    errorLogin.classList.remove('block')
                    successLogin.className = "successLogIn block";
                    successLogin.innerHTML += ` Lord ${data.admin.name.toUpperCase()}, you'll be in the Home Page in a few seconds`;
                    adminOnline();
                    localStorage.setItem('myToken', data.currentToken);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
}

const join = () => {
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
                    const startFromError = data.message.lastIndexOf(':')
                    errorJoin.innerHTML = data.message.slice(startFromError + 1)
                }
            }
            else {
                errorJoin.classList.remove('block')
                errorJoin.classList.add('none')
                successJoin.className = "successJoin block";
                successJoin.innerHTML += `${data.user.name.toUpperCase()}, count till 5 and you'll be in the Home Page `;
                userOnline();
                localStorage.setItem('myToken', data.currentToken);
            }
        })
        .catch((error) => {
            console.log(error)
            errorJoin.classList.remove('none')
            errorJoin.classList.add('block')
            errorJoin.innerHTML = error.message.slice(23)
        });
}

