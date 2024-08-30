console.log("Conectado...")

function GetAllAdmins(){

    fetch(`http://localhost:8080/admins`,{
        method: "GET",
        credentials: "include"
    })
        .then(response =>{
            if(!response.ok){
                console.error(response)
            }
            return response.json()
        })
        .then(data =>{
            const tablaBody = document.querySelector(".tabla tbody")
            tablaBody.innerHTML = "";

            data.forEach(admin => {
                const row = document.createElement("tr")

                row.innerHTML = `
                    <td>${admin.FullName}</td>
                    <td>${admin.Email}</td>
                    <td>${admin.Phone}</td>
                    <td>${admin.Status}</td>
                    <td>
                        <ul>
                            <div class="buttons">
                                <a name="" id="checkBtn" class="btn approveBtn" data-id="${admin.ID}" href="#" role="button">
                                    <i class="fa-solid fa-check"></i>
                                    <span class="tooltip-text">Approve</span>
                                </a>
                            </div>
                            <div class="buttons">
                                <a name="" id="" class="btn declineBtn" href="#" data-id="${admin.ID}" role="button">
                                    <i class="fa-solid fa-x"></i>
                                    <span class="tooltip-text">Decline</span>
                                </a>
                            </div>
                        </ul>
                    </td>
                `;
                tablaBody.appendChild(row)

                ApproveAccount()

                DeclineAccount()

            });
        })
        .catch(error => console.error(error))

}

function BarsMenu(){
    const bars = document.getElementById("bars")
    const containerMenu = document.querySelector(".barsMenu")
    const close = document.getElementById("closeMenu")

    if(bars){
        bars.addEventListener("click", function(){
            containerMenu.classList.add("active")
        })
    
    }

    if(close){
        close.addEventListener("click", function(){
            containerMenu.classList.remove("active")
        })
    }

}

function ApproveAccount() {
    const checkButtons = document.querySelectorAll(".approveBtn");

    console.log(checkButtons)
    
    checkButtons.forEach(button => {
        button.addEventListener("click", function(e){
            e.preventDefault();

            const adminID = button.getAttribute("data-id");
            console.log(adminID);

            fetch(`http://localhost:8080/approve-user/${adminID}`,{
                method: "POST",
                credentials: "include",
            })
            .then(response =>{
                if(!response.ok){
                    console.error(response)
                }
                return response.json()
            })
            .then(data =>{
                if(data.message === "user approved"){
                    location.reload()
                }
            })
            .catch(error => console.error(error))
 
        });
    });
}

function DeclineAccount() {
    const checkButtons = document.querySelectorAll(".declineBtn");

    console.log(checkButtons)
    
    checkButtons.forEach(button => {
        button.addEventListener("click", function(e){
            e.preventDefault();

            const adminID = button.getAttribute("data-id");
            console.log(adminID);

            fetch(`http://localhost:8080/decline-user/${adminID}`,{
                method: "POST",
                credentials: "include",
            })
            .then(response =>{
                if(!response.ok){
                    console.error(response)
                }
                return response.json()
            })
            .then(data =>{
                if(data.message === "user decline"){
                    location.reload()
                }
            })
            .catch(error => console.error(error))
 
        });
    });
}



document.addEventListener("DOMContentLoaded", function(e){
    GetAllAdmins()

    BarsMenu()
})