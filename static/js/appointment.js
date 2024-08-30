console.log("Conectado...")

function GetAllAppointments(){

    fetch(`https://apipage-production-f781.up.railway.app/appointments`,{
        method: "GET",
        credentials: "include"
    })
        .then(response =>{
            if(!response.ok){
                console.error("ERROR")
            }
            return response.json()
        })
        .then(data =>{
            const tableBody = document.querySelector(".tabla tbody")
            tableBody.innerHTML = "";

            data.forEach(appointment =>{
                const row = document.createElement("tr")
                
                const fecha = new Date(appointment.Fecha)
                const fechaFormateada = fecha.toLocaleDateString()

                row.innerHTML = `
                <td>${appointment.Paciente.FullName}</td>
                <td>${appointment.Paciente.Dni}</td>
                <td>${fechaFormateada}</td>
                <td>${appointment.Hora}</td>
                `
                tableBody.appendChild(row)
            })
        })
        .catch(error => console.error("error: ",error))
}

function CancelAppointments(){
    const button = document.getElementById("btnCancel")

    if(button){
        button.addEventListener("click", function(e){
            
            fetch(`https://apipage-production-f781.up.railway.app/cancel-appointment`)
        })
    }
}

function SearchPatientsForm(){
    const inputSearch = document.getElementById("searchPatient");
    const autocompleteList = document.getElementById("autocomplete-list");
    
    inputSearch.addEventListener("input", function() {
      const query = this.value;
    
      if (query.length > 1) {
        fetch(`https://apipage-production-f781.up.railway.app/search-patient?p=${encodeURIComponent(query)}`)
          .then(response => response.json())
          .then(data => {
            autocompleteList.innerHTML = "";
    
            data.forEach(patient => {
              const listItem = document.createElement("li");

              const dataid = patient.ID;
              console.log(dataid)
              
              listItem.textContent = patient.FullName;
              listItem.setAttribute("data-id", dataid)
              listItem.classList.add("listItem")
              listItem.dataset.value = patient.FullName;
              autocompleteList.appendChild(listItem);
            });
    
            autocompleteList.style.display = "block";
          })
          .catch(error => console.error("error", error));
      } else {
        autocompleteList.style.display = "none";
      }
    });
    
    autocompleteList.addEventListener("click", function(event) {
      if (event.target.tagName === "LI") {
        inputSearch.value = event.target.dataset.value;
        const selectedPatientID = event.target.getAttribute("data-id");
  
        inputSearch.setAttribute("data-selected-id", selectedPatientID);
        autocompleteList.style.display = "none";
      }
    });
}

function CloseOpenForm(){
  const openButton = document.getElementById("openFormAppBtn")
  const closeButton = document.getElementById("closeFormAppBtn")
  const appContainer = document.getElementById("formCreateAppointment")

  openButton.addEventListener("click", function(){
    appContainer.classList.add("active")
  })

  closeButton.addEventListener("click", function(){
    appContainer.classList.remove("active")
  })
}

function AddNewAppointment(){

  const appContainer = document.getElementById("formCreateAppointment")
  const inputPatient = document.getElementById("searchPatient")


  CloseOpenForm();
  LoadHours();

  appContainer.addEventListener("submit", function(e){
    e.preventDefault()

    const pacienteID = inputPatient.getAttribute("data-selected-id")
    const day = document.getElementById("dayApp").value
    const hour = document.getElementById("hourApp").value
    const motivo = document.getElementById("motivoApp").value


    const appointmentData = {
      pacienteid: parseInt(pacienteID),
      fecha: day,
      hora: hour,
      motivoconsulta: motivo,
    }

    console.log(appointmentData)

    fetch(`https://apipage-production-f781.up.railway.app/create-appointment`,{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
      credentials: "include"
    })
      .then(response =>{
        if(!response.ok){
          console.error(response)
        }
        return response.json()
      })
      .then(data =>{
        console.log("Appointment created...")
        if(data.message === "Appoinment created succesfully"){
            alert("Cita creada correctamente.")
            window.location.reload()
        }
      })  
      .catch(error => console.error(error))
  })

}

function LoadHours(){
  const dayInput = document.getElementById("dayApp")
  const hourSelect = document.getElementById("hourApp")

  dayInput.addEventListener("change", function(){
    const selectedDay = dayInput.value;

    if (selectedDay){
        fetchAvilableHours(selectedDay)
    }
  })


  function fetchAvilableHours(date){
      fetch(`https://apipage-production-f781.up.railway.app/available-hours?fecha=${date}`)
      .then(response => response.json())
      .then(data => {
          console.log(data)
          const availableHours = data.available_hours;
          updateHourOptions(availableHours);
      })
      .catch(error => console.error("Error: ", error))
  }

  function updateHourOptions(hours){
    hourSelect.innerHTML = "";
    console.log(hours)

    if(hours.length > 0){
        hours.forEach( hour => {
            const option = document.createElement('option')
            option.value = hour;
            option.textContent = hour
            hourSelect.appendChild(option)
        })
    }else {
        const option = document.createElement('option');
        option.textContent = "No available hours";
        hourSelect.appendChild(option)
    }
  }
}

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

document.addEventListener("DOMContentLoaded", function(e){

    ValidateSession()

    GetAllAppointments()

    SearchPatientsForm()

    AddNewAppointment()

    BarsMenu()
})
