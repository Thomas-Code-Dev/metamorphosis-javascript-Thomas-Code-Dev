initDragAndDrop();
var score = 0;

function initDragAndDrop() {
    shuffleCards();
    // Initialize drag & drop elements here
    let draggables = document.querySelectorAll(".card");
    let dropZones = document.querySelectorAll(".mixed-cards");
    let dropZonesFrog = document.querySelectorAll(".frog-slots .card-slot");
    let dropZonesButterfly = document.querySelectorAll(".butterfly-slots .card-slot");
    initDraggables(draggables);
    initDropZones(dropZones);
    initDropZones(dropZonesFrog);
    initDropZones(dropZonesButterfly);
}


function initDraggables(draggables) {
    for (const draggable of draggables) {
        initDraggable(draggable);
    }
}

function initDropZones(dropZones) {
    for (let dropZone of dropZones) {
        initDropZone(dropZone);
    }
}

/**
 * Set all event listeners for draggable element
 * https://developer.mozilla.org/en-US/docs/Web/API/DragEvent#Event_types
 */
function initDraggable(draggable) {
    draggable.addEventListener("dragstart", dragStartHandler);
    draggable.addEventListener("drag", dragHandler);
    draggable.addEventListener("dragend", dragEndHandler);

    // set draggable elements to draggable
    // draggable.setAttribute("draggable", "true");
    draggable.setAttribute("card", "true");
}

/**
 * Set all event listeners for drop zone
 * https://developer.mozilla.org/en-US/docs/Web/API/DragEvent#Event_types
 */
function initDropZone(dropZone) {
    dropZone.addEventListener("dragenter", dropZoneEnterHandler);
    dropZone.addEventListener("dragover", dropZoneOverHandler);
    dropZone.addEventListener("dragleave", dropZoneLeaveHandler);
    dropZone.addEventListener("drop", dropZoneDropHandler);
}


/**
 * Start of drag operation, highlight drop zones and mark dragged element
 * The drag feedback image will be generated after this function
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragfeedback
 */
function dragStartHandler(e) {
    setDropZonesHighlight();
    this.classList.add('dragged', 'drag-feedback');
    // we use these data during the drag operation to decide
    // if we handle this drag event or not
    e.dataTransfer.setData("type/dragged-box", 'dragged');
    e.dataTransfer.setData("text/plain", this.textContent.trim());
    deferredOriginChanges(this, 'drag-feedback');
}

  

/**
 * While dragging is active we can do something
 */
function dragHandler() {
    // do something... if you want
}

/**
 * Very last step of the drag operation, remove all added highlights and others
 */
function dragEndHandler() {
    setDropZonesHighlight(false);
    this.classList.remove('dragged');
}

/**
 * When entering a drop zone check if it should be allowed to
 * drop an element here and highlight the zone if needed
 */
function dropZoneEnterHandler(e) {
    // we can only check the data transfer type, not the value for security reasons
    // https://www.w3.org/TR/html51/editing.html#drag-data-store-mode
    let draggedElement = document.querySelector('.dragged');
    if (e.dataTransfer.types.includes('type/dragged-box')) {
        if(e.target.getAttribute('data-boxtype') ==  draggedElement.getAttribute('data-appendto') || e.target.getAttribute('data-boxtype') == "general"){
        this.classList.add("over-zone");
        }
        // The default action of this event is to set the dropEffect to "none" this way
        // the drag operation would be disallowed here we need to prevent that
        // if we want to allow the dragged element to be drop here
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/dragenter_event
        // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
        e.preventDefault();
    }
}

/**
 * When moving inside a drop zone we can check if it should be
 * still allowed to drop an element here
 */
function dropZoneOverHandler(e) {
    // if (e.dataTransfer.types.includes('type/dragged-box')) 
    if (e.dataTransfer.types.includes('type/dragged-box')){
        // The default action is similar as above, we need to prevent it
        e.preventDefault();
    }
}

/**
 * When we leave a drop zone we check if we should remove the highlight
 */
function dropZoneLeaveHandler(e) {
    if (e.dataTransfer.types.includes('type/dragged-box') &&
        e.relatedTarget !== null &&
        // e.currentTarget !== e.relatedTarget.closest('.drop-zone')) {
        e.currentTarget !== e.relatedTarget.closest('.card-slot') ||
        e.currentTarget !== e.relatedTarget.closest('.mixed-cards')) 
         {
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget
        this.classList.remove("over-zone");
    }
}

/**
 * On successful drop event, move the element
 */
function dropZoneDropHandler(e) {
    // We have checked in the "dragover" handler (dropZoneOverHandler) if it is allowed
    // to drop here, so it should be ok to move the element without further checks
    let draggedElement = document.querySelector('.dragged');
    // if(e.target.getAttribute('data-boxtype') ==  document.getElementById("1/1").getAttribute('data-appendto')){
    //     e.target.appendChild(document.getElementById("1/1"))}
    if(e.target.getAttribute('data-boxtype') ==  draggedElement.getAttribute('data-appendto') || e.target.getAttribute('data-boxtype') == "general"){
        e.target.appendChild(draggedElement);}
    if(e.target.getAttribute('id') ==  draggedElement.getAttribute('imgnumber')){
        if (draggedElement.classList == "card dragged"){
            draggedElement.classList.add('well-placed');
            score ++;
            console.log(score);}
        console.log(draggedElement.classList);
        if (score == 8) {console.log("Congratulations, you win the game!");
        let victoryZone = document.getElementById("victory");
        victoryZone.classList.remove("hidden");
        victoryZone.classList.add("great");
    setInterval(function() {
        victoryZone.style.display = (victoryZone.style.display == 'none' ? '' : 'none');
    }, 1000);
    }
    }
    else {
        if (draggedElement.classList == "card dragged well-placed" || draggedElement.classList == "card well-placed dragged"){
            draggedElement.classList.remove('well-placed');
            score --;
            console.log(score);}
        console.log(draggedElement.classList);
    }

    // e.currentTarget.appendChild(draggedElement);

    // We  drop default action (eg. move selected text)
    // default actions detailed here:
    // https://www.w3.org/TR/html51/editing.html#drag-and-drop-processing-model
    e.preventDefault();

}


/**
 * Highlight all drop zones or remove highlight
 */
function setDropZonesHighlight(highlight = true) {
    const dropZones = document.querySelectorAll(".card-slot");
    const dropZoneDeck = document.getElementById("deck");
    for (const dropZone of dropZones) {
        if (highlight) {
            dropZone.classList.add("active-zone");
        } else {
            dropZone.classList.remove("active-zone");
            dropZone.classList.remove("over-zone");
        }
    }
    if (highlight) {
        dropZoneDeck.classList.add("active-zone");
    } else {
        dropZoneDeck.classList.remove("active-zone");
        dropZoneDeck.classList.remove("over-zone");
    }
}

/**
 * After the drag feedback image has been generated we can remove the class we added
 * for the image generation and/or change the originally dragged element
 * https://javascript.info/settimeout-setinterval#zero-delay-settimeout
 */
function deferredOriginChanges(origin, dragFeedbackClassName) {
    setTimeout(() => {
        origin.classList.remove(dragFeedbackClassName);
    });
}


function shuffleCards() {
    let mixedCardsContainer = document.querySelector(".mixed-cards");
    for (let i = mixedCardsContainer.children.length; i >= 0; i--) {
        mixedCardsContainer.appendChild(mixedCardsContainer.children[Math.random() * i | 0]);
    }
}