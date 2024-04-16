// -----------------Fonction Connexion---------------------//
async function connexion(identifiants){

    try{
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
                alert("Erreur dans l'identifiant ou le mot de passe")
                throw new Error("Erreur dans l'identifiant ou le mot de passe")
            }
        })
        
        .then (data => {
            sessionStorage.setItem("user",identifiants.email)
            sessionStorage.setItem("isUser", "true")
            sessionStorage.setItem("token",data.token)
            window.location.href = "index.html"
        })
    }catch(error){
        console.log(error)
    }
}

// -----------------Listener du bouton "Connexion"---------------------//
let storedData=''
const loginForm = document.querySelector(".login")

loginForm.addEventListener("submit", function(event){
    
    event.preventDefault();
    const identifiants = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value
    }

    connexion(identifiants)
})
   