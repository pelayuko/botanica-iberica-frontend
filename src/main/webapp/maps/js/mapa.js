
var acur=1000;
var labelOn=false;
var map;	
var infoUTM;
var UTMsquare;
var mode="view";
var elevator;
var bounds;
var current_year;

var marker0;
var marker1;

var gridLayer;
var sectorGridLayer;

var altitudeArray={'0':0,'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,
		'11':0,'12':0,'13':0,'14':0,'15':0,'16':0,'17':0,'18':0,'19':0};

var altidudeLimits={'max':0,'min':-1,'maxReg':'','minReg':''};

var sectorsCount={'sector_1':0,'sector_2':0,'sector_3':0,'sector_4':0,'sector_5':0,'sector_6':0};

var utmSectorsCount={'sector_1':0,'sector_2':0,'sector_3':0,'sector_4':0,'sector_5':0,'sector_6':0};

var altitudeCount=0;

var redGrid={'5':'#DC0014','4':'#FF3C14','3':'#FF7814','2':'#FFB414','1':'#FFF014','0':'#F0FF78'};
//var cronoGrid={'old':'#F0FF78','0':'#DC0014','empty':'#BEBEBE','1':'#FF3C14','2':'#FF7814','3':'#FFB414','4':'#FFF014','5':'#F0FF78'};

var color="0000FF";

var offsetLeft;
var offsetTop;

/*
 * LatLonToUTMXY
 *
 * Converts a latitude/longitude pair to x and y coordinates in the
 * Universal Transverse Mercator projection.
 *
 * Inputs:
 *   lat - Latitude of the point, in radians.
 *   lon - Longitude of the point, in radians.
 *   zone - UTM zone to be used for calculating values for x and y.
 *          If zone is less than 1 or greater than 60, the routine
 *          will determine the appropriate zone from the value of lon.
 *
 * Outputs:
 *   xy - A 2-element array where the UTM x and y values will be stored.
 *
 * Returns:
 *   The UTM zone used for calculating the values of x and y.
 *
 */
function LatLonToUTMXY (lat, lon, zone, xy)
{
	MapLatLonToXY (lat, lon, UTMCentralMeridian (zone), xy);

	/* Adjust easting and northing for UTM system. */
	xy[0] = xy[0] * UTMScaleFactor + 500000.0;
	xy[1] = xy[1] * UTMScaleFactor;
	if (xy[1] < 0.0)
		xy[1] = xy[1] + 10000000.0;

	return zone;
}



/*
 * UTMXYToLatLon
 *
 * Converts x and y coordinates in the Universal Transverse Mercator
 * projection to a latitude/longitude pair.
 *
 * Inputs:
 *	x - The easting of the point, in meters.
 *	y - The northing of the point, in meters.
 *	zone - The UTM zone in which the point lies.
 *	southhemi - True if the point is in the southern hemisphere;
 *               false otherwise.
 *
 * Outputs:
 *	latlon - A 2-element array containing the latitude and
 *            longitude of the point, in radians.
 *
 * Returns:
 *	The function does not return a value.
 *
 */
function UTMXYToLatLon (x, y, zone, southhemi, latlon)
{
	var cmeridian;

	x -= 500000.0;
	x /= UTMScaleFactor;

	/* If in southern hemisphere, adjust y accordingly. */
	if (southhemi)
		y -= 10000000.0;

	y /= UTMScaleFactor;

	cmeridian = UTMCentralMeridian (zone);
	MapXYToLatLon (x, y, cmeridian, latlon);

	return;
}


function convertLatLongToUTM(lat,lng,acur,square,showUTM1x1)
{
	var xy = new Array(2);

	if (isNaN (parseFloat (lng))) {
		alert ("Please enter a valid longitude in the lon field.");
		return false;
	}

	lon = parseFloat (lng);

	if ((lon < -180.0) || (180.0 <= lon)) {
		alert ("The longitude you entered is out of range.  " +
		"Please enter a number in the range [-180, 180).");
		return false;
	}

	if (isNaN (parseFloat (lat))) {
		alert ("Please enter a valid latitude in the lat field.");
		return false;
	}

	lat = parseFloat (lat);

	if ((lat < -90.0) || (90.0 < lat)) {
		alert ("The latitude you entered is out of range.  " +
		"Please enter a number in the range [-90, 90].");
		return false;
	}

	// Compute the UTM zone.
	zone = Math.floor ((lon + 180.0) / 6) + 1;

	zone = LatLonToUTMXY (DegToRad (lat), DegToRad (lon), zone, xy,acur);

	var x= getDigraphEast(zone,xy[0]);
	var y= getDigraphNorth(zone,xy[1]);

	var xNum=getX_num(xy[0],acur,showUTM1x1);
	var yNum=getY_num(xy[1],acur,showUTM1x1);

	var utmCoords = createUTMSquare(zone, xy, acur, isSouthernHem(lat), square);

	isZoneLimit(zone, xy[0], xy[1], acur, isSouthernHem(lat), square, utmCoords);

	if (labelOn)
		infoUTM.set('labelContent', zone + getLatZone(lat) + "_" + x + y + "_" + xNum + yNum);

	return zone + getLatZone(lat) + x + y + xNum + yNum;

	//if(pretty)return (zone+determineLetter(y,yNum)+" "+x+y+" "+xNum+yNum);
	//else return (zone+determineLetter(y,yNum)+"_"+x+y+"_"+xNum+yNum);

	//  if (lat < 0)
	// Set the S button.
	//        alert("Hemisferi sud");
	//else
	// Set the N button.
	//      alert("Hemisferi Nord");

}

function getX_num(x,acur,showUTM1x1){

	if(acur==10000){  // || !showUTM1x1

		return parseInt(x/acur)%10;
	}   
	else{

		return pad2(parseInt(x/acur)%100);
	}

}

function pad2(number) {

	return (number < 10 ? '0' : '') + number

}

function getY_num(y,acur,showUTM1x1){

	if(acur==10000){ // || !showUTM1x1

		return parseInt(((y/acur)%100)%10);
	}   
	else{

		return pad2(parseInt(((y/1000)%100)));
	}

}

function LatLongToUTM_info(lat,lng,acur)
{
	var xy = new Array(2);

	if (isNaN (parseFloat (lng))) {
		alert ("Please enter a valid longitude in the lon field.");
		return false;
	}

	lon = parseFloat (lng);

	if ((lon < -180.0) || (180.0 <= lon)) {
		alert ("The longitude you entered is out of range.  " +
		"Please enter a number in the range [-180, 180).");
		return false;
	}

	if (isNaN (parseFloat (lat))) {
		alert ("Please enter a valid latitude in the lat field.");
		return false;
	}

	lat = parseFloat (lat);

	if ((lat < -90.0) || (90.0 < lat)) {
		alert ("The latitude you entered is out of range.  " +
		"Please enter a number in the range [-90, 90].");
		return false;
	}

	// Compute the UTM zone.
	zone = Math.floor ((lon + 180.0) / 6) + 1;

	zone = LatLonToUTMXY (DegToRad (lat), DegToRad (lon), zone, xy,acur);

	//var x= assignLetterX(parseInt(xy[0]/100000),zone);
	//var y=assignLetterY(parseInt(xy[1]/100000));

	var x= getDigraphEast(zone,xy[0]);

	var y= getDigraphNorth(zone,xy[1]);

	var xNum=getX_num(xy[0],acur,true); //parseInt(xy[0]/acur)%10;
	var yNum=getY_num(xy[1],acur,true); //parseInt(((xy[1]/acur)%100)%10);

	return zone+getLatZone(lat)+x+y+xNum+yNum;

}


function changeMarkerPositionRad(marker,latlon_left) {

	var latlng = new google.maps.LatLng(RadToDeg(latlon_left[0]),RadToDeg(latlon_left[1]));
	marker.setPosition(latlng);

}

function changeMarkerPositionDeg(marker,lat,lon) {

	var latlng = new google.maps.LatLng(lat,lon);
	marker.setPosition(latlng);

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

function loadTaxonList(clickLatLng){

	var utm= convertLatLongToUTM(clickLatLng.lat(),clickLatLng.lng(),acur,UTMsquare,false);
	window.open("/#/utm?utm="+utm.replace(/_/g, ""),'_self');

}

function changeAccuracy(){

	selected_value = $("input[name='utm']:checked").val();

	if(selected_value=="10km") acur=10000;
	else acur=1000;

}

function setMapUTM(utm,utmPrec){


	$('#utm_value').val(utm);

	// checkUTM(utm)

	utmPrec=checkUTM(utm);


	$('input:radio[name=utm]').val([utmPrec]);
	changeAccuracy();

	if(utmPrec!=''){

		if(polygonSelection!=null) polygonSelection.setMap(null);

		MGRS2LatLong(utm,map,"utm_search");

		centerSquare(utmPrec);

		google.maps.event.addListener(map.map, "tilesloaded", function() {

			if($('#checkUTM').hasClass( "success" )){

				if(UTMsquare!=null) UTMsquare.setMap(null);

			} });

	}
	else{

		$('#labelCheckUTM').show().delay(4000).fadeOut();

	}

	/* if(isUTM(utm,utmPrec)){

            MGRS2LatLong(utm,map,"utm_search");


            centerSquare(utmPrec);

             google.maps.event.addListener(map.map, "tilesloaded", function() {

                        if($('#checkUTM').hasClass( "success" )){

                            UTMsquare.setMap(null);

                        }
            });

           if(UTMsquare!=null) UTMsquare.setMap(null);  

        }
        else{

               $('#checkUTM').addClass('warning');
               $('#checkUTM').removeClass('success');
               $('#btResetUTM').hide();

        }*/

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
			center: new google.maps.LatLng(42.69,0.7841),
			zoom: 7,
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


function getColor(layer,utmString){
	
	if(layer.indexOf("sector") == 0) {
		if (layer.slice(-1) == "A") return {"color":"#E87587","opacity":"0.35"};
		else if (layer.slice(-1) == "B") return {"color":"#A9A8A7","opacity":"0.35"};
		else if (layer.slice(-1) == "C") return {"color":"#E49247","opacity":"0.35"};
		else if (layer.slice(-1) == "D") return {"color":"#56E962","opacity":"0.35"};
		else if (layer.slice(-1) == "E") return {"color":"#43C6DB","opacity":"0.35"};
		else if (layer.slice(-1) == "F") return {"color":"#E9E331","opacity":"0.35"};
		else if (layer.slice(-1) == "G") return {"color":"#E49247","opacity":"0.35"};
		else if (layer.slice(-1) == "H") return {"color":"#E87587","opacity":"0.35"};	
		else return {"color":"#0000FF","opacity":"0.35"};	
	}

	if(layer=='view'){

		return {"color":"#0000FF","opacity":"0.35"};

	}
	else if(layer=='view_api'){

		return {"color":"#"+color,"opacity":"0.35"};

	}
	else if(layer=='utm_search'){

		return {"color":redGrid[parseInt(2)],"opacity":"0.55"};

	}
	else if(layer=='utm_high'){

		return {"color":redGrid[parseInt(5)],"opacity":"0.75"};

	}
	else if(layer=='stats_norm'){

		var count=utmCitationCount.utmList.get(utmString);

		var range=(utmCitationCount.maxNorm-utmCitationCount.minNorm)/utmCitationCount.classes;

		var countNorm= Math.log(count);

		if(countNorm==utmCitationCount.maxNorm) color=5;
		else color=(countNorm-utmCitationCount.minNorm)/(range);

		//console.log("Classes("+utmCitationCount.classes+") "+(countNorm*utmCitationCount.classes)+"  Min: "+utmCitationCount.min+"{"+utmCitationCount.minNorm+"}"+" Max: "+utmCitationCount.max+"{"+utmCitationCount.maxNorm+"}"+" [range:"+range+"] Count (Norm): "+Math.log(count)+" Count: (((["+count+"]))) Color: "+parseInt(color));
		//console.log("Count (Norm): "+Math.log(count)+" Count: (((["+count+"]))) Color: "+parseInt(color));


		return {"color":redGrid[parseInt(color)],"opacity":"0.8","classe":parseInt(color)};

	}
//	else if(layer=='chrono'){}
	else{

		count=utmCitationCount.utmList.get(utmString);

		range=utmCitationCount.max-utmCitationCount.min;

		step=parseInt((utmCitationCount.max-utmCitationCount.min)/5);

		color = (count-1)/step;

		if(color>5) color=5;

		//console.log("Min: "+utmCitationCount.min+" Max: "+utmCitationCount.max+" Count: "+count+" Color: "+parseInt(color));

		return {"color":redGrid[parseInt(color)],"opacity":"0.8","classe":parseInt(color)};
	}


}

function createMap(mapMode,divId) {
	var that = this;
	global_codi_e_poc=getURLParameter("codi_e_poc").replace(/\s+/g, '+');;


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
