createInterface();

function createInterface(){
    let room = createElem(`div`, `room`,`body`);
    let ball = createElem(`div`, `ball`,`#room`)
    let basket = createElem(`div`,`basket`,`#room`);
    let basketImg = createElem(`img`,`basket-img`,`#room`);
    basketImg.setAttribute(`src`,`img/basket.png`);
    let man = createElem(`div`,`man`,`#room`);
    let manBody = createElem(`img`,`body`,`#man`);
    manBody.setAttribute(`src`,`img/man.png`)
    let manLeftArm = createElem(`div`,`left-arm`,`#man`);
    let manRightArm = createElem(`div`,`right-arm`,`#man`);
}

function createElem(elem, id, parentSelector, text) {
    let item = document.createElement(elem);
    if (id) item.setAttribute(`id`, id);
    item.textContent = text;
    document.querySelector(parentSelector).appendChild(item);

    return item;
}