

async function recupererDonnees(identifiants){

    const chargeUtile = JSON.stringify(identifiants);
    
    await fetch("http://localhost:5678/api/users/login", {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: chargeUtile
    })
    
    .then(response => {
        
        if (response.ok) {
            return response.json()  
        }else{
            alert("Mot de passe ou Email non valide")
            throw new Error('Mot de passe ou email non valide')
        }
    })
    
    .then (data => {
        sessionStorage.setItem("user",identifiants.email)
        sessionStorage.setItem("isUser", "true")
        sessionStorage.setItem("token",data.token)
        window.location.href = "index.html"
    })
    
    .catch(error => {
        console.error('Erreur lors de la requête:', error)
    });

}


let storedData=''
const login = document.querySelector(".login")

login.addEventListener("submit", function(event){
    
    event.preventDefault();
    const identifiants = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value
    }

    recupererDonnees(identifiants)
})
   