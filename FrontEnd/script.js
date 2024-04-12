const galleryBDD = await fetch("http://localhost:5678/api/works")
const gallery = await galleryBDD.json()

const galleryContainer = document.querySelector(".gallery")
const boutonModifier = document.getElementById("bouton-modifier")
const filtres = document.querySelector(".filtres")
const modale = document.querySelector(".modal")
const modaleWrapper = document.querySelector(".modal-wrapper")

let categories = new Set()
for (let i=0; i<gallery.length;i++){
    categories.add(gallery[i].category.name)
}

const category = Array.from(categories)


function genererTravaux(gallery){

    for (let i=0; i<gallery.length; i++){
        let galleryElement = document.createElement("figure")
        galleryElement.innerHTML=`<img src="${gallery[i].imageUrl}" alt="${gallery[i].title}"> <figcaption>${gallery[i].title}</figcaption>`
        galleryContainer.appendChild(galleryElement)
    }
}

function genererFiltres(){

    for (let i=0; i<category.length; i++){
        let filtreElement = document.createElement("button")
        filtreElement.setAttribute("name",category[i])
        filtreElement.classList += "bouton-filtre"
        filtreElement.textContent=category[i]
        filtres.appendChild(filtreElement)
    }
}


function genererModaleSupprimer(){

    modaleWrapper.innerHTML=``


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
        galleryElement.innerHTML=`<img src="${gallery[i].imageUrl}" alt="${gallery[i].title}" class="gallery-element"><i class="fa-solid fa-trash-can" id=${i}></i>`
        modaleImage.appendChild(galleryElement)
    }

    let boutonAjouter = document.createElement("div")
    boutonAjouter.innerHTML=`<button name="ajouter-photo" id="ajouter-photo">Ajouter une photo</button>`
    boutonAjouter.classList.add("bouton-ajouter")
    modaleWrapper.appendChild(boutonAjouter)


    // -----------------Listener modale---------------------//

    const closeModal = document.querySelector(".fa-xmark")
    const boutonSupprimer = document.querySelectorAll(".fa-trash-can")
    const boutonAjouterPhoto = document.getElementById("ajouter-photo")

    closeModal.addEventListener("click", function(){
        modale.setAttribute("style","display:none")
    })

    boutonAjouterPhoto.addEventListener("click", function(){
        genererModaleAjouter()
    })


    // boutonSupprimer.addEventListener("click", function(){

    // })

}

function genererModaleAjouter(){
    modaleWrapper.innerHTML=''

    let nav = document.createElement("nav")
    nav.innerHTML=`<div><i class="fa-solid fa-xmark"></i></div>
    <div><i class="fa-solid fa-arrow-left"></i></div>`

    // -----------------Création du formulaire---------------------//

    let title = document.createElement("h3")
    title.textContent="Ajout Photo"

    let form = document.createElement("form")
    form.classList.add("ajouter-form")

    // -----------------Création de l'input file---------------------//
    
    let sectionPhoto = document.createElement("div")
    sectionPhoto.classList.add("section-photo")

    let icone = document.createElement("p")
    icone.innerHTML=`<i class="fa-regular fa-image"></i>`

    let labelFile = document.createElement("label")
    labelFile.innerHTML=`<span>+ Ajouter photo</span>`
    labelFile.setAttribute("for","input-photo")

    let inputFile = document.createElement("input")
    inputFile.setAttribute("name","input-photo")
    inputFile.setAttribute("type","file")
    inputFile.setAttribute("accept","image/png, image/jpeg")
    inputFile.setAttribute("id","input-photo")

    let info = document.createElement("p")
    info.textContent="jpg, png : 4mo max"

    labelFile.appendChild(inputFile)
    sectionPhoto.appendChild(icone)
    sectionPhoto.appendChild(labelFile)
    sectionPhoto.appendChild(info)

    // -----------------Création de l'input Titre---------------------//

    let labelTitre = document.createElement("label")
    labelTitre.textContent="Titre"
    labelTitre.setAttribute("for","input-titre")
    
    let inputTitre = document.createElement("input")
    inputTitre.setAttribute("name","input-titre")
    inputTitre.setAttribute("type","text")
    inputTitre.setAttribute("id","input-titre")

    // -----------------Création du select Catégorie---------------------//


    let labelCategorie = document.createElement("label")
    labelCategorie.textContent="Catégorie"
    labelCategorie.setAttribute("for","select-categorie")

    let selectCategorie = document.createElement("select")
    selectCategorie.setAttribute("name","select-categorie")
    selectCategorie.setAttribute("id","select-categorie")

    for (let i=0; i<category.length; i++){
        let optionCategory = document.createElement("option")
        optionCategory.setAttribute("value",category[i])
        optionCategory.textContent=category[i]
        selectCategorie.appendChild(optionCategory)
    }

    // -----------------Ajout du bouton Submit---------------------//

    let boutonValiderAjout = document.createElement("button")
    boutonValiderAjout.setAttribute("type","submit")
    boutonValiderAjout.textContent="Valider"
    

    form.appendChild(sectionPhoto)
    form.appendChild(labelTitre)
    form.appendChild(inputTitre)
    form.appendChild(labelCategorie)
    form.appendChild(selectCategorie)
    

    modaleWrapper.appendChild(nav)
    modaleWrapper.appendChild(title)
    modaleWrapper.appendChild(form)
    modaleWrapper.appendChild(boutonValiderAjout)

    // -----------------Listener modale---------------------//
    const previous = document.querySelector(".fa-arrow-left")
    previous.addEventListener("click", function(){
        genererModaleSupprimer()
    })

    const closeModal = document.querySelector(".fa-xmark")
    closeModal.addEventListener("click", function(){
        modale.setAttribute("style","display:none")
    })
}


// -----------------Génération de la page---------------------//

genererTravaux(gallery)
genererFiltres()
// -----------------Récupération du SessionStorage---------------------//
if (sessionStorage!==null){

    const isUser = sessionStorage.getItem("isUser")
    const user = sessionStorage.getItem("user")
    const token = sessionStorage.getItem("token")
    
    
    if (isUser === "true") {

        boutonModifier.classList.remove("invisible")
        filtres.classList.add("invisible")
        console.log("Utilisateur connecté:", user)

    } else {

        boutonModifier.classList.add("invisible")
        filtres.classList.remove("invisible")
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

boutonModifier.addEventListener("click", function(){
    genererModaleSupprimer()
    modale.removeAttribute("style")
})
