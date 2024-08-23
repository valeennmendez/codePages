console.log("Conectado...")

function GetAllAppointments(){

    fetch(`http://localhost:8080/appointments`,{
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
            
            fetch(`http://localhost:8080/cancel-appointment`)
        })
    }
}

function SearchPatientsForm(){
    const inputSearch = document.getElementById("searchPatient");
    const autocompleteList = document.getElementById("autocomplete-list");
    
    inputSearch.addEventListener("input", function() {
      const query = this.value;
    
      if (query.length > 2) {
        fetch(`http://localhost:8080/search-patient?p=${encodeURIComponent(query)}`)
          .then(response => response.json())
          .then(data => {
            autocompleteList.innerHTML = "";
    
            data.forEach(patient => {
              const listItem = document.createElement("li");
              listItem.textContent = patient.FullName;
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
        autocompleteList.style.display = "none";
      }
    });
}

document.addEventListener("DOMContentLoaded", function(e){

    GetAllAppointments()

    SearchPatientsForm()

})