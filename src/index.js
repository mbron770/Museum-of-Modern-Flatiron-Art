function init(){
    const URL="http://localhost:3000/current-exhibits"
    loadExibits(URL)
    const main=document.querySelector("main")
    const commentSection=main.querySelector("#comments-section")
    main.querySelector("#comment-form").addEventListener("submit",e=>addNewComment(e,URL))
    main.querySelector("#buy-tickets-button").addEventListener("click",e=>buyTickets(e,URL))
    let selectedExhibit

    function loadExibits(URL){
        fetch(URL)
        .then(res=>res.json())
        .then(exhibits=>displayExibitDetails(exhibits[0]))
        .catch(e=>alert(e.message))
    }

    function displayExibitDetails(exhibit){
        main.querySelector("#exhibit-title").title=exhibit.title
        main.querySelector("#tickets-bought").textContent=`${exhibit.tickets_bought} Tickets Bought`
        main.querySelector("#exhibit-description").textContent=exhibit.description
        exhibit.comments.forEach(comment=>renderComment(comment))
        main.querySelector("img#exhibit-image").src=exhibit.image
        selectedExhibit=exhibit
    }

    function renderComment(comment){
        const p=document.createElement("p")
        p.textContent=comment
        commentSection.append(p)
    }

    function addNewComment(e,URL){
        e.preventDefault()
        const comment=e.target["comment-input"].value
        const comments=selectedExhibit.comments
        comments.push(comment)
        const updatedComments={comments}
        console.log(updatedComments)
        fetch(`${URL}/${selectedExhibit.id}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            body:JSON.stringify(updatedComments)
        })
        .then(res=>res.json())
        .then(updatedExhibit=>{
            selectedExhibit=updatedExhibit
            const numOfComments=selectedExhibit.comments.length
            const lastComment=selectedExhibit.comments[numOfComments-1]
            renderComment(lastComment)
        })
        .catch(e=>alert(e.message))

    }

    function buyTickets(e,URL){
        e.preventDefault()
        const ticketsBought=main.querySelector("#tickets-bought")
        let tickets_bought=parseInt(ticketsBought.textContent)
        tickets_bought+=1
        const updatedTicketsBought={tickets_bought}
        fetch(`${URL}/${selectedExhibit.id}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                "Accept":"applcation/json"
            },
            body:JSON.stringify(updatedTicketsBought)
        })
        .then(res=>res.json())
        .then(updatedExhibit=>{
            selectedExhibit=updatedExhibit
            ticketsBought.textContent=`${selectedExhibit.tickets_bought} Tickets Bought`
        })
        .catch(e=>alert(e.message))
    }
}

init()
