let token

function recupererLogin(identifiants){
    const chargeUtile = JSON.stringify(identifiants);
    
    fetch("http://localhost:5678/api/users/login", {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: chargeUtile
    })

    .then(async response =>{
        if (response.ok) {
            return response.json()
        } else if (response.status=== 401){
            throw new Error(`Mot de passe ou adresse non valide`)
        } else {
            const err = await response.json()
            throw new Error(`${err.message}`)
        }
    })
    .then(data => {
        token = resolve(data)
    })
    .catch(error => {
        console.error(error.message)
    })    
}







const login = document.querySelector(".login")


login.addEventListener("submit",function(event){
    event.preventDefault()
    const identifiants = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        }
    recupererLogin(identifiants)
    console.log(token)
})
