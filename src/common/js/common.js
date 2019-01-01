export function getContentHeight() {
    let screenHeight = document.body.clientHeight
    let headersHeight = document.querySelector('.headers').offsetHeight;
    let footersHeight = document.querySelector('.footer').offsetHeight;
    return screenHeight - headersHeight -footersHeight
}

