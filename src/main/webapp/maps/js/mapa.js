
var acur=1000;
var labelOn=false;
var map;	
var infoUTM;
var UTMsquare;
var mode="view";
var elevator;
var bounds;
var current_year;

var gridLayer;
var sectorGridLayer;

var sectorsCount={'sector_1':0,'sector_2':0,'sector_3':0,'sector_4':0,'sector_5':0,'sector_6':0};

var utmSectorsCount={'sector_1':0,'sector_2':0,'sector_3':0,'sector_4':0,'sector_5':0,'sector_6':0};

var redGrid={'5':'#DC0014','4':'#FF3C14','3':'#FF7814','2':'#FFB414','1':'#FFF014','0':'#F0FF78'};
//var cronoGrid={'old':'#F0FF78','0':'#DC0014','empty':'#BEBEBE','1':'#FF3C14','2':'#FF7814','3':'#FFB414','4':'#FFF014','5':'#F0FF78'};

var color="0000FF";

var offsetLeft;
var offsetTop;

function loadTaxonList(clickLatLng){

	var utm= convertLatLongToUTM(clickLatLng.lat(),clickLatLng.lng(),acur,UTMsquare,false);
	window.open("/#/utm?utm="+utm.replace(/_/g, ""),'_self');

}

function changeAccuracy(){

	selected_value = $("input[name='utm']:checked").val();

	if(selected_value=="10km") acur=10000;
	else acur=1000;

}

function setChoosenUTM(clickLatLng){

	if($('#checkUTM').hasClass( "success" )){


	}
	else{


		var utm= convertLatLongToUTM(clickLatLng.latLng.lat(),clickLatLng.latLng.lng(),acur,UTMsquare,true);

		if(polygonSelection) polygonSelection.setMap(null);

		UTMsquare.setMap(null);  

		MGRS2LatLong(utm,map,"utm_search");

		$('#utm_value').val(utm);

		//$("#mapDiv").fadeTo("slow",0.6);

		if($('#autoAlitudeAndLocality').is(':checked') && (!$('#repeatLocation').is(':checked'))){

			codeLatLng(clickLatLng.latLng.lat(), clickLatLng.latLng.lng())
			getElevation(clickLatLng.latLng);

		}

		checkUTMCorrectness(utm);


		infoUTM.setVisible(true);

	}
}

function getAltitud(event, map) {

	  var locations = [];

	  // Retrieve the clicked location and push it on the array
	  var clickedLocation = event.latLng;
	  locations.push(clickedLocation);

	  // Create a LocationElevationRequest object using the array's one value
	  var positionalRequest = {
	    'locations': locations
	  }
		infowindow = new google.maps.InfoWindow();
//		infowindow.setContent("<div id=\"infoWindow\"><p><span class=\"text-info\"><b>UTM:</b> </span>"+utmString+"</p> " +
//				"<p><span class=\"text-info\"><b>Alt.: </b></span>"+ getElevation(event.latLng)+"</p></div>" );
//
//		infowindow.setPosition(event.latLng);
//
//		infowindow.open(map.map); 

	  // Initiate the location request
	  elevator.getElevationForLocations(positionalRequest, function(results, status) {
	    if (status == google.maps.ElevationStatus.OK) {

	      // Retrieve the first result
	      if (results[0]) {

	        // Open an info window indicating the elevation at the clicked position
	    	infowindow.setContent("<div id=\"infoWindow\"><p><span class=\"text-info\"><b>Altitud: </b> </span>"+ parseInt(results[0].elevation) +" m.</p></div>" );
//	        infowindow.setContent('Altitud <br>' + parseInt(results[0].elevation) + ' meters.');
	        infowindow.setPosition(clickedLocation);
	        infowindow.open(map.map);
	      } else {
	        alert('No results found');
	      }
	    } else {
	      alert('Elevation service failed due to: ' + status);
	    }
	  });
	}

function getElevation(latLng) {

	var locations = [];
	var alt = "";

	// Retrieve the clicked location and push it on the array
	var clickedLocation = latLng;
	locations.push(clickedLocation);

	// Create a LocationElevationRequest object using the array's one value
	var positionalRequest = {
			'locations': locations
	};

	// Initiate the location request
	elevator.getElevationForLocations(positionalRequest, function(results, status) {
		if (status == google.maps.ElevationStatus.OK  && results[0]) {

			// Retrieve the first result
			if (results[0]) {
				alt = parseInt(results[0].elevation)

				$('#elevation_value').val(parseInt(results[0].elevation));

			}
		} 
	});
	return alt;
}

function codeLatLng(lat, lng) {

	geocoder = new google.maps.Geocoder();


	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {


				var arrAddress = results[1].address_components;

				var itemLocality='';
				var itemCountry='';
				var itemRoute;

				// iterate through address_component array
				$.each(arrAddress, function (i, address_component) {

					if (address_component.types[0] == "locality"){
						itemLocality = address_component.long_name;
					}

					if (address_component.types[0] == "country"){ 
						itemCountry = address_component.long_name;
					}

					if (address_component.types[0] == "route"){ 
						itemRoute = address_component.long_name;
					}

				});

				if(itemLocality) $('#locality_value').val(itemLocality);
				else $('#locality_value').val(itemRoute);
			}
		} 

	});
}


	function getMGRSLabelTextAndSquare(location,UTMsquare) {

		return convertLatLongToUTM(location.lat(),location.lng(),acur,UTMsquare,true);

	}

	function getMGRSLabelText(location) {

		return LatLongToUTM_info(location.lat(),location.lng(),acur);

	}

	function getLatLngByOffset( map, offsetX, offsetY ){

		var currentBounds = map.getBounds();
		var topLeftLatLng = new google.maps.LatLng( currentBounds.getNorthEast().lat(),
				currentBounds.getSouthWest().lng());
		var point = map.getProjection().fromLatLngToPoint( topLeftLatLng );
		point.x += offsetX / ( 1<<map.getZoom() );
		point.y += offsetY / ( 1<<map.getZoom() );
		return map.getProjection().fromPointToLatLng( point );

	}

function setMapSearchMode(UTMsquare){

	$('#map_info').hide();

	$('#'+map.div).mousemove(function(evt){
		var posx = evt.pageX-offsetLeft;
		var posy = evt.pageY-offsetTop;

		$('#map_info').show();        
		$('#map_info').html("<span class=\"label label-info\">UTM</span> "+getMGRSLabelTextAndSquare(getLatLngByOffset(map.map,posx,posy),UTMsquare));

	});

	$('#'+map.div).mouseout(function(evt){

		$('#map_info').hide();
		UTMsquare.setPath([]);

		infoUTM.setVisible(false);

	});

	google.maps.event.addListener(map.map, 'click', function(event) {

		if(map.mode=='search') loadTaxonList(event.latLng);
		else setChoosenUTM(event);

	})  ;   

}

function setMapViewMode(UTMsquare){
	var that = this;

	$('#map_info').hide();

	$('#'+map.div).mousemove(function(evt){

		var posx = evt.pageX-offsetLeft;
		var posy = evt.pageY-offsetTop;

		$('#map_info').show();        
		$('#map_info').html("<span class=\"label label-info\">UTM</span> "+getMGRSLabelText(getLatLngByOffset(map.map,posx,posy)));

	});

	$('#'+map.div).mouseout(function(evt){

		$('#map_info').hide();

	});

}

function loadAllUTMsSector(sector){  //llamada desde loadSectorGrid()
	$.getJSON(serverUrl + "/utmSector", function(data) {
		for (var i = 0; i < data.length; i++) {
			// FIXME: solve 30T --> backend or db??
			drawUTMSquare('30T' + data[i]['utm'], map, "sector:"+data[i]['sector']);     
		}	});       
}

function borraUTMList(){   //llamada desde loadSectorGrid()
	utmSectorList.forEach(function(item,index){
//		console.log("borrando")
//		utmSectorList.getAt(index).setMap(null);
		utmSectorList.pop();
	}); 
}

function loadUTMsZona(zona){
	citationList.clear();
	loadUTMsComun("/listaCitasByUtmsZona?zona="+zona);
}

function loadUTMsTaxon(taxon){  
	citationList.clear();
	$.getJSON(serverUrl + "/listaCitasJacaByUtmsTaxon?taxon="+taxon, function(data) {

		var JacaCount=0;

		$.each(data, function(entryIndex, entry){ 

			utm1x1=entry['utm1x1'];
			addUTM(utm1x1,map,entry['sector']); 
			JacaCount++;

		});       
		$('#JacaCount').html(JacaCount);

	});  
	loadUTMsComun("/listaCitasByUtmsTaxon?taxon="+taxon)
}

// FIXME: move to angular!!
function loadUTMsComun(consulta){  
	var that = this;
	$.getJSON(serverUrl + consulta, function(data) {

		var count=0;

		$.each(data, function(entryIndex, entry){ 

			utm1x1=entry['utm1x1'];
			utm1x1=$.trim(utm1x1);

			if(!utm1x1 || utm1x1.indexOf("*")>= 0 ) ;//addUTM(entry['utm'],map,entry['sector']);  
			else {

				addUTM(utm1x1,map,entry['sector']); 
//				addUTM(entry['utm'],map,entry['sector']);

			}

			count++;
			citationCount++;
			if (entry['sector'] <= "6") {
				sectorsCount['sector_'+entry['sector']]=sectorsCount['sector_'+entry['sector']] + 1;
			}            

		});

		count=0;

		$('#'+map.div).fadeTo("slow",1);

		$('#dvLoading').fadeOut(2000);

		$('#citationCount').html(citationCount);
		$('#utmCount').html(utmTotalCount);

//		selectUTMSquare();

		citationCount=0;
		utmTotalCount=0;

//			if ($("#chart_div").length > 0) drawChart();

		if ($("#sectorTable").length > 0) loadSectorCount();           

	});       
}

function loadSectorGrid( showAllUTM ){
	if($('#addSectorGridBt').is('.sectorGridDisabled')){

		sectorGridLayer = new google.maps.KmlLayer(
				'https://mapsengine.google.com/14845694729347704804-08551536342581976716-4/download/?authuser=0'
				,{
			map: map.map,
			preserveViewport: false,
			suppressInfoWindows: true
		});
		
		if ( showAllUTM ) {
			loadAllUTMsSector();
			google.maps.event.addListener(sectorGridLayer, 'click', function (event) {
				loadTaxonList(event.latLng);
			});  		
		}
		
		$('#addSectorGridBt').removeClass("sectorGridDisabled").addClass("sectorGridEnabled").addClass('btn-success');

	}
	else{

		sectorGridLayer.setMap(null);
		borraUTMList();
		$('#addSectorGridBt').removeClass("sectorGridEnabled").removeClass('btn-success').addClass("sectorGridDisabled");

	}

}

function loadUTMGrid(){

	if($('#addGridBt').is('.gridDisabled')){
		// this.gridLayer = new google.maps.KmlLayer(baseUrl+'resources/homegrid.kml',{

		this.gridLayer = new google.maps.KmlLayer('https://mapsengine.google.com/14845694729347704804-08112974690991164587-4/download/?authuser=0',{
			map: map.map,
			preserveViewport: false,
			suppressInfoWindows: true
		});

		google.maps.event.addListener(this.gridLayer, 'click', function (event) {

			loadTaxonList(event.latLng);

		});     

		$('#addGridBt').removeClass("gridDisabled").addClass("gridEnabled").addClass('btn-success');

	}
	else{

		this.gridLayer.setMap(null);

		$('#addGridBt').removeClass("gridEnabled").removeClass('btn-success').addClass("gridDisabled");

	}

}


function MapView(mapMode,divId){

	this.div=divId;
	this.mode=mapMode;

	var mapOptions = {
			center: new google.maps.LatLng(41.76,-1.63),
			zoom: 10,
			mapTypeId: 'terrain' //google.maps.MapTypeId.ROADMAP
	};

	if(mapMode==='view_api') mapOptions.zoom=6;

	this.map = new google.maps.Map(document.getElementById(divId),mapOptions);

	this.utmListHash = new Hashtable();

}

function setColor(colorParam){

	if(colorParam.length==6) {

		//this.color=colorParam.substring(4)+colorParam.substring(2,4)+colorParam.substring(0,2);

		this.color=colorParam;
		//console.log(this.color);

		$('#citationCount').css('background-color', '#'+this.color);

	}

}


function createMap(mapMode,divId) {
	var that = this;

	try {
		map=new MapView(mapMode,divId);
		elevator = new google.maps.ElevationService();
		mode=mapMode;
		current_year=new Date().getFullYear();
		google.maps.event.addListenerOnce(map.map, 'idle', function(){

			/* Homepage map  */
			if(mode=="search"){
				$('#utm_radio').show();
				$('#utm_radio').change(function(){
					changeAccuracy();
				});
				$('#utm_label').change(function(){

					labelOn=$("input[name='labels']").is(':checked');

					if(labelOn) infoUTM.set('labelVisible', true);
					else infoUTM.set('labelVisible',false);

				});

				infoUTM = new MarkerWithLabel({

					position: new google.maps.LatLng(0,0),
					draggable: false,
					raiseOnDrag: false,
					map: map.map,
					labelContent: '',
					labelAnchor: new google.maps.Point(45, 35),
					labelClass: "labels", // the CSS class for the label
					labelStyle: {opacity: 1.0},
					icon: "http://placehold.it/1x1",
					visible: false,
					labelVisible:false

				});

				UTMsquare = new google.maps.Polygon({

					strokeColor: "#FF0000",
					strokeOpacity: 0.8,
					strokeWeight: 2,
					map: map.map,
					fillColor: "#FF0000",
					fillOpacity: 0.35,
					clickable: false

				}); 

				setMapSearchMode(UTMsquare);

			}
			if(mode=="select_utm"){
				$('#utm_radio').show();
				selected_value = $("input[name='utm']:checked").val();
				if(selected_value=="10km") acur=10000;
				else acur=1000;
				$('#utm_radio').change(function(){
					selected_value = $("input[name='utm']:checked").val();

					if(selected_value=="10km") acur=10000;
					else acur=1000;
				});

				$('#utm_label').change(function(){

					labelOn=$("input[name='labels']").is(':checked');

					if(labelOn) infoUTM.set('labelVisible', true);
					else infoUTM.set('labelVisible',false);
				});

				infoUTM = new MarkerWithLabel({

					position: new google.maps.LatLng(0,0),
					draggable: false,
					raiseOnDrag: false,
					map: map.map,
					labelContent: '',
					labelAnchor: new google.maps.Point(45, 35),
					labelClass: "labels", // the CSS class for the label
					labelStyle: {opacity: 1.0},
					icon: "http://placehold.it/1x1",
					visible: false,
					labelVisible:false

				});

				UTMsquare = new google.maps.Polygon({

					strokeColor: "#FFB414",
					strokeOpacity: 0.8,
					strokeWeight: 2,
					map: map.map,
					fillColor: "#FFB414",
					fillOpacity: 0.55,
					clickable: false

				}); 

				setMapSearchMode(UTMsquare);

			}
			else if(mode=="view" || mode=='view_api'){						 
				$('#utm_radio').hide();
				setMapViewMode(UTMsquare);
			}
			else if(mode=="stats"){
				$('#utm_radio').hide();
				setMapViewMode(UTMsquare);
			}

		});

		updateOffset(divId);
	} catch (err) {
		console.log("Error creating map " + err)
	}
	

}

function updateOffset(divId){

	offsetLeft= $('#'+divId).offset().left;
	offsetTop= $('#'+divId).offset().top; 

}
