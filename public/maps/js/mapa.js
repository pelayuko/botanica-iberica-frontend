
var acur=1000;
var map;	
var UTMsquare;
//var mode="view";
//var elevator;
//var bounds;
//var current_year;

var gridLayer;
var sectorGridLayer;

var sectorsCount={'sector_1':0,'sector_2':0,'sector_3':0,'sector_4':0,'sector_5':0,'sector_6':0};
var utmSectorsCount={'sector_1':0,'sector_2':0,'sector_3':0,'sector_4':0,'sector_5':0,'sector_6':0};

//var redGrid={'5':'#DC0014','4':'#FF3C14','3':'#FF7814','2':'#FFB414','1':'#FFF014','0':'#F0FF78'};
//var cronoGrid={'old':'#F0FF78','0':'#DC0014','empty':'#BEBEBE','1':'#FF3C14','2':'#FF7814','3':'#FFB414','4':'#FFF014','5':'#F0FF78'};
//var color="0000FF";

var offsetLeft;
var offsetTop;

var citationCount=0;
var utmTotalCount=0;
var citationList = new google.maps.MVCArray(); 

//var polygonSelection;

function getColor(layer,utmString){ //llamada desde doDrawUTMSquare
	if(layer == 'Jaca') {
		return {"color":"#FF0000","opacity":"0.20"};
	}
	else if(layer.indexOf("sector") == 0) {
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

	else if(layer=='view'){

		return {"color":"#0000FF","opacity":"0.35"};

	}
	else if(layer=='JacaGrid'){

		return {"color":"#FF0000","opacity":"0.05"};

	}
	else{}

}

function showUTMSquares(){ //llamada desde pagDeEspecie.html y pagDeZona.html

	if($('#hideCitationsBt').is('.citDisabled')){

		$('#hideCitationsBt').removeClass("citDisabled").addClass("citEnabled");  
		$('#hideCitationsBt').addClass("btn-info");  

		citationList.forEach(function(item,index){

			citationList.getAt(index).setMap(map.map);

		});

	}
	else{


		$('#hideCitationsBt').removeClass("citEnabled").addClass("citDisabled");  
		$('#hideCitationsBt').removeClass("btn-info");  

		citationList.forEach(function(item,index){

			citationList.getAt(index).setMap(null);

		});

	}

}


function loadSectorCount(){ //llamada desde loadUTMsComun

	var count= sectorsCount['sector_1'] +sectorsCount['sector_2']+sectorsCount['sector_3']+sectorsCount['sector_4']+
	sectorsCount['sector_5']+sectorsCount['sector_6'];

	var count_utm=utmSectorsCount['sector_1'] +utmSectorsCount['sector_2']+utmSectorsCount['sector_3']+utmSectorsCount['sector_4']+
	utmSectorsCount['sector_5']+utmSectorsCount['sector_6'];

	updateSectorCounter('sector_1',count,count_utm);
	updateSectorCounter('sector_2',count,count_utm);
	updateSectorCounter('sector_3',count,count_utm);
	updateSectorCounter('sector_4',count,count_utm);
	updateSectorCounter('sector_5',count,count_utm);
	updateSectorCounter('sector_6',count,count_utm);

}

function updateSectorCounter(sectorId,count,count_utm){

	if(sectorsCount[sectorId]==0) {

		$("#"+sectorId).removeClass('badge_'+sectorId); 
		$("#"+sectorId+"_utm").removeClass('badge_'+sectorId);                                 

	}
	else{

		$("#"+sectorId).html(sectorsCount[sectorId]);
		$("#"+sectorId+"_utm").html(utmSectorsCount[sectorId]);

	}

	$("#"+sectorId+"_p").html(((sectorsCount[sectorId]*100)/count).toFixed(2)+"%");
	$("#"+sectorId+"_p_utm").html(((utmSectorsCount[sectorId]*100)/count_utm).toFixed(2)+"%");

}


function createUTMSquare(zone, xy, acur, southernHemis, square){ //llamada desde convertLatLongToUTM
	
	var X_10x10=parseInt(xy[0]/acur)*acur;
	var Y_10x10=parseInt(xy[1]/acur)*acur;
	
	var latlon_left_bottom= new Array(2);
	var latlon_left_top= new Array(2);
	var latlon_right_top= new Array(2);	
	var latlon_right_bottom= new Array(2);
	
	var latlon_center= new Array(2);

        
	UTMXYToLatLon (X_10x10,Y_10x10, zone, southernHemis, latlon_left_bottom);
	UTMXYToLatLon (X_10x10,Y_10x10+acur, zone, southernHemis, latlon_left_top);
	UTMXYToLatLon (X_10x10+acur,Y_10x10+acur, zone, southernHemis, latlon_right_top);
	UTMXYToLatLon (X_10x10+acur,Y_10x10, zone, southernHemis, latlon_right_bottom);
	
	
	UTMXYToLatLon (X_10x10+acur/2,Y_10x10+acur/2, zone, southernHemis, latlon_center);


	var utmCoords = [
			new google.maps.LatLng(RadToDeg(latlon_left_top[0]), RadToDeg(latlon_left_top[1])),
			new google.maps.LatLng(RadToDeg(latlon_right_top[0]),  RadToDeg(latlon_right_top[1])),
			new google.maps.LatLng(RadToDeg(latlon_right_bottom[0]), RadToDeg(latlon_right_bottom[1])),
			new google.maps.LatLng(RadToDeg(latlon_left_bottom[0]), RadToDeg(latlon_left_bottom[1]))
			
	];	
  
	square.setPath(utmCoords);
    
	return utmCoords;
  
}
	
function addUTM(utm,map,sector){ //llamada desde loadUTMsTaxon y loadUTMsComun

	if(map.utmListHash.get(utm)){

	}
	else{
		if(sector == "Jaca") drawUTMSquare(utm,map,sector);
		else {
			if(utm.length>=7) {

				utmTotalCount++;
				utmSectorsCount['sector_'+sector]=utmSectorsCount['sector_'+sector]+1;

			}
			drawUTMSquare(utm,map,map.mode);  
		}

		map.utmListHash.put(utm,1);

	}

}

function drawUTMSquare(utm,map,layer){ //llamada desde addUTM y looadAllUTMsSector

	var prec=10000;

	if(utm.length==9){

		prec=1000;
	}

	var zone=parseInt(utm.substring(0,2));

	var latZone=utm.substring(2,3);
	var latZoneDegree = getLatZoneDegree(latZone);

	var digraph1_X=utm.substring(3,4);
	var digraph2_Y=utm.substring(4,5);

	var leng=utm.length;
	var ENdistance=(leng-5)/2;

	var easting=parseInt(utm.substring(5,ENdistance+5))*prec;
	var northing=parseInt(utm.substring(ENdistance+5,leng))*prec;

	var a1 = latZoneDegree * 40000000 / 360.0;

	if(latZone=='R'){

		a2 =2000000;

	}
	else if (latZone=='U' && latZone=='T' && latZone=='S') a2 = 2000000 * Math.floor(a1 / 2000000.0);
	else a2 = 4000000;

	if(zone=='30' && latZone=='U' && digraph2_Y=="V"){

		a2=6000000;

	} 

	if(zone=='29' && latZone=='S'  && digraph2_Y>"Q" && digraph2_Y<"V"){ 

		a2=2000000;

	}

	var digraph2Index = getDigraph2Index(digraph2_Y);

	var startindexEquator = 1;

	if ((1 + zone % 2) == 1){

		startindexEquator = 6;

	}

	var a3 = a2 + (digraph2Index - startindexEquator) * 100000;
	if (a3 <= 0)
	{
		a3 = 10000000 + a3;
	}

	northing = a3 + northing;

	zoneCM = -183 + 6 * zone;
	var digraph1Index = getDigraph1Index(digraph1_X);
	var a5 = 1 + zone % 3;
	var a6 = [ 16, 0, 8 ];
	var a7 = 100000 * (digraph1Index - a6[a5 - 1]);

	easting = easting + a7;

	var utmSq=doDrawUTMSquare(zone, easting,northing,prec,false,utm,map,layer);


}

function doDrawUTMSquare(zone,easting, northing, acur,southernHemis,utmString,map,layer){

	var X_10x10=parseInt(easting);
	var Y_10x10=parseInt(northing);

	var latlon_left_bottom= new Array(2);
	var latlon_left_top= new Array(2);
	var latlon_right_top= new Array(2);	
	var latlon_right_bottom= new Array(2);

	UTMXYToLatLon (X_10x10,Y_10x10, zone, southernHemis, latlon_left_bottom);
	UTMXYToLatLon (X_10x10,Y_10x10+acur, zone, southernHemis, latlon_left_top);
	UTMXYToLatLon (X_10x10+acur,Y_10x10+acur, zone, southernHemis, latlon_right_top);
	UTMXYToLatLon (X_10x10+acur,Y_10x10, zone, southernHemis, latlon_right_bottom);

	var utmCoords = [
	                 new google.maps.LatLng(RadToDeg(latlon_left_top[0]), RadToDeg(latlon_left_top[1])),
	                 new google.maps.LatLng(RadToDeg(latlon_right_top[0]),  RadToDeg(latlon_right_top[1])),
	                 new google.maps.LatLng(RadToDeg(latlon_right_bottom[0]), RadToDeg(latlon_right_bottom[1])),
	                 new google.maps.LatLng(RadToDeg(latlon_left_bottom[0]), RadToDeg(latlon_left_bottom[1]))

	                 ];	

	//


	var  colorObj=getColor(layer, utmString);
	var nivel=1000;
	if(layer.indexOf("sector") == 0) nivel = 1;
	else if(layer == "JacaGrid") nivel = 2;
	else if(layer == "Jaca") nivel = 3;

	var UTMotherBlue = new google.maps.Polygon({

		paths: utmCoords,
		strokeColor: colorObj.color,
		strokeOpacity: 0.8,
		strokeWeight: 1,
		fillColor: colorObj.color,
		fillOpacity: colorObj.opacity,
		id: utmString,
		zIndex: nivel

	}); 

	UTMotherBlue.setPath(utmCoords);
	UTMotherBlue.setMap(map.map);


//	isZoneLimit(zone,X_10x10,Y_10x10,acur,southernHemis,UTMotherBlue,utmCoords);

	/*$('#map_info').append(group+"; "+utmString+"; \n");
		$('#map_info').append(utmCoords[0].lng()+", "+utmCoords[0].lat()+" \n");
		$('#map_info').append(utmCoords[1].lng()+", "+utmCoords[1].lat()+" \n");
		$('#map_info').append(utmCoords[2].lng()+", "+utmCoords[2].lat()+" \n");
		$('#map_info').append(utmCoords[3].lng()+", "+utmCoords[3].lat()+" \n");
		$('#map_info').append(utmCoords[0].lng()+", "+utmCoords[0].lat()+",100 	\n");
		$('#map_info').append("<br/>");*/

	if(layer=='JacaGrid') utmGridList.push(UTMotherBlue);
//	else if(layer=='utm_search') polygonSelection=UTMotherBlue;
	else citationList.push(UTMotherBlue); // if(layer=='view' || layer=='view_api')

	if(acur >= 1000){ //== 10000

		google.maps.event.addListener(UTMotherBlue, 'click', function(event) {

			if(layer=="view" || layer.indexOf("sector") == 0){ // view_api // 

//				getAltitud(event, map);
//				loadTaxonList(event.latLng);
				if (acur == 1000) {
					var utm= UTMotherBlue.id; //convertLatLongToUTM(event.latLng.lat(),event.latLng.lng(),acur,UTMotherBlue,false);
					window.open("/#/utm?utm="+utm.replace(/_/g, ""),'_self');
				}
				else loadTaxonList(event.latLng);
//				infowindow = new google.maps.InfoWindow();
//				infowindow.setContent("<div id=\"infoWindow\"><p><span class=\"text-info\"><b>UTM:</b> </span>"+utmString+"</p> " +
//						"<p><span class=\"text-info\"><b>Alt.: </b></span>"+ getElevation(event.latLng)+"</p></div>" );
//
//				infowindow.setPosition(event.latLng);
//
//				infowindow.open(map.map); 

			}

			else{

				infowindow = new google.maps.InfoWindow();
				infowindow.setContent("<div id=\"infoWindow\"><p><span class=\"text-info\"><b>UTM:</b> </span>"+utmString+"</p>"+
						"<p><span class=\"text-info\"><b>"+getTranslation(utmCount)+": </b></span>"+utmCitationCount.utmList.get(utmString)+"</p>"+
						"<p><span class=\"text-info\"><b>"+getTranslation(utmClass)+": </b></span> <span class=\"legendItem legend"+colorObj.classe+"\"></span> </p></div>" );

				infowindow.setPosition(event.latLng);

				infowindow.open(map.map);

			} 

		});

		google.maps.event.addListener(UTMotherBlue, 'mouseover', function(event) {

			if(layer=="view"){

				$('#map_info').html("<span class=\"label label-info\">UTM</span> "+UTMotherBlue.id);

			}

		});

	}

	return UTMotherBlue;

}

function changeAccuracy(){

	selected_value = $("input[name='utm']:checked").val();

	if(selected_value=="10km") acur=10000;
	else acur=1000;

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
		$('#map_info').html("<span class=\"label label-info\">UTM</span> "
				+ getMGRSLabelTextAndSquare(getLatLngByOffset(map.map,posx,posy),UTMsquare));

	});

	$('#'+map.div).mouseout(function(evt){

		$('#map_info').hide();
		UTMsquare.setPath([]);

	});

	google.maps.event.addListener(map.map, 'click', function(event) {

		loadTaxonList(event.latLng);
	})  ;   

}

function setMapViewMode(){
	var that = this;

	$('#map_info').hide();

	$('#'+map.div).mousemove(function(evt){

		if($('#addGridBt').is('.gridEnabled')){
			var posx = evt.pageX-offsetLeft;
			var posy = evt.pageY-offsetTop;
	
			$('#map_info').show();        
			$('#map_info').html("<span class=\"label label-info\">UTM</span> "
					+ getMGRSLabelText(getLatLngByOffset(map.map,posx,posy)));
		};

	});

	$('#'+map.div).mouseout(function(evt){

		$('#map_info').hide();

	});

}

function loadTaxonList(clickLatLng){

	var utm= convertLatLongToUTM(clickLatLng.lat(),clickLatLng.lng(),acur,UTMsquare,false);
	window.open("/#/utm?utm="+utm.replace(/_/g, ""),'_self');

}

function loadAllUTMsSector(sector){  //llamada desde loadSectorGrid()
	citationList.clear();
	$.getJSON(serverUrl + "/utmSector", function(data) {
		for (var i = 0; i < data.length; i++) {
			// FIXME: solve 30T --> backend or db??
			drawUTMSquare('30T' + data[i]['utm'], map, "sector:"+data[i]['sector']);     
		}	});       
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

//		$('#dvLoading').fadeOut(2000);

		$('#citationCount').html(citationCount);
		$('#utmCount').html(utmTotalCount);

//		selectUTMSquare();

		citationCount=0;
		utmTotalCount=0;

//			if ($("#chart_div").length > 0) drawChart();

		if ($("#sectorTable").length > 0) loadSectorCount();           

	});       
}

function loadSectorGrid( setListener ){
	if($('#addSectorGridBt').is('.sectorGridDisabled')){

		sectorGridLayer = new google.maps.KmlLayer( 
				'https://www.google.com/maps/d/kml?mid=1Zqp6K08TKIwS927V282vuHEx0AM'
				,{
			map: map.map,
			preserveViewport: true,
			suppressInfoWindows: true,
			clickable: setListener
		});
		
		if ( setListener ) {
			google.maps.event.addListener(sectorGridLayer, 'click', function (event) {
				loadTaxonList(event.latLng);
			});  		
		}
		
		$('#addSectorGridBt').removeClass("sectorGridDisabled").addClass("sectorGridEnabled").addClass('btn-success');

	}
	else{

		sectorGridLayer.setMap(null);
		$('#addSectorGridBt').removeClass("sectorGridEnabled").removeClass('btn-success').addClass("sectorGridDisabled");

	}

}

function loadUTMGrid(){

	if($('#addGridBt').is('.gridDisabled')){
		// this.gridLayer = new google.maps.KmlLayer(baseUrl+'resources/homegrid.kml',{

		this.gridLayer = new google.maps.KmlLayer(
				'https://www.google.com/maps/d/kml?mid=1i9FS2mhzCVyD7gs89gn1Rn90zJQ'
				,{
			map: map.map,
			preserveViewport: false,
			suppressInfoWindows: true
		});

//		google.maps.event.addListener(this.gridLayer, 'click', function (event) {
//			loadTaxonList(event.latLng);
//		});     

		$('#addGridBt').removeClass("gridDisabled").addClass("gridEnabled").addClass('btn-success');
		updateOffset(map.div);

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

//	if(mapMode==='view_api') mapOptions.zoom=6;

	this.map = new google.maps.Map(document.getElementById(divId),mapOptions);

	this.utmListHash = new Hashtable();

}

function createMap(mapMode,divId) {
	var that = this;

	try {
		map=new MapView(mapMode,divId);
//		elevator = new google.maps.ElevationService();
//		mode=mapMode;
//		current_year=new Date().getFullYear();
		google.maps.event.addListenerOnce(map.map, 'idle', function(){

			/* Homepage map  */
			if(map.mode=="search"){
				$('#utm_radio').show();
				$('#utm_radio').change(function(){
					changeAccuracy();
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

			else if(map.mode=="view"){						 
				$('#utm_radio').hide();
				setMapViewMode();
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
