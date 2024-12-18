let geocoder,
    responseDiv,
    response,
    formattedAddress,
    infoContent;
    let markers = [];

async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const map = new Map(document.getElementById("map"), {
        center: { lat: 41.387397, lng: 2.168568 },
        zoom: 13,
        mapId: "4504f8b37365c3d0",
    });
    geocoder = new google.maps.Geocoder();

//Input field creation
    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Enter a location";
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);

//Geocode Button creation
    const submitButton = document.createElement("input");
    submitButton.type = "button";
    submitButton.value = " Geocode";
    submitButton.classList.add("button-top", "button-primary");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);

//Geocoder Response
    response = document.createElement("pre");
    response.id = "response";
    response.innerText = "";

    responseDiv = document.createElement("div");
    responseDiv.id = "response-container";
    responseDiv.appendChild(response);

// Delete Button Creation
   
    const deleteButton = document.createElement("input");
    deleteButton.id = "delete-marker";
    deleteButton.type = "button";
    deleteButton.classList.add("button-del");
    deleteButton.value = "Delete Marker";
   
    const deleteAllButton = document.createElement("input");
    deleteAllButton.id = "delete-markers";
    deleteAllButton.type = "button";
    deleteAllButton.classList.add("button-delAll");
    deleteAllButton.value = "Delete Markers";

 //Details Window contents  
 //TO DO: make this appear only when the H3s are clicked. But leave details box with instructions to do this. 
 //Pop up box should behave like response box with the JSOn.  

 
    const detailsElement = document.createElement("p");

    detailsElement.id = "details";
    detailsElement.innerHTML =
      "<strong>Details: </strong>Enter details later on.";    
      map.controls[google.maps.ControlPosition.LEFT_TOP].push(detailsElement);

//infoWindow contents
    const containerDiv = document.createElement("div");
    containerDiv.appendChild(deleteButton);
    containerDiv.appendChild(deleteAllButton);

//InfoWindow Creation
    infoContent = containerDiv.innerHTML;
    const infoWindow = new InfoWindow()   //google.maps.InfoWindow({ content: infoContent });

//Map event listener
    map.addListener("click", function (event) {
        geocode({ location: event.latLng });

        infoWindow.close()
        addMarker(event.latLng);
    });

    submitButton.addEventListener("click", function (event) {
        geocode({ address: inputText.value });
    });

//addMarker Function
    function addMarker(position) {
        const marker = new AdvancedMarkerElement({ position, map });
        markers.push(marker);
       

        marker.addListener("click", () => {
           infoWindow.open({ anchor: marker, map });

           google.maps.event.addListener(infoWindow, "domready", () => {
              const deleteB = document.getElementById("delete-marker");
              const deleteAll = document.getElementById("delete-markers");
                
              deleteB.addEventListener("click", () => {
                  const markerIndex = markers.indexOf(marker);               
                  deleteMarker(markerIndex)
              });            
           
              deleteAll.addEventListener("click", () => {
                 clearMarkers()
              });
            
           });       
        });
     };
    

    function clearMarkers() {
        // Clear all existing markers
        markers.forEach((marker) => {
            marker.setMap(null);
        });
       // Reset the markers array
       markers = []; 
    }
   
   function deleteMarker(markerIndex) {
     //Clear just the marker with an opened infowindow
      if (markerIndex >= 0 && markerIndex < markers.length) {
         const markerToDelete = markers[markerIndex];
         markerToDelete.setMap(null);
         markers.splice(markerIndex, 1);
         console.log("Array length", markers.length)
      };
   };
     
    function geocode(request) {
//      clearMarkers();
        geocoder
            .geocode(request)
            .then((result) => {
                const { results } = result;
                if (results && results.length > 0) {
                    const location = results[0].geometry.location;
                    const formattedAddress = results[0].formatted_address;

                    map.setCenter(location);
                    addMarker(location)
                    responseDiv.style.display = "block";
                    response.innerText = JSON.stringify(result, null, 2);

                    infoWindow.setContent(`
                        <div>           
                            <p><b>Address: </b>${formattedAddress}</p>            
                        </div> 
                           ${containerDiv.innerHTML}
                  `);
                } else {
                    
                    console.log("Nothing found");
                }
            
//              console.log(results);
                return results;
            
            })
            .catch((error) => {
                console.log("Geocoder was not successful: " + error);
            });
    }
}

initMap();