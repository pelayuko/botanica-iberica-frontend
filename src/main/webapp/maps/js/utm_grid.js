
function getURLParameter(name) {
	return decodeURIComponent(
			(location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
	);  
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

   	function changeMarkerPositionRad(marker,latlon_left) {

   		var latlng = new google.maps.LatLng(RadToDeg(latlon_left[0]),RadToDeg(latlon_left[1]));
   		marker.setPosition(latlng);

   	}

   	function changeMarkerPositionDeg(marker,lat,lon) {

   		var latlng = new google.maps.LatLng(lat,lon);
   		marker.setPosition(latlng);

   	}	

	
	function UTMObjectNum(zone,x,y, accuracy){
	
		this.zone = zone;
		this.x= x;
        this.y = y;
        
        this.xLetter = getDigraphEast(zone,x);
		this.yLetter = getDigraphNorth(zone,y);
		
		this.xNum=parseInt(x/accuracy)%10;
		this.yNum=parseInt(((y/accuracy)%100)%10);
		
		//this.digraph=determineLetter(this.yLetter,this.yNum);
		
	}

    
	function calculateDistance(lat1, lon1, lat2, lon2){
		
		//changeMarkerPositionDeg(marker0,lat1,lon1);
		//changeMarkerPositionDeg(marker1,lat2,lon2);
		
		var R = 6371; // km
		var dLat = DegToRad(lat2-lat1);
		var dLon = DegToRad(lon2-lon1);
		var lat1 = DegToRad(lat1);
		var lat2 = DegToRad(lat2);

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		
		return d;
			
	}
    
    function calculateUTMOverlap(zone,X_10x10, Y_10x10, right, nextDistance, acur,southernHemis, square,utmCoords){
		
		/* Right Square */
		var latlon_right= new Array(2);
		UTMXYToLatLon(X_10x10+nextDistance,Y_10x10+(acur/2), zone, southernHemis, latlon_right);	
		var utmRight = LatLongToUTM(RadToDeg(latlon_right[0]),RadToDeg(latlon_right[1]));
		
		
		/* Left Square */	
		var latlon_left= new Array(2);
		UTMXYToLatLon(X_10x10-(nextDistance-acur),Y_10x10+(acur/2), zone, southernHemis, latlon_left);	
		var utmLeft = LatLongToUTM(RadToDeg(latlon_left[0]),RadToDeg(latlon_left[1]));
	
		if(right){
			
			if(zone == utmRight.zone ){
			
				nextDistance=nextDistance+acur/40;
				calculateUTMOverlap(zone,X_10x10, Y_10x10, right,nextDistance,acur,southernHemis,square,utmCoords);
				
			}
			else{
				
								
				var utmGrid=utmToLatLonBox(utmRight,acur,southernHemis,zone+1,true,-1);
				
				//UTMotherGreen.setPath(utmGrid);			

				var distance=calculateDistance(utmGrid[1].lat(),utmGrid[1].lng(),utmCoords[0].lat(),utmCoords[0].lng());
				var distance2=calculateDistance(utmGrid[2].lat(),utmGrid[2].lng(),utmCoords[3].lat(),utmCoords[3].lng());
			
				utmMod= new UTMObjectNum(zone,X_10x10+distance*500,Y_10x10, acur);
				topGrid=utmToLatLonBox(utmMod,acur,southernHemis,zone,false);		
				
				utmMod2= new UTMObjectNum(zone,X_10x10+distance2*500,Y_10x10, acur);
				bottomGrid=utmToLatLonBox(utmMod2,acur,southernHemis,zone,false);	
											
				utmCoords[1]=topGrid[0];
				utmCoords[2]=bottomGrid[3];
							
				square.setPath(utmCoords);	
				
				
			/*
	         * 		a******b <--- Upper Right ::: utmCoords[1]
	         * 	 	******** 
	         * 		********
	         * 		d******c <--- LowerRight  ::: utmCoords[2]
	         *  
	         */
							
				
			}
			
		}
		else{
			
			if(zone == utmLeft.zone){
								
				nextDistance=nextDistance+acur/40;
				calculateUTMOverlap(zone,X_10x10, Y_10x10, right,nextDistance,acur,southernHemis,square,utmCoords);
				
			}
			else{

				var utmGridL=utmToLatLonBox(utmLeft,acur,southernHemis,zone+1,true,-1);

				var distanceL=calculateDistance(utmGridL[0].lat(),utmGridL[0].lng(),utmCoords[1].lat(),utmCoords[1].lng());
				var distance2L=calculateDistance(utmGridL[3].lat(),utmGridL[3].lng(),utmCoords[2].lat(),utmCoords[2].lng());
											
				utmMod= new UTMObjectNum(zone,X_10x10-distanceL*500,Y_10x10, acur);
				topGrid=utmToLatLonBox(utmMod,acur,southernHemis,zone,false);		
				
				utmMod2= new UTMObjectNum(zone,X_10x10-distance2L*500,Y_10x10, acur);
				bottomGrid=utmToLatLonBox(utmMod2,acur,southernHemis,zone,false);	
								
				utmCoords[0]=topGrid[1];
				utmCoords[3]=bottomGrid[2];
							
				square.setPath(utmCoords);
									
			}		

		}
	
	}
    
    function isZoneLimit(zone,x,y,acur,southernHemis,square,utmCoords){
	
		var X_10x10=parseInt(x/acur)*acur;
		var Y_10x10=parseInt(y/acur)*acur;

		/* Determining if Right UTM is from another zone */
		var latlon_right= new Array(2);
		UTMXYToLatLon (X_10x10+acur+1,Y_10x10+(acur/2), zone, southernHemis, latlon_right);
                zoneRight = getLongZone(RadToDeg(latlon_right[1]));


		/* Determining if Left UTM is from another zone */	
		var latlon_left= new Array(2);
		UTMXYToLatLon (X_10x10-1,Y_10x10+(acur/2), zone, southernHemis, latlon_left);
                zoneLeft = getLongZone(RadToDeg(latlon_left[1]));

		
		if(zone!=zoneRight){
			
			calculateUTMOverlap(zone,X_10x10,Y_10x10,true,acur/40,acur,southernHemis,square,utmCoords);	 
			return true;

		 
		 }
		 else if(zone!=zoneLeft){
			 
			calculateUTMOverlap(zone,X_10x10,Y_10x10,false,acur/40,acur,southernHemis,square,utmCoords);	 
			return true;
			 
		 }
		  
		 return false;
		
	}
	
	function utmToLatLonBox(utm, accuracy, southernHemis,zone, center,fix) {
		   
		   /*
	         * leftTop	 --> 0******1
	         * (lat/long)	 ******** 
	         * 				 ********
	         * 				(3)*****2 <--- rightBottom (lat,long)
	         *  
	         */


			var latlon_left_bottom= new Array(2);
			var latlon_left_top= new Array(2);
			var latlon_right_top= new Array(2);	
			var latlon_right_bottom= new Array(2); 
			
			var x;
			var y;
			
			if(center){
		
				x=parseInt(utm.x/accuracy)*accuracy;
				y=parseInt(utm.y/accuracy)*accuracy;
		
			}
			else{
				
				x=utm.x;
				y=utm.y;
			
			}

			/* (0) */ UTMXYToLatLon (x,y+accuracy, utm.zone, southernHemis, latlon_left_top);
			/* (1) */ UTMXYToLatLon (x+accuracy,y+accuracy, utm.zone, southernHemis, latlon_right_top);
			/* (2) */ UTMXYToLatLon (x+accuracy,y, utm.zone, southernHemis, latlon_right_bottom);
			/* (3) */ UTMXYToLatLon (x,y, utm.zone, southernHemis, latlon_left_bottom);
			
        	  
	        oppositeUtmCoords = [
				new google.maps.LatLng(RadToDeg(latlon_left_top[0]), RadToDeg(latlon_left_top[1])),
				new google.maps.LatLng(RadToDeg(latlon_right_top[0]),  RadToDeg(latlon_right_top[1])),
				new google.maps.LatLng(RadToDeg(latlon_right_bottom[0]), RadToDeg(latlon_right_bottom[1])),
				new google.maps.LatLng(RadToDeg(latlon_left_bottom[0]), RadToDeg(latlon_left_bottom[1]))				
			];		  
	        	        	        
	        return oppositeUtmCoords;
	        
	    }
	    
