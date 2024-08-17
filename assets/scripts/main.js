const headerImage = document.querySelector(".header-image");
const images = headerImage.getElementsByTagName("img");
const fIcons = Array.from(document.getElementsByClassName("f-icon"));
const scriptURL = 'https://script.google.com/macros/s/AKfycbxRKUx2gJoSIc70ZxmHrbCNrxxuJ3gpbsCeEbCkO8iUFJ3rLgdOMlFF6tYKWtjeG9xY/exec'
const form = document.forms['contact-form'];

// Make navigator has a solid bg-color
window.onscroll = (e) =>{
    const nav = document.querySelector('nav');
    if (document.documentElement.scrollTop < 200 && nav.classList.contains("bg-full-color")) {
        nav.classList.replace("bg-full-color","bg-transparent");
    }else if (document.documentElement.scrollTop > 200 && nav.classList.contains("bg-transparent")) {
        nav.classList.replace("bg-transparent","bg-full-color");
    }
}

// Lazy loaded profile picture
function loaded(){
    images[0].classList.add("hide-image");
    images[1].classList.remove("hide-image");
}
if (images[0].complete) {
    loaded()
}else{
    images[1].addEventListener("load", loaded)
}
// Animate Functions
function spin(entries){
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            entry.target.classList.add("spin");
        }
    })
}
function translateTop(entries){
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            entry.target.classList.add("translate-top");
        }
    })
}

// Observer
function objObserver(func, items, settings = {
    rootMargin: "0px",
    threshold: 1,
}){
    const observer = new IntersectionObserver(func, settings);
    observer.observe(items);
}

// Call observer
fIcons.forEach((fIcon)=>{
    objObserver(spin, fIcon);
});
objObserver(translateTop, form)

function generateModal(){
    const dialog = document.querySelector("dialog");
    dialog.classList.toggle("open")
    if(dialog.classList.contains("open")){
        dialog.showModal();
    } else if (!dialog.classList.contains("open")){
        dialog.close();
    }
}

// Handle card
function generateCardText(text,position){
    const template = document.querySelector("template#card");
    const projectSection = document.querySelector("section#project-section .b");
    const dialogClose = document.getElementById("dialog-close");
    const childTemplate = template.content.firstElementChild.cloneNode(true);
    const imagePreview = childTemplate.querySelector("img");
    const cardHeader = childTemplate.querySelector(".card-header");
    const moreInfoButton = childTemplate.querySelector(".more-info");
    imagePreview.src = `assets/img/${text.preview}`;
    cardHeader.children[0].textContent = text.title;
    childTemplate.style = `--duration:${position > 3? position -= 1.75:position + 1.5}`;
    moreInfoButton.onclick = generateModal;
    dialogClose.onclick = generateModal;
    projectSection.appendChild(childTemplate);
    objObserver(translateTop, childTemplate);
}

fetch("projects.json")
.then(e => {return e.json()})
.then(jsons => {
    jsons.forEach((text, counter) => generateCardText(text, counter))
});

// Handle form and its notification
function notification(text, status){
    const notify = document.getElementById("notification");
    notify.innerText = text;
    status === true ? notify.classList.add("success"):notify.classList.add("failed");
    setTimeout(() => {
        status === true ? notify.classList.remove("success"):notify.classList.remove("failed");
    }, 5000);
}

// Handle Form submit
form.addEventListener('submit', e => {
    e.preventDefault()
    e.target[e.target.length - 1].textContent = "Loading...";
    e.target[e.target.length - 1].setAttribute("disabled",true);
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            console.log('Success!', response);
            notification("Success", true);
            for (let index = 0; index < e.target.length - 1; index++) {
                e.target[index].value = "";
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            notification("Failed", false);
        })
        .finally(() => {
            e.target[e.target.length - 1].textContent = "Submit";
            e.target[e.target.length - 1].removeAttribute("disabled");
        })
})