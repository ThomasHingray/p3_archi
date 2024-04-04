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


genererTravaux(gallery)
genererFiltres()

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
            console.log(nouvelleCategorie)
            genererTravaux(nouvelleCategorie)
        }
    })
})