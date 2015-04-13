
var citationCount=0;
var utmTotalCount=0;
var citationList = new google.maps.MVCArray(); 

var utmSectorList = new google.maps.MVCArray(); 

var polygonSelection;

var utmCitationCount=new CitationCount();



function CitationCount(){

	this.max=0;
	this.min=-1;

	this.utmList = new Hashtable(); 

//	this.synonims=0;

	this.maxNorm=0;
	this.minNorm=0; 

	this.pasNorm=0;

	this.classes=6;

}


function showUTMSquares(){ //llamada desde pagDeEspecie.html y pagDeZona.html


	if($('#hideCitationsBt').is('.citDisabled')){

		$('#hideCitationsBt').removeClass("citDisabled").addClass("citEnabled");  
		$('#hideCitationsBt').addClass("btn-info");  

		citationList.forEach(function(item,index){

			citationList.getAt(index).setMap(map.map);

		});

//		if($('#showCitationsStats').is('.showStatsEnabled')) showStats();

	}
	else{


		$('#hideCitationsBt').removeClass("citEnabled").addClass("citDisabled");  
		$('#hideCitationsBt').removeClass("btn-info");  


		citationList.forEach(function(item,index){

			citationList.getAt(index).setMap(null);

		});

		//if($('#showCitationsStats').is('.showStatsDisabled')) showStats();

	}

}

function loadAllUTMsSector(sector){  //llamada desde loadSectorGrid()
	$.getJSON(serverUrl + "/utmSector", function(data) {
		for (var i = 0; i < data.length; i++) {
			// FIXME: solve 30T --> backend or db??
			MGRS2LatLong('30T' + data[i]['utm'], map, "sector:"+data[i]['sector']);     
		}	});       
}

function borraUTMList(){   //llamada desde loadSectorGrid()
	utmSectorList.forEach(function(item,index){
//		console.log("borrando")
//		utmSectorList.getAt(index).setMap(null);
		utmSectorList.pop();
	}); 
}

function loadUTMsZona(zona){  //llamada desde pagDeZona.html
	loadUTMsComun("/listaCitasByUtmsZona?zona="+zona);
}

function loadUTMsTaxon(taxon){   //llamada desde pagDeEspecie.html
	loadUTMsComun("/listaCitasByUtmsTaxon?taxon="+taxon)
}

// FIXME: move to angular!!
function loadUTMsComun(consulta){   //llamada desde pagDeEspecie.html
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

		selectUTMSquare();

		citationCount=0;

//			if ($("#chart_div").length > 0) drawChart();

		if ($("#sectorTable").length > 0) loadSectorCount();           

	});       
}

function selectUTMSquare(){

	utm=getURLParameter("utm"); 

	if(utm){

		citationList.forEach(function(item,index){

			square=citationList.getAt(index);

			if(square.id==utm){

				colorObj=getColor('utm_high',utm);

				square.strokeColor=colorObj.color;
				square.fillColor=colorObj.color;
				square.fillOpacity=colorObj.opacity;
			}
			
		});
	}
}

function loadSectorCount(){

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


function addUTM(utm,map,sector){

	if(map.utmListHash.get(utm)){

	}
	else{

		if(utm.length>=7) {

			utmTotalCount++;
			utmSectorsCount['sector_'+sector]=utmSectorsCount['sector_'+sector]+1;

		}
		MGRS2LatLong(utm,map,map.mode);  
		map.utmListHash.put(utm,1);

	}

}


function MGRS2LatLong(utm,map,layer){

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

	var utmSq=drawUTMSquare(zone, easting,northing,prec,false,utm,map,layer);


}

function drawUTMSquare(zone,easting, northing, acur,southernHemis,utmString,map,layer){

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

	var UTMotherBlue = new google.maps.Polygon({

		paths: utmCoords,
		strokeColor: colorObj.color,
		strokeOpacity: 0.8,
		strokeWeight: 1,
		fillColor: colorObj.color,
		fillOpacity: colorObj.opacity,
		id: utmString

	}); 

	UTMotherBlue.setPath(utmCoords);
	UTMotherBlue.setMap(map.map);



	isZoneLimit(zone,X_10x10,Y_10x10,acur,southernHemis,UTMotherBlue,utmCoords);

	/*$('#map_info').append(group+"; "+utmString+"; \n");
		$('#map_info').append(utmCoords[0].lng()+", "+utmCoords[0].lat()+" \n");
		$('#map_info').append(utmCoords[1].lng()+", "+utmCoords[1].lat()+" \n");
		$('#map_info').append(utmCoords[2].lng()+", "+utmCoords[2].lat()+" \n");
		$('#map_info').append(utmCoords[3].lng()+", "+utmCoords[3].lat()+" \n");
		$('#map_info').append(utmCoords[0].lng()+", "+utmCoords[0].lat()+",100 	\n");
		$('#map_info').append("<br/>");*/

	if(layer.indexOf("sector") == 0) utmSectorList.push(UTMotherBlue);
	else if(layer=='utm_search') polygonSelection=UTMotherBlue;
	else citationList.push(UTMotherBlue); // if(layer=='view' || layer=='view_api')

	if(acur >= 1000){ //== 10000

		google.maps.event.addListener(UTMotherBlue, 'click', function(event) {

			if(layer=="view" || layer.indexOf("sector") == 0){ // view_api

//				getAltitud(event, map);
//				loadTaxonList(event.latLng);
				var utm= UTMotherBlue.id; //convertLatLongToUTM(event.latLng.lat(),event.latLng.lng(),acur,UTMotherBlue,false);
				window.open("/#/utm?utm="+utm.replace(/_/g, ""),'_self');
				
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