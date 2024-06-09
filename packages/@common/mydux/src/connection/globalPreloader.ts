let preloader
let parent
const findElements = () =>{
    if(!preloader) {
        preloader = document.getElementById ('preloader')!
        parent = preloader.parentElement!
    }
}
export const hidePreloader = () => {
    findElements()
    if(preloader && preloader.parentElement) {
        parent.removeChild(preloader)
    }
}
export const showPreloader = () => {
    findElements()
    if(preloader && !preloader.parentElement ) {
        parent.prepend(preloader)

    }
}
