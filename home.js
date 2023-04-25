// Fonction pour ajouter un projet dans la galerie
const addProject = (title, imageUrl) => {
    const galleryContent = document.querySelector(".gallery");
    const newFigure = document.createElement("figure");
    const newImage = document.createElement("img");
    const newCaption = document.createElement("figcaption");
    
    newImage.src = imageUrl;
    newCaption.textContent = title;
    
    newFigure.appendChild(newImage);
    newFigure.appendChild(newCaption);
    galleryContent.appendChild(newFigure);

};

// Fonction pour récupérer les projets depuis l'API et les ajouter dans la galerie
const fetchProjects = async () => {
    // Récupérer les projets depuis l'API
    const response = await fetch("http://localhost:5678/api/works");
    const allProjects = await response.json();
    
    // Ajouter chaque projet dans la galerie en appelant la fonction addProject
    allProjects.forEach(({ title, imageUrl }) => {
        addProject(title, imageUrl);
    });
};

// Appeler la fonction fetchProjects pour récupérer et afficher les projets dans la galerie
fetchProjects();

// Fonction pour ajouter une catégorie dans le filtre
const addCategory = (id, name) => {
    const filterContent = document.querySelector(".filterContent");
    const newFilter = document.createElement("a");
    newFilter.classList.add("filter_item");
    newFilter.setAttribute("data-categoryId", id);
    newFilter.textContent = name;
    
    filterContent.appendChild(newFilter);
    
    // Ajouter l'écouteur d'événement pour le filtrage des projets
    newFilter.addEventListener("click", async (event) => {
        event.preventDefault();
        
        const allLinks = document.querySelectorAll('.filter_item');
        allLinks.forEach(link => {
            link.classList.remove('active');
        })
        event.target.classList.add('active');
        
        // Récupérer tous les projets depuis l'API
        const response = await fetch("http://localhost:5678/api/works");
        const allProjects = await response.json();
        console.log(id);
        // Filtrer les projets en fonction de l'ID de la catégorie sélectionnée
        const filteredProjects = (id === 0) ? allProjects : allProjects.filter(
            (project) => project.categoryId == id
            );
            const galleryContent = document.querySelector(".gallery");
            galleryContent.innerHTML = "";
            
            // Ajouter les projets filtrés dans la galerie
            filteredProjects.forEach(({ title, imageUrl }) => {
                addProject(title, imageUrl);
            });
            console.log(filteredProjects);
        });
    };

    const fillSelectCategories = (id,name) => {
        const select = document.querySelector('#category');
        const option = document.createElement('option');
        option.value = id;
        option.innerText = name;
        select.appendChild(option);
    };
    
    // Fonction pour récupérer les catégories depuis l'API et les ajouter dans le filtre
    const fetchCategories = async () => {
        // Ajouter la catégorie "Tous" avec l'ID 0
        addCategory(0, "Tous");
        
        // Récupérer les catégories depuis l'API
        const response = await fetch("http://localhost:5678/api/categories");
        const allCategories = await response.json();
        
        // Ajouter chaque catégorie dans le filtre
        allCategories.forEach(({ id, name }) => {
            addCategory(id, name);
            fillSelectCategories(id, name);
        });
    };

    const firstModal = document.querySelectorAll('.modal_wrapper')[0];
    const secondModal = document.querySelectorAll('.modal_wrapper')[1];
    const modal = document.querySelector('.modal');
    //Fonction pour afficher la modal
    const showModal = (modal,wrapper) => {

        firstModal.style.display = 'none';
        secondModal.style.display = 'none';

        modal.style.display = 'flex';
        wrapper.style.display = 'block';
    };
    
    // Appeler la fonction fetchCategories pour récupérer et afficher les catégories dans le filtre
    fetchCategories();
    
    
    // Sélection des éléments DOM nécessaires pour la modal
    const modalWrapper = document.querySelector('.modal_wrapper');
    const openModal = document.querySelector('.open_modal');
    const closeModal = modal.querySelector('.js-close-modal');
    
    // Ajout d'un écouteur d'événement pour le clic sur l'élément openModal
    openModal.addEventListener('click', e => {
        // Empêcher le comportement par défaut du clic (par exemple, empêcher le suivi d'un lien)
        e.preventDefault();
        // Changer le style d'affichage de l'élément modal en 'flex' pour le rendre visible
        showModal(modal,firstModal);
});

// Ajout d'un écouteur d'événement pour le clic sur l'élément modal
modal.addEventListener('click', e => {
    // Empêcher le comportement par défaut du clic (par exemple, empêcher le suivi d'un lien)
    e.preventDefault();
    // Définir l'attribut aria-hidden de la modal sur 'true' pour la cacher
    modal.setAttribute('aria-hidden', 'true');
    // Changer le style d'affichage de l'élément modal en 'none' pour la cacher
    modal.style.display = 'none';
});

// Ajout d'un écouteur d'événement pour le clic sur l'élément modalWrapper
firstModal.addEventListener('click', e => {
    // Empêcher la propagation de l'événement (pour éviter que la modal ne se ferme lorsque l'on clique à l'intérieur)
    e.stopPropagation();
});

// Ajout d'un écouteur d'événement pour le clic sur l'élément modalWrapper
secondModal.addEventListener('click', e => {
    // Empêcher la propagation de l'événement (pour éviter que la modal ne se ferme lorsque l'on clique à l'intérieur)
    e.stopPropagation();
});

// Ajout d'un écouteur d'événement pour le clic sur l'élément closeModal
closeModal.addEventListener('click', e => {
    // Empêcher le comportement par défaut du clic (par exemple, empêcher le suivi d'un lien)
    e.preventDefault();
    // Définir l'attribut aria-hidden de la modal sur 'true' pour la cacher
    modal.setAttribute('aria-hidden', 'true');
    // Changer le style d'affichage de l'élément modal en 'none' pour la cacher
    modal.style.display = 'none';
});

// Si un token d'authentification est présent dans le stockage local
// Changer le style d'affichage de l'élément openModal en 'block' pour le rendre visible
if(localStorage.getItem('token')){
    openModal.style.display = 'block';
}


const addImageModal = async (imageUrl) => {
    const apiUrl = "http://localhost:5678/api/works/";
    const token = localStorage.getItem("token");
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ imageUrl })
    });
    return response.json();
};


const deleteProject = async (id) => {
    const apiUrl = "http://localhost:5678/api/works/" + id;
    const token = localStorage.getItem("token");
    const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return response.json();
};

const addProjectModal = ({ imageUrl, id }) => {
    const modalGallery = document.querySelector(".modal_gallery");

    const imgContent = document.createElement("div");
    imgContent.classList.add("content_img");

    const image = document.createElement("img");
    image.src = imageUrl;

    const textModal = document.createElement("p");
    textModal.innerText = 'éditer';

    const contentIconMove = document.createElement("div");
    contentIconMove.classList.add("content-icons");

    const contentIconDelete = document.createElement("div");
    contentIconDelete.classList.add("content_delete");
    contentIconDelete.setAttribute("data-projectId", id);

    const iconMove = document.createElement("i");
    const iconDelete = document.createElement("i");

    contentIconDelete.addEventListener('click', (e) => {
        const projectId = e.currentTarget.getAttribute("data-projectId");
        deleteProject(projectId);
        console.log(projectId);
    })
    
    iconMove.classList.add("fa-solid", "fa-arrows-up-down-left-right");
    iconDelete.classList.add("fa-solid","fa-trash-can");

    contentIconMove.appendChild(iconMove);
    contentIconDelete.appendChild(iconDelete);
    

    imgContent.appendChild(image);
    imgContent.appendChild(textModal);
    imgContent.appendChild(contentIconMove);
    imgContent.appendChild(contentIconDelete);

    modalGallery.appendChild(imgContent);
};


const fetchModal = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const allProjects = await response.json();
        console.log("allProjects", allProjects);
        allProjects.forEach((project) => {
            addProjectModal(project);
        });
    } catch (error) {
        console.error(error);
    }
};


const btnAdd = document.querySelector('.btn_add');


btnAdd.addEventListener('click', async () => {
    showModal(modal,secondModal);
});


fetchModal();

function showAuthElement(classElement){
    const authElements = document.querySelectorAll('.'+classElement);
    authElements.forEach((element) => {
        element.style.display = "block";
    });
}

showAuthElement('is_auth');


function addProjectForm() {
    let formData = new FormData();
    const title = document.querySelector('#title');
    const category = document.querySelector('#category');
    const file = document.querySelector('#file');
  
    formData.append('title', title.value);
    formData.append('category', category.value);
    formData.append('image', file.files[0]);
  
    return formData;
  }
  
   function addNewProject(dataForm) {
    const token = localStorage.getItem("token");
    const url = "http://localhost:5678/api/works"; 
  
    const response = fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: dataForm
    })
    .then(function(response){
        return response.json();
    })
    .catch(function(error){
        console.error(error);
    })
  
  }
  
  const bntAddProject = document.querySelector('#bntAddProject');
  
  bntAddProject.addEventListener('click', async (e) => {
    e.preventDefault();
    const dataForm = addProjectForm();
    const response =  addNewProject(dataForm);
    console.log(response);
  });