window.onload = checkAuth();

const apiUrl = "https://taskify-backend-26et.onrender.com"
const signupBtn =document.querySelector('#signupSection button')
const signinBtn =document.querySelector('#signinSection button')
const signupNameInput = document.querySelector(".signupForm #nameInput")
const signupUsernameInput = document.querySelector(".signupForm #usernameInput")
const signinUsernameInput = document.querySelector(".loginForm #usernameInput")
const signupPasswordInput = document.querySelector(".signupForm #passwordInput")
const signinPasswordInput = document.querySelector(".loginForm #passwordInput")

if(signupBtn){
    signupBtn.addEventListener('click', async() => {
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
        }).then(() => window.location.href="/")
    })
}

if(signinBtn){
    signinBtn.addEventListener('click', async () => {
        const email = signinUsernameInput.value;
        const password = signinPasswordInput.value;
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            
        const data = await response.json();

        localStorage.setItem("token", data.token)
        window.location.href="/"
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

