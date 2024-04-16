 // -----------------Récupérer la galerie enregistrée sur l'API---------------------//

const galleryBDD = await fetch("http://localhost:5678/api/works")
const gallery = await galleryBDD.json()

 // -----------------Listing des catégories---------------------//

 const categoriesBDD = await fetch("http://localhost:5678/api/categories")
 const categories = await categoriesBDD.json()
  

 // -----------------Définition des variables à récupérer dans le DOM---------------------//


const galleryContainer = document.querySelector(".gallery")
const boutonModifier = document.getElementById("bouton-modifier")
const filtres = document.querySelector(".filtres")
const modale = document.querySelector(".modal")
const modaleWrapper = document.querySelector(".modal-wrapper")



 // -----------------Définition des fonctions---------------------//
  // -----------------Génération des travaux enregistrés-------------------//

function genererTravaux(gallery){

    for (let i=0; i<gallery.length; i++){
        let galleryElement = document.createElement("figure")
        galleryElement.innerHTML=`<img src="${gallery[i].imageUrl}" alt="${gallery[i].title}"> <figcaption>${gallery[i].title}</figcaption>`
        galleryContainer.appendChild(galleryElement)
    }
}

 // -----------------Génération des filtres---------------------//

function genererFiltres(){

    for (let i=0; i<categories.length; i++){
        let filtreElement = document.createElement("button")
        filtreElement.setAttribute("name",categories[i].name)
        filtreElement.classList += "bouton-filtre"
        filtreElement.textContent=categories[i].name
        filtres.appendChild(filtreElement)
    }
}

 // -----------------Génération de la modale "Supprimer travaux"---------------------//


function genererModaleSupprimer(){

    modaleWrapper.innerHTML=``

    // --- Création de chaque élément ---//

    let nav = document.createElement("nav")
    nav.innerHTML=`<div><i class="fa-solid fa-xmark"></i></div>`

    let title = document.createElement("h3")
    title.textContent="Galerie photo"

    let modaleImageWrapper = document.createElement("div")
    modaleImageWrapper.classList.add("modal-img")

    modaleWrapper.appendChild(nav)
    modaleWrapper.appendChild(title)
    modaleWrapper.appendChild(modaleImageWrapper)

    const modaleImage = document.querySelector(".modal-img")
    for (let i=0; i<gallery.length; i++){
        let galleryElement = document.createElement("div")
        galleryElement.innerHTML=`<img src="${gallery[i].imageUrl}" alt="${gallery[i].title}" class="gallery-element"><i class="fa-solid fa-trash-can" id=${gallery[i].id}></i>`
        modaleImage.appendChild(galleryElement)
    }

    let boutonAjouter = document.createElement("div")
    boutonAjouter.innerHTML=`<button name="ajouter-photo" id="ajouter-photo">Ajouter une photo</button>`
    boutonAjouter.classList.add("bouton-ajouter")

    modaleWrapper.appendChild(boutonAjouter)


    // --- Ajout des Listeners ---//

    const closeModal = document.querySelector(".fa-xmark")
    const boutonSupprimer = document.querySelectorAll(".fa-trash-can")
    const boutonAjouterPhoto = document.getElementById("ajouter-photo")

    closeModal.addEventListener("click", function(){
        modale.setAttribute("style","display:none")
    })

    boutonAjouterPhoto.addEventListener("click", function(){
        genererModaleAjouter()
    })

    boutonSupprimer.forEach(function(bouton){
        const token = "Bearer " + sessionStorage.getItem("token")
        bouton.addEventListener("click", function(e){
        let supprimerId = e.target.id
        
        fetch(`http://localhost:5678/api/works/${supprimerId}`,{
            method:"DELETE",
            headers:{"authorization" : token}
        })

        })

    })
}

function genererModaleAjouter(){

    modaleWrapper.innerHTML=''

    // ----- Création des éléments de navigation-----//

    let nav = document.createElement("nav")
    nav.innerHTML=`<div><i class="fa-solid fa-xmark"></i></div>
    <div><i class="fa-solid fa-arrow-left"></i></div>`

    // ----Création du formulaire---//

    let title = document.createElement("h3")
    title.textContent="Ajout Photo"

    let form = document.createElement("form")
    form.classList.add("ajouter-form")

    // ----Création de l'input file---//
    
    let sectionPhoto = document.createElement("div")
    sectionPhoto.classList.add("section-photo")

    let display = document.createElement("div")
    display.classList.add("display")
    display.innerHTML=`<i class="fa-regular fa-image"></i>`

    let inputContainer = document.createElement("div")
    inputContainer.classList.add("input-container")

    let labelFile = document.createElement("label")
    labelFile.innerHTML=`<span>+ Ajouter photo</span>`
    labelFile.setAttribute("for","input-photo")

    let inputFile = document.createElement("input")
    inputFile.setAttribute("name","image")
    inputFile.setAttribute("type","file")
    inputFile.setAttribute("accept","image/png, image/jpeg")
    inputFile.setAttribute("id","input-photo")

    let info = document.createElement("p")
    info.textContent="jpg, png : 4mo max"

    labelFile.appendChild(inputFile)
    sectionPhoto.appendChild(display)
    inputContainer.appendChild(labelFile)
    inputContainer.appendChild(info)
    sectionPhoto.appendChild(inputContainer)

    // --- Création de l'input Titre---//

    let labelTitre = document.createElement("label")
    labelTitre.textContent="Titre"
    labelTitre.setAttribute("for","input-titre")
    
    let inputTitre = document.createElement("input")
    inputTitre.setAttribute("name","title")
    inputTitre.setAttribute("type","text")
    inputTitre.setAttribute("id","input-titre")

    // --- Création du select Catégorie---//


    let labelCategorie = document.createElement("label")
    labelCategorie.textContent="Catégorie"
    labelCategorie.setAttribute("for","select-categorie")

    let selectCategorie = document.createElement("select")
    selectCategorie.setAttribute("name","category")
    selectCategorie.setAttribute("id","select-categorie")

    for (let i=0; i<categories.length; i++){
        let optionCategory = document.createElement("option")
        optionCategory.setAttribute("value",categories[i].id)
        optionCategory.textContent=categories[i].name
        selectCategorie.appendChild(optionCategory)
    }

    // --- Création du bouton Submit---//

    let boutonValiderAjout = document.createElement("button")
    boutonValiderAjout.setAttribute("type","submit")
    boutonValiderAjout.textContent="Valider"
    
    // --- Ajout de chaque élément au formulaire---//

    form.appendChild(sectionPhoto)
    form.appendChild(labelTitre)
    form.appendChild(inputTitre)
    form.appendChild(labelCategorie)
    form.appendChild(selectCategorie)
    form.appendChild(boutonValiderAjout)
    

    modaleWrapper.appendChild(nav)
    modaleWrapper.appendChild(title)
    modaleWrapper.appendChild(form)

    // --- Création des Listeners---//

    const previous = document.querySelector(".fa-arrow-left")
    previous.addEventListener("click", function(){
        genererModaleSupprimer()
    })

    const closeModal = document.querySelector(".fa-xmark")
    closeModal.addEventListener("click", function(){
        modale.setAttribute("style","display:none")
    })

    const inputPhoto = document.getElementById("input-photo")
    inputPhoto.addEventListener("change",updateDisplay)


    // -----------------Listener du formulaire d'ajout de travaux---------------------//

    let ajouterForm = document.querySelector(".ajouter-form")

    ajouterForm.addEventListener("submit", function(event){
        
        event.preventDefault();
        const ajouterFormData = new FormData(ajouterForm)
        const token = "Bearer " + sessionStorage.getItem("token")
        
        for (const entry of ajouterFormData.entries()){
            console.log(entry[0], entry[1])
        }
        
        fetch ("http://localhost:5678/api/works", {
            method:"POST",
            body:ajouterFormData,
            headers: {"Authorization": token}
        })
        
        .then (res => res.json())
        .then (res => console.log(res))
      
    })

    

}

// --- Mise à jour de la visualisation de document sélectionné ---//

function updateDisplay() {
    let inputContainer = document.querySelector(".input-container")
    let inputPhoto = document.getElementById("input-photo")
    let imagePlaceholder = document.querySelector(".display")
    let selectedFile = inputPhoto.files

    if (selectedFile.length !== 0) {
        
        imagePlaceholder.innerHTML=``
        let image = document.createElement("img")
        image.src=window.URL.createObjectURL(selectedFile[0])
        image.id="selected-image"
        image.setAttribute("name",selectedFile[0].name)
        imagePlaceholder.appendChild(image)
        // document.getElementById("input-photo").disabled = true

        inputContainer.classList.add("invisible")

    }
}

function envoyerNouveauTravail(parametres){
    const chargeUtile = JSON.stringify(parametres);
    
    fetch("http://localhost:5678/api/users/login", {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: chargeUtile
    })
}

// -----------------Génération de la page---------------------//

genererTravaux(gallery)
genererFiltres()

// -----------------Récupération du SessionStorage---------------------//
if (sessionStorage!==null){

    const isUser = sessionStorage.getItem("isUser")
    const user = sessionStorage.getItem("user")
    
    
    if (isUser === "true") {

        boutonModifier.classList.remove("display-none")
        filtres.classList.add("display-none")
        console.log("Utilisateur connecté:", user)

    } else {

        boutonModifier.classList.add("display-none")
        filtres.classList.remove("display-none")
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

// -----------------Listener du bouton "Modifier"---------------------//

boutonModifier.addEventListener("click", function(){
    genererModaleSupprimer()
    modale.removeAttribute("style")
})

