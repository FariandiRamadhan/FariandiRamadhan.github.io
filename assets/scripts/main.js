window.onscroll = (e) =>{
    const nav = document.querySelector('nav');
    if (document.documentElement.scrollTop < 200 && nav.classList.contains("bg-full-color")) {
        nav.classList.replace("bg-full-color","bg-transparent");
    }else if (document.documentElement.scrollTop > 200 && nav.classList.contains("bg-transparent")) {
        nav.classList.replace("bg-transparent","bg-full-color");
    }
}