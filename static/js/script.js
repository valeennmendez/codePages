console.log("Conectado...")

const urlApi = "https://apipage-production-f781.up.railway.app/patients"


function ValidateSession(){
    fetch("https://apipage-production-f781.up.railway.app/validate",{
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
        fetch(`https://apipage-production-f781.up.railway.app/total-patients`,{
            credentials: "include",
        })
        .then(response =>{
            if(!response.ok){
                console.error(response.json())
            }
            return response.json()
        })
        .then(data =>{
            console.log(data.total)
            contadorPatients.innerHTML = data.total
        })
        .catch(error => console.error(error))
    }
}

function AppointmentToday(){
    const cantCitas = document.getElementById("totalCitas")

    if(cantCitas){
        fetch(`https://apipage-production-f781.up.railway.app/appointment-today`,{
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

function CloseSession(){
    const closeSesion = document.getElementById("closesesion")

    if(closeSesion){
        closeSesion.addEventListener("click", function(e){
            e.preventDefault()

            fetch("https://apipage-production-f781.up.railway.app/logout",{
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
})


