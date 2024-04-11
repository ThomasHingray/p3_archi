const galleryBDD = await fetch("http://localhost:5678/api/works")
const gallery = await galleryBDD.json()

const galleryContainer = document.querySelector(".gallery")


function trierCategories(categories){

    for (let i=0; i<gallery.length;i++){
        categories.add(gallery[i].category.name)
    }
}

function genererTravaux(gallery){

    for (let i=0; i<gallery.length; i++){
        let galleryElement = document.createElement("figure")
        galleryElement.innerHTML=`<img src="${gallery[i].imageUrl}" alt="${gallery[i].title}"> <figcaption>${gallery[i].title}</figcaption>`
        galleryContainer.appendChild(galleryElement)
    }
}

function genererFiltres(){

    let filtres = document.querySelector(".filtres")
    let categories = new Set()
    trierCategories(categories)
    const category = Array.from(categories)

    for (let i=0; i<category.length; i++){
        let filtreElement = document.createElement("button")
        filtreElement.setAttribute("name",category[i])
        filtreElement.classList += "bouton-filtre"
        filtreElement.textContent=category[i]
        filtres.appendChild(filtreElement)
    }
}

function genererModale(){
    const modaleImage = document.querySelector(".modal-img")
    const modaleWrapper = document.querySelector(".modal-wrapper")
    for (let i=0; i<gallery.length; i++){
        let galleryElement = document.createElement("div")
        galleryElement.innerHTML=`<img src="${gallery[i].imageUrl}" alt="${gallery[i].title}" class="gallery-element"><i class="fa-solid fa-trash-can"></i>`
        modaleImage.appendChild(galleryElement)
    }
    let boutonAjouter = document.createElement("div")
    boutonAjouter.innerHTML=`<button name="ajouter-photo">Ajouter une photo</button>`
    boutonAjouter.classList.add("bouton-ajouter")
    modaleWrapper.appendChild(boutonAjouter)

}


// -----------------Génération de la page---------------------//

genererTravaux(gallery)
genererFiltres()
genererModale()

// -----------------Récupération su SessionStorage---------------------//
if (sessionStorage!==null){
    const isUser = sessionStorage.getItem("isUser")
    const user = sessionStorage.getItem("user")
    
    if (isUser === "true") {
        console.log("Utilisateur connecté:", user)
        
    } else {
        console.log("Aucun utilisateur connecté.")
    }
}

// -----------------Listener des boutons "filtre"---------------------//

let boutonsFiltres = document.querySelectorAll(".bouton-filtre")
let boutonsFiltresArray= Array.from(boutonsFiltres)

boutonsFiltresArray.forEach(function(bouton){
    bouton.addEventListener("click", function (){  
        galleryContainer.textContent=""
        let categorieFiltree = bouton.name
        if (bouton.name === "Tous"){
            genererTravaux(gallery)
        }else{
            let nouvelleCategorie = gallery.filter(function(element){
                return element.category.name === categorieFiltree
            })
            genererTravaux(nouvelleCategorie)
        }
    })
})

