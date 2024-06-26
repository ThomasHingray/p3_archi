 // -----------------Récupérer la galerie enregistrée sur l'API---------------------//

const galleryData = await fetch("http://localhost:5678/api/works")
let gallery = await galleryData.json()

 // -----------------Listing des catégories---------------------//

 const categoriesData = await fetch("http://localhost:5678/api/categories")
 const categories = await categoriesData.json()
  

 // -----------------Définition des variables à récupérer dans le DOM---------------------//


const galleryContainer = document.querySelector(".gallery")
const modifierButton = document.getElementById("modifier-button")
const filters = document.querySelector(".filters")
const modal = document.querySelector(".modal")
const modalWrapper = document.querySelector(".modal-wrapper")
const loginLink = document.getElementById("login-link")
const logoutLink = document.getElementById("logout-link")



 // -----------------Définition des fonctions---------------------//
  // -----------------Génération des travaux enregistrés-------------------//

function fillWorks(gallery){

    galleryContainer.innerHTML=``
    gallery.forEach((element) =>{
        let galleryElement = document.createElement("figure")
        galleryElement.id = "figure"+element.id

        let elementImage = document.createElement("img")
        elementImage.setAttribute("src", element.imageUrl)
        elementImage.setAttribute("alt", element.title)
        
        let figcaption = document.createElement("figcaption")
        figcaption.textContent= element.title

        galleryElement.appendChild(elementImage)
        galleryElement.appendChild(figcaption)

        galleryContainer.appendChild(galleryElement)
    })
}

 // -----------------Génération des filtres---------------------//

function createFilters(){

    for (let i=0; i<categories.length; i++){
        let filterElement = document.createElement("button")
        filterElement.setAttribute("name",categories[i].name)
        filterElement.setAttribute("type","button")
        filterElement.classList += "filter-button"
        filterElement.textContent=categories[i].name
        filters.appendChild(filterElement)
    }
}

 // -----------------Génération de la modale "Supprimer travaux"---------------------//

function fillDeleteModal(){

    modalWrapper.innerHTML=``
// --- Création de chaque élément ---//
    // Création des liens de navigation 
    let nav = document.createElement("nav")
    nav.innerHTML=`<div><i class="fa-solid fa-xmark"></i></div>`

    // Création du titre de la modale
    let title = document.createElement("h3")
    title.textContent="Galerie photo"

    // Création du conteneur d'images
    let modalImageWrapper = document.createElement("div")
    modalImageWrapper.classList.add("modal-img")

    // Ajout des éléments au conteneur de la modale
    modalWrapper.appendChild(nav)
    modalWrapper.appendChild(title)
    modalWrapper.appendChild(modalImageWrapper)

    // Ajout des images au conteneur d'images
    refreshModalImage()

    // Ajout du bouton Ajouter une photo
    let addButton = document.createElement("div")
    addButton.innerHTML=`<button type="button" name="add-photo" id="add-photo">Ajouter une photo</button>`
    addButton.classList.add("add-button")

    modalWrapper.appendChild(addButton)
}

function refreshModalImage(){
    const modalImage = document.querySelector(".modal-img")
    modalImage.innerHTML=``
    // for (let i=0; i<gallery.length; i++){
    //     let galleryElement = document.createElement("div")
    //     galleryElement.innerHTML=`<img src="${gallery[i].imageUrl}" alt="${gallery[i].title}" class="gallery-element"><i class="fa-solid fa-trash-can" id=${gallery[i].id}></i>`
    //     modalImage.appendChild(galleryElement)
    // }

    gallery.forEach((element) =>{
        let galleryElement = document.createElement("div")
        galleryElement.id = "div"+element.id

        let elementImage = document.createElement("img")
        elementImage.setAttribute("src", element.imageUrl)
        elementImage.setAttribute("alt", element.title)
        elementImage.classList.add("gallery-element")
        
        let trashImage = document.createElement("i")
        trashImage.id = element.id
        trashImage.classList.add("fa-solid","fa-trash-can")

        galleryElement.appendChild(elementImage)
        galleryElement.appendChild(trashImage)

        modalImage.appendChild(galleryElement)
    })
}

function displayDeleteModal(){

    fillDeleteModal()
    
    // --- Ajout des Listeners ---//

    const closeModal = document.querySelector(".fa-xmark")
    const deleteButton = document.querySelectorAll(".fa-trash-can")
    const addWorkButton = document.getElementById("add-photo")

    // Fermer la modale
    closeModal.addEventListener("click", function(){
        modal.setAttribute("style","display:none")
    })

    modal.addEventListener("click", function(e){
        if (e.target === modal){
            modal.setAttribute("style","display:none")
        }
    })

    // Ajouter une photo
    addWorkButton.addEventListener("click", function(e){
        e.preventDefault()
        displayAddModal()
    })

    
    // Supprimer un travail
    deleteButton.forEach(function(button){
        const token = "Bearer " + sessionStorage.getItem("token")
        button.addEventListener("click", async function(e){
            let deleteId = e.target.id
            
            await fetch(`http://localhost:5678/api/works/${deleteId}`,{
                method:"DELETE",
                headers:{"authorization" : token}
            })

            // deleteFromGallery(deleteId)
            // fillWorks(gallery)
            document.getElementById("figure"+deleteId).remove()
            document.getElementById("div"+deleteId).remove()
            
        })
    })
}

function deleteFromGallery(deleteId) {
    // Parcourir le tableau pour trouver l'index de l'élément avec l'id donné
    let id = parseInt(deleteId)
    let index = gallery.findIndex(function(element) {
        return element.id === id;
    });
    // Si l'élément est trouvé, le supprimer du tableau
    if (index !== -1) {
        gallery.splice(index, 1);
    }
}


// -----------------Génération de la modale "Ajouter travaux"---------------------//

function fillAddModal(){
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
    form.classList.add("add-form")

    // ----Création de l'input file---//

    // Division qui contiendra l'input File et le placeHolder
    let photoSection = document.createElement("div")
    photoSection.classList.add("photo-section")

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
    labelFile.setAttribute("for","photo-input")

    let inputFile = document.createElement("input")
    inputFile.setAttribute("name","image")
    inputFile.setAttribute("type","file")
    inputFile.setAttribute("accept","image/png, image/jpeg")
    inputFile.setAttribute("id","photo-input")
    inputFile.setAttribute("required","true")

    let info = document.createElement("p")
    info.textContent="jpg, png : 4mo max"

    // Ajout des différents éléments à la section parente
    photoSection.appendChild(display)
    labelFile.appendChild(inputFile)
    inputContainer.appendChild(labelFile)
    inputContainer.appendChild(info)
    photoSection.appendChild(inputContainer)

    // --- Création de l'input Titre---//

    let titleLabel = document.createElement("label")
    titleLabel.textContent="Titre"
    titleLabel.setAttribute("for","title-input")

    let titleInput = document.createElement("input")
    titleInput.setAttribute("name","title")
    titleInput.setAttribute("type","text")
    titleInput.setAttribute("id","title-input")
    titleInput.setAttribute("required","true")

    // --- Création du select Catégorie---//

    let categoryLabel = document.createElement("label")
    categoryLabel.textContent="Catégorie"
    categoryLabel.setAttribute("for","category-select")

    let categorySelect = document.createElement("select")
    categorySelect.setAttribute("name","category")
    categorySelect.setAttribute("id","category-select")
    categorySelect.setAttribute("required","true")

    let placeHolderSelect = document.createElement("option")
    placeHolderSelect.setAttribute("value","")
    placeHolderSelect.setAttribute("selected","true")
    placeHolderSelect.setAttribute("disabled","true")
    categorySelect.appendChild(placeHolderSelect)


    // Génération dynamique des catégories existantes
    for (let i=0; i<categories.length; i++){
        let categoryOption = document.createElement("option")
        categoryOption.setAttribute("value",categories[i].id)
        categoryOption.textContent=categories[i].name
        categorySelect.appendChild(categoryOption)
    }

    // --- Création du bouton Submit---//
    let submitContainer = document.createElement("div")
    submitContainer.classList.add("submit-container")

    let addSubmitButton = document.createElement("button")
    addSubmitButton.setAttribute("type","submit")
    addSubmitButton.classList.add("add-submit-button")
    addSubmitButton.textContent="Valider"

    submitContainer.appendChild(addSubmitButton)

    // --- Ajout de chaque élément au formulaire---//

    form.appendChild(photoSection)
    form.appendChild(titleLabel)
    form.appendChild(titleInput)
    form.appendChild(categoryLabel)
    form.appendChild(categorySelect)
    form.appendChild(submitContainer)

    // --- Remplissage de la modale---//
    modalWrapper.appendChild(nav)
    modalWrapper.appendChild(title)
    modalWrapper.appendChild(form)

}

function displayAddModal(){

    // ----Reboot la modale---//

    modalWrapper.innerHTML=''

    fillAddModal()
    checkInputs()
    
    // --- Création des Listeners---//

    // Retour à la modale de suppression de travaux
    const previous = document.querySelector(".fa-arrow-left")
    previous.addEventListener("click", displayDeleteModal)

    // Fermeture de la modale
    const closeModal = document.querySelector(".fa-xmark")
    closeModal.addEventListener("click", function(){
        modal.setAttribute("style","display:none")
    })

    // Affichage du document sélectionné dans l'input File
    const photoInput = document.getElementById("photo-input")
    photoInput.addEventListener("change",checkFileSize)

    // -----------------Listener de completion du formulaire---------------------//
    let addForm = document.querySelector(".add-form")

    addForm.addEventListener("change",checkInputs)

    // -----------------Listener du formulaire d'ajout de travaux---------------------//

    addForm.addEventListener("submit", async function(event){
        
        event.preventDefault();
        const addFormData = new FormData(addForm)
        const token = "Bearer " + sessionStorage.getItem("token")
        
        try {
            await fetch ("http://localhost:5678/api/works", {
                method:"POST",
                body:addFormData,
                headers: {"Authorization": token}
            })

            .then(response => {
            
                if (response.ok) {
                    modal.setAttribute("style","display:none")
                    return response.json()
                }else{
                    alert("Une erreur est survenue")
                    throw new Error("Une erreur est survenue. Vérifiez les informations entrées et votre connexion internet.")
                }
            })

            .then (data => {
                const newWork = {
                    id : data.id,
                    title : data.title,
                    imageUrl : data.imageUrl,
                    categoryId : data.categoryId,
                    userId : data.userId
                }
                gallery.push(newWork)
                fillWorks(gallery)
            })

        }catch (error){
            console.log(error)
        }
    })
}

// --- Mise à jour de la visualisation de document sélectionné ---//

function checkFileSize() {
    let selectedFile=document.getElementById("photo-input").files

    if (selectedFile.length > 0) {
        let fileSize = selectedFile[0].size; 
        let maxSizeInBytes = 4200000;

        if (fileSize > maxSizeInBytes) {
            alert("La taille du fichier dépasse la limite autorisée.");
            selectedFile.value = ''; 
        }else{
            updateDisplay(selectedFile)
        }
    }
}

function updateDisplay(selectedFile) {
    let inputContainer = document.querySelector(".input-container")
    let imagePlaceholder = document.querySelector(".display")

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

function checkInputs() {
    let inputFile= document.getElementById("photo-input")
    let titleInput = document.getElementById("title-input")
    let categorySelect = document.getElementById("category-select")
    let addSubmitButton = document.querySelector(".add-submit-button")
    console.log(addSubmitButton)

    if (inputFile.value !== '' && titleInput.value.trim() !== '' && categorySelect.value.trim() !== '') {
        addSubmitButton.removeAttribute('disabled');
    } else {
        addSubmitButton.setAttribute('disabled', 'disabled');
    }
  }

// -----------------Génération de la page---------------------//

fillWorks(gallery)
createFilters()

// -----------------Récupération du SessionStorage---------------------//
if (sessionStorage!==null){

    const isUser = sessionStorage.getItem("isUser")
    const user = sessionStorage.getItem("user")
    
    
    if (isUser === "true") {

        modifierButton.classList.remove("display-none")
        filters.classList.add("display-none")
        logoutLink.classList.remove("display-none")
        loginLink.classList.add("display-none")
        
        console.log("Utilisateur connecté:", user)

    } else {

        modifierButton.classList.add("display-none")
        filters.classList.remove("display-none")
        console.log("Aucun utilisateur connecté.")
    }

}

// -----------------Listener des boutons "filtre"---------------------//

let filtersButton = document.querySelectorAll(".filter-button")

// Pour chaque filtre
filtersButton.forEach(function(button){
    button.addEventListener("click", function (){  

        // Nettoyer la galerie
        galleryContainer.textContent=""
        let filteredCategory = button.name

        filtersButton.forEach((element) => element.classList.remove("active"))
        button.classList.add("active")

        // Générer les travaux en fonction de leur catégorie
        if (button.name === "Tous"){
            fillWorks(gallery)
        }else{
            let newCategory = gallery.filter(function(element){
                return element.category.name === filteredCategory
            })
            fillWorks(newCategory)
        }
    })
})

// -----------------Listener du bouton "Modifier"---------------------//

modifierButton.addEventListener("click", function(){
    displayDeleteModal()
    modal.removeAttribute("style")
})

// -----------------Listener du bouton "Logout"---------------------//

logoutLink.addEventListener("click", function(){
    loginLink.classList.remove("display-none")
    logoutLink.classList.add("display-none")
    sessionStorage.clear()
    location.reload()
})
