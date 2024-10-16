console.log("Conectado...")

const urlApi = "https://kind-katee-valenmendez-9428a141.koyeb.app/patients"


function ValidateSession(){
    fetch("https://kind-katee-valenmendez-9428a141.koyeb.app/validate",{
        method: "GET",
        credentials: "include"
    })
    .then(response =>{
        if (!response.ok){
            window.location.href = "login.html"
        }
    })
    .catch(error => console.error(error))
}

function CountPatients(){
    const contadorPatients = document.getElementById("totalPatients")
        
    if(contadorPatients){
        fetch(`https://kind-katee-valenmendez-9428a141.koyeb.app/total-patients`,{
            credentials: "include",
        })
        .then(response =>{
            if(!response.ok){
                console.error(response.json())
            }
            return response.json()
        })
        .then(data =>{
            contadorPatients.innerHTML = data.total
        })
        .catch(error => console.error(error))
    }
}

function AppointmentToday(){
    const cantCitas = document.getElementById("totalCitas")

    if(cantCitas){
        fetch(`https://kind-katee-valenmendez-9428a141.koyeb.app/appointment-today`,{
            credentials: "include",
        })
        .then(response =>{
            if(!response.ok){
                console.error(response.json())
            }
            return response.json()
        })
        .then(data =>{
            cantCitas.innerHTML = data.count
        })
        .catch(error => console.error(error))
    }
}

function AppointmentWeek(){
    const cantAppointments = document.getElementById("appointmentsWeek")

    fetch(`https://kind-katee-valenmendez-9428a141.koyeb.app/appointments-week`,{
        credentials: "include",
    })
        .then(response =>{
            if(!response.ok){
                console.error(response.json())
            }
            return response.json()
        })
        .then(data =>{
            cantAppointments.innerHTML = data.count
        })
        .catch(error => console.error(error))
}

function CloseSession(){
    const closeSesion = document.getElementById("closesesion")

    if(closeSesion){
        closeSesion.addEventListener("click", function(e){
            e.preventDefault()

            fetch("https://kind-katee-valenmendez-9428a141.koyeb.app/logout",{
                method: "POST",
                credentials: "include"
            })
            .then(response => response.json())
            .then(data =>{
                console.log("Sesion cerrada...")
                window.location.href = "login.html"
                e.preventDefault()
                return
            })
            .catch(error => console.error(error))
        })
    }
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

document.addEventListener("DOMContentLoaded",function(e){
    e.preventDefault();

    ValidateSession()

    fetch(urlApi,{
        credentials: "include",
    })
        .then(response =>{
            if(!response.ok){
                console.error(response)
            }
            return response.json()
        })
        .then(data => {
            console.log(data)
            const tablaBody = document.querySelector(".tabla tbody")
            tablaBody.innerHTML = ""

            data.forEach(patient =>{
                const row = document.createElement("tr")
                
                row.innerHTML = `
                    <td>${patient.FullName}</td>
                     <td>${patient.Email}</td>
                     <td>${patient.Dni}</td>
                     <td>${patient.Phone}</td>
              
                `;
                tablaBody.appendChild(row)
            })
        })
        .catch(error => console.error("Error", error))


        CountPatients()

        AppointmentToday()

        CloseSession()

        AppointmentWeek()

        BarsMenu()
})


