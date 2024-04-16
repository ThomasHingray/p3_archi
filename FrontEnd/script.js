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

    // Nettoyage du contenu de la modale
    modaleWrapper.innerHTML=``

    // --- Création de chaque élément ---//
    // Création des liens de navigation 
    let nav = document.createElement("nav")
    nav.innerHTML=`<div><i class="fa-solid fa-xmark"></i></div>`

    // Création du titre de la modale
    let title = document.createElement("h3")
    title.textContent="Galerie photo"

    // Création du conteneur d'images
    let modaleImageWrapper = document.createElement("div")
    modaleImageWrapper.classList.add("modal-img")

    // Ajout des éléments au conteneur de la modale
    modaleWrapper.appendChild(nav)
    modaleWrapper.appendChild(title)
    modaleWrapper.appendChild(modaleImageWrapper)

    // Ajout des images au conteneur d'images
    const modaleImage = document.querySelector(".modal-img")
    for (let i=0; i<gallery.length; i++){
        let galleryElement = document.createElement("div")
        galleryElement.innerHTML=`<img src="${gallery[i].imageUrl}" alt="${gallery[i].title}" class="gallery-element"><i class="fa-solid fa-trash-can" id=${gallery[i].id}></i>`
        modaleImage.appendChild(galleryElement)
    }

    // Ajout du bouton Ajouter une photo
    let boutonAjouter = document.createElement("div")
    boutonAjouter.innerHTML=`<button name="ajouter-photo" id="ajouter-photo">Ajouter une photo</button>`
    boutonAjouter.classList.add("bouton-ajouter")

    modaleWrapper.appendChild(boutonAjouter)


    // --- Ajout des Listeners ---//

    const closeModal = document.querySelector(".fa-xmark")
    const boutonSupprimer = document.querySelectorAll(".fa-trash-can")
    const boutonAjouterPhoto = document.getElementById("ajouter-photo")

    // Fermer la modale
    closeModal.addEventListener("click", function(){
        modale.setAttribute("style","display:none")
    })

    modale.addEventListener("click", function(e){
        if (e.target===modaleWrapper || modaleWrapper.contains(e.target)){
            return;
        }else{
            modale.setAttribute("style","display:none")
        }
    })

    // Ajouter une photo
    boutonAjouterPhoto.addEventListener("click", function(){
        genererModaleAjouter()
    })

    // Supprimer un travail
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

// -----------------Génération de la modale "Ajouter travaux"---------------------//

function genererModaleAjouter(){

    // ----Vider la modale---//

    modaleWrapper.innerHTML=''

    // ----- Création des éléments de navigation-----//

    let nav = document.createElement("nav")
    nav.innerHTML=`<div><i class="fa-solid fa-xmark"></i></div>
    <div><i class="fa-solid fa-arrow-left"></i></div>`

    // ----Création du formulaire---//

    // Titre de la modale
    let title = document.createElement("h3")
    title.textContent="Ajout Photo"

    // Formulaire
    let form = document.createElement("form")
    form.classList.add("ajouter-form")

    // ----Création de l'input file---//

    // Division qui contiendra l'input File et le placeHolder
    let sectionPhoto = document.createElement("div")
    sectionPhoto.classList.add("section-photo")

    // Division qui contiendra le placeHolder
    let display = document.createElement("div")
    display.classList.add("display")
    display.innerHTML=`<i class="fa-regular fa-image"></i>`

    // Division qui contiendra l'input File
    let inputContainer = document.createElement("div")
    inputContainer.classList.add("input-container")

    // Création du Label, de l'input File et de l'indication 
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

    // Ajout des différents éléments à la section parente
    sectionPhoto.appendChild(display)
    labelFile.appendChild(inputFile)
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

    // Génération dynamique des catégories existantes
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
    
    // --- Remplissage de la modale---//
    modaleWrapper.appendChild(nav)
    modaleWrapper.appendChild(title)
    modaleWrapper.appendChild(form)

    // --- Création des Listeners---//

    // Retour à la modale de suppression de travaux
    const previous = document.querySelector(".fa-arrow-left")
    previous.addEventListener("click", function(){
        genererModaleSupprimer()
    })

    // Fermeture de la modale
    const closeModal = document.querySelector(".fa-xmark")
    closeModal.addEventListener("click", function(){
        modale.setAttribute("style","display:none")
    })

    // Affichage du document sélectionné dans l'input File
    const inputPhoto = document.getElementById("input-photo")
    inputPhoto.addEventListener("change",updateDisplay)


    // -----------------Listener du formulaire d'ajout de travaux---------------------//

    let ajouterForm = document.querySelector(".ajouter-form")

    ajouterForm.addEventListener("submit", function(event){
        
        event.preventDefault();
        const ajouterFormData = new FormData(ajouterForm)
        const token = "Bearer " + sessionStorage.getItem("token")
        
        fetch ("http://localhost:5678/api/works", {
            method:"POST",
            body:ajouterFormData,
            headers: {"Authorization": token}
        })
    })
}

// --- Mise à jour de la visualisation de document sélectionné ---//

function updateDisplay() {
    let inputContainer = document.querySelector(".input-container")
    let imagePlaceholder = document.querySelector(".display")
    let selectedFile = document.getElementById("input-photo").files

    //Si un document a été sélectionné
    if (selectedFile.length !== 0) {
        
        //Vider le placeHolder
        imagePlaceholder.innerHTML=``

        // Générer une image à partir du contenu de l'input File
        let image = document.createElement("img")
        image.src=window.URL.createObjectURL(selectedFile[0])
        image.id="selected-image"
        image.setAttribute("name",selectedFile[0].name)

        //Ajouter l'image au placeHolder
        imagePlaceholder.appendChild(image)
        
        // Masquer l'input File
        inputContainer.classList.add("invisible")
    }
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

// Pour chaque filtre
boutonsFiltresArray.forEach(function(bouton){
    bouton.addEventListener("click", function (){  

        // Nettoyer la galerie
        galleryContainer.textContent=""
        let categorieFiltree = bouton.name

        // Générer les travaux en fonction de leur catégorie
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

