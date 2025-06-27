window.onload = checkAuth();

const apiUrl = "https://taskify-backend-26et.onrender.com"
// const apiUrl = "http://localhost:3000"

const signupBtn =document.querySelector('#signupSection button')
const signinBtn =document.querySelector('#signinSection button')
const signupNameInput = document.querySelector(".signupForm #nameInput")
const signupUsernameInput = document.querySelector(".signupForm #usernameInput")
const signinUsernameInput = document.querySelector(".loginForm #usernameInput")
const signupPasswordInput = document.querySelector(".signupForm #passwordInput")
const signinPasswordInput = document.querySelector(".loginForm #passwordInput")
const messagePara = document.getElementById('message')

if(signupBtn){
    signupBtn.addEventListener('click', async(e) => {
        e.preventDefault();
        const name = signupNameInput.value;
        const email = signupUsernameInput.value;
        const password = signupPasswordInput.value;
        await fetch(`${apiUrl}/signup`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
            .then((response) => { return response.json().then((data) => {
                return ({status: response.status, data})
            })})
            .then(({status, data}) => {
                if(status == 400 || status == 403){
                    messagePara.classList.remove("postiveMessage")
                    messagePara.innerText = data.error;
                    messagePara.classList.add("negativeMessage")
                }else{
                    messagePara.classList.remove("negativeMessage")
                    messagePara.innerText = "Signup Successful! Please login"
                    messagePara.classList.add("postiveMessage")
                    setTimeout(() => {
                        window.location.href="/login.html"
                    }, 3000)
                }
            })
        
    })
}

if(signinBtn){
    signinBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        const email = signinUsernameInput.value;
        const password = signinPasswordInput.value;
        await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) => { return response.json().then((data) => {
                return ({status: response.status, data})
            })})
            .then(({status, data}) => {
                if(status == 400 || status == 403 || status == 401){
                    messagePara.classList.remove("postiveMessage")
                    messagePara.innerText = data.error;
                    messagePara.classList.add("negativeMessage")
                }else{
                    localStorage.setItem("token", data.token)
                    messagePara.classList.remove("negativeMessage")
                    messagePara.innerText = "Login Successful!"
                    messagePara.classList.add("postiveMessage")
                    setTimeout(() => {
                        window.location.href="/"
                    }, 3000)
                }
            })
    })
}

async function checkAuth(){
    try{
        const token = localStorage.getItem("token")

        await fetch(`${apiUrl}`, {
            method: "GET",
            headers: {
                token: token
            }
        })
            .then((response) => {
                if(response.status != 401){
                    window.location.href="/"
                }
            })
    

    }catch(err){
        console.log(err);
    }   
}

