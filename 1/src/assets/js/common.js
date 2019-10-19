export function addLess(href) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/less')
    link.setAttribute("href", href);
    link.setAttribute('crossorigin', "anonymous")
    document.getElementsByTagName('head')[0].appendChild(link)
}
export function addCss(href) {
    console.log(href, "hrefffff");
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', href)
    document.getElementsByTagName('head')[0].appendChild(link)
}

export function removeCss(href) {
    const links = document.getElementsByTagName('link')
    for (let i = links.length; i >= 0; i--) {
        const link = links[i]
        if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
            link.parentNode.removeChild(link)
        }
    }
}

export function removeAllCss() {
    removeCss(`${process.env.VUE_APP_API_PREFIX}/theme/theme_default.css`)
    removeCss(`${process.env.VUE_APP_API_PREFIX}/theme/theme_eye.css`)
    removeCss(`${process.env.VUE_APP_API_PREFIX}/theme/theme_gold.css`)
    removeCss(`${process.env.VUE_APP_API_PREFIX}/theme/theme_night.css`)
}