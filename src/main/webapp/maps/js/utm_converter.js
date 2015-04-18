var pi = 3.14159265358979;

    /* Ellipsoid model constants (actual values here are for WGS84) */
    var sm_a = 6378137.0;
    var sm_b = 6356752.314;
    var sm_EccSquared = 6.69437999013e-03;

    var UTMScaleFactor = 0.9996;


	/* per a determinar digraph */

var digraph1 = {1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H", 9: "J", 10: "K", 11: "L", 12: "M", 
	13: "N", 14: "P", 15: "Q", 16: "R", 17: "S", 18: "T", 19: "U", 20: "V", 21: "W", 22: "X", 23: "Y", 24: "Z"};
	
             
 var digraph2 = {0 : "V", 1 : "A", 2 : "B", 3 : "C", 4 : "D", 5 : "E", 6 : "F", 7 : "G", 8 : "H", 9 : "J", 10 : "K", 
 11 : "L", 12 : "M", 13 : "N", 14 : "P", 15 : "Q", 16 : "R", 17 : "S", 18 : "T", 19 : "U", 20 : "V"};       


	/* per a determinar inversament el digraph */

	var digraph1Array = [ "A", "B", "C", "D", "E", "F", "G", "H","J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
        "Y", "Z" ];
    
    var digraph2Array = [ "V", "A", "B", "C", "D", "E", "F", "G",
        "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"];     


	/* per a determinar el fus*/

  var letters = [ 'A', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
        'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Z' ];

   var degrees = [ -90, -84, -72, -64, -56, -48, -40, -32, -24, -16,
        -8, 0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 84 ];

   var negLetters = [ 'A', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
        'L', 'M' ];

   var negDegrees = [-90, -84, -72, -64, -56, -48, -40, -32, -24,
        -16, -8 ];

   var posLetters = [ 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
        'X', 'Z' ];

    var posDegrees = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 84 ];

    var arrayLength = 22;


	function getLatZone(latitude)
    {
      var latIndex = -2;
      var lat = parseInt(latitude);

      if (lat >= 0)
      {
        var len = posLetters.length;
        for (var i = 0; i < len; i++)
        {
          if (lat == posDegrees[i])
          {
            latIndex = i;
            break;
          }

          if (lat > posDegrees[i])
          {
            continue;
          }
          else
          {
            latIndex = i - 1;
            break;
          }
        }
      }
      else
      {
        var len = negLetters.length;
        
        for (var i = 0; i < len; i++)
        {
          if (lat == negDegrees[i])
          {
            latIndex = i;
            break;
          }

          if (lat < negDegrees[i])
          {
            latIndex = i - 1;
            break;
          }
          else
          {
            continue;
          }

        }

      }

      if (latIndex == -1)
      {
        latIndex = 0;
      }
      if (lat >= 0)
      {
        if (latIndex == -2)
        {
          latIndex = posLetters.length - 1;
        }
        return String(posLetters[latIndex]);
      }
      else
      {
        if (latIndex == -2)
        {
          latIndex = negLetters.length - 1;
        }
        return String(negLetters[latIndex]);

      }
    }

  function getLatZoneDegree(letter)
    {
      var ltr = letter.charAt(0);
      
      for (var i = 0; i < arrayLength; i++){
		  
        if (letters[i] == ltr)
        {
          return degrees[i];
        }
      }
      
      return -100;
    }


  function getDigraphEast(longZone, easting){
		
      var a1 = longZone;
      var a2 = 8 * ((a1 - 1) % 3) + 1;

      var a3 = easting;
      var a4 = a2 + (parseInt(a3 / 100000)) - 1;
      
      var result=digraph1[Math.floor(a4)];
      
      return result;
            
    }
    
    function getDigraphNorth(longZone,northing){
		      
      var a1 = longZone;
      var a2 = 1 + 5 * ((a1 - 1) % 2);
      
      var a3 = northing;
      var a4 = (a2 + (parseInt(a3 / 100000)));
      
      a4 = (a2 + (parseInt(a3 / 100000.0))) % 20;
      a4 = Math.floor(a4);
      
      if (a4 < 0){
		  
        a4 = a4 + 19;
        
      }
      
      var result=digraph2[Math.floor(a4)];
      
      return result;

    }
    
    function getDigraph1Index(letter)
    {
      for (var i = 0; i < digraph1Array.length; i++)
      {
        if (digraph1Array[i]==letter)
        {
          return i + 1;
        }
      }

      return -1;
    }

    function getDigraph2Index(letter)
    {
      for (var i = 0; i < digraph2Array.length; i++)
      {
        if (digraph2Array[i]==letter)
        {
          return i;
        }
      }

      return -1;
    }
    
    
    function isSouthernHem(lat){
	
	     if (lat < 0) return true;
		 else return false;
		 
	}
    
    function getLongZone(longitude){
		
      var longZone = 0;
      
      if (longitude < 0.0){
		  
        longZone = ((180.0 + longitude) / 6) + 1;
        
      }
      else{
		  
        longZone = (longitude / 6) + 31;
      }
      
      var val = String(parseInt(longZone));
      
      if (val.length == 1){
		  
        val = "0" + val;
      }
      
      return val;
    }
    

    /*
    * DegToRad
    *
    * Converts degrees to radians.
    *
    */
    function DegToRad (deg)
    {
        return (deg / 180.0 * pi)
    }


    /*
    * RadToDeg
    *
    * Converts radians to degrees.
    *
    */
    function RadToDeg (rad)
    {
        return (rad / pi * 180.0)
    }

    /*
    * ArcLengthOfMeridian
    *
    * Computes the ellipsoidal distance from the equator to a point at a
    * given latitude.
    *
    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
    * GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
    *
    * Inputs:
    *     phi - Latitude of the point, in radians.
    *
    * Globals:
    *     sm_a - Ellipsoid model major axis.
    *     sm_b - Ellipsoid model minor axis.
    *
    * Returns:
    *     The ellipsoidal distance of the point from the equator, in meters.
    *
    */
    function ArcLengthOfMeridian (phi)
    {
        var alpha, beta, gamma, delta, epsilon, n;
        var result;

        /* Precalculate n */
        n = (sm_a - sm_b) / (sm_a + sm_b);

        /* Precalculate alpha */
        alpha = ((sm_a + sm_b) / 2.0)
           * (1.0 + (Math.pow (n, 2.0) / 4.0) + (Math.pow (n, 4.0) / 64.0));

        /* Precalculate beta */
        beta = (-3.0 * n / 2.0) + (9.0 * Math.pow (n, 3.0) / 16.0)
           + (-3.0 * Math.pow (n, 5.0) / 32.0);

        /* Precalculate gamma */
        gamma = (15.0 * Math.pow (n, 2.0) / 16.0)
            + (-15.0 * Math.pow (n, 4.0) / 32.0);

        /* Precalculate delta */
        delta = (-35.0 * Math.pow (n, 3.0) / 48.0)
            + (105.0 * Math.pow (n, 5.0) / 256.0);

        /* Precalculate epsilon */
        epsilon = (315.0 * Math.pow (n, 4.0) / 512.0);

    /* Now calculate the sum of the series and return */
    result = alpha
        * (phi + (beta * Math.sin (2.0 * phi))
            + (gamma * Math.sin (4.0 * phi))
            + (delta * Math.sin (6.0 * phi))
            + (epsilon * Math.sin (8.0 * phi)));

    return result;
    }



    /*
    * UTMCentralMeridian
    *
    * Determines the central meridian for the given UTM zone.
    *
    * Inputs:
    *     zone - An integer value designating the UTM zone, range [1,60].
    *
    * Returns:
    *   The central meridian for the given UTM zone, in radians, or zero
    *   if the UTM zone parameter is outside the range [1,60].
    *   Range of the central meridian is the radian equivalent of [-177,+177].
    *
    */
    function UTMCentralMeridian (zone)
    {
        var cmeridian;

        cmeridian = DegToRad (-183.0 + (zone * 6.0));

        return cmeridian;
    }


    /*
    * FootpointLatitude
    *
    * Computes the footpoint latitude for use in converting transverse
    * Mercator coordinates to ellipsoidal coordinates.
    *
    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
    *   GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
    *
    * Inputs:
    *   y - The UTM northing coordinate, in meters.
    *
    * Returns:
    *   The footpoint latitude, in radians.
    *
    */
    function FootpointLatitude (y)
    {
        var y_, alpha_, beta_, gamma_, delta_, epsilon_, n;
        var result;

        /* Precalculate n (Eq. 10.18) */
        n = (sm_a - sm_b) / (sm_a + sm_b);

        /* Precalculate alpha_ (Eq. 10.22) */
        /* (Same as alpha in Eq. 10.17) */
        alpha_ = ((sm_a + sm_b) / 2.0)
            * (1 + (Math.pow (n, 2.0) / 4) + (Math.pow (n, 4.0) / 64));

        /* Precalculate y_ (Eq. 10.23) */
        y_ = y / alpha_;

        /* Precalculate beta_ (Eq. 10.22) */
        beta_ = (3.0 * n / 2.0) + (-27.0 * Math.pow (n, 3.0) / 32.0)
            + (269.0 * Math.pow (n, 5.0) / 512.0);

        /* Precalculate gamma_ (Eq. 10.22) */
        gamma_ = (21.0 * Math.pow (n, 2.0) / 16.0)
            + (-55.0 * Math.pow (n, 4.0) / 32.0);

        /* Precalculate delta_ (Eq. 10.22) */
        delta_ = (151.0 * Math.pow (n, 3.0) / 96.0)
            + (-417.0 * Math.pow (n, 5.0) / 128.0);

        /* Precalculate epsilon_ (Eq. 10.22) */
        epsilon_ = (1097.0 * Math.pow (n, 4.0) / 512.0);

        /* Now calculate the sum of the series (Eq. 10.21) */
        result = y_ + (beta_ * Math.sin (2.0 * y_))
            + (gamma_ * Math.sin (4.0 * y_))
            + (delta_ * Math.sin (6.0 * y_))
            + (epsilon_ * Math.sin (8.0 * y_));

        return result;
    }


    /*
    * MapLatLonToXY
    *
    * Converts a latitude/longitude pair to x and y coordinates in the
    * Transverse Mercator projection.  Note that Transverse Mercator is not
    * the same as UTM; a scale factor is required to convert between them.
    *
    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
    * GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
    *
    * Inputs:
    *    phi - Latitude of the point, in radians.
    *    lambda - Longitude of the point, in radians.
    *    lambda0 - Longitude of the central meridian to be used, in radians.
    *
    * Outputs:
    *    xy - A 2-element array containing the x and y coordinates
    *         of the computed point.
    *
    * Returns:
    *    The function does not return a value.
    *
    */
    function MapLatLonToXY (phi, lambda, lambda0, xy)
    {
        var N, nu2, ep2, t, t2, l;
        var l3coef, l4coef, l5coef, l6coef, l7coef, l8coef;
        var tmp;

        /* Precalculate ep2 */
        ep2 = (Math.pow (sm_a, 2.0) - Math.pow (sm_b, 2.0)) / Math.pow (sm_b, 2.0);

        /* Precalculate nu2 */
        nu2 = ep2 * Math.pow (Math.cos (phi), 2.0);

        /* Precalculate N */
        N = Math.pow (sm_a, 2.0) / (sm_b * Math.sqrt (1 + nu2));

        /* Precalculate t */
        t = Math.tan (phi);
        t2 = t * t;
        tmp = (t2 * t2 * t2) - Math.pow (t, 6.0);

        /* Precalculate l */
        l = lambda - lambda0;

        /* Precalculate coefficients for l**n in the equations below
           so a normal human being can read the expressions for easting
           and northing
           -- l**1 and l**2 have coefficients of 1.0 */
        l3coef = 1.0 - t2 + nu2;

        l4coef = 5.0 - t2 + 9 * nu2 + 4.0 * (nu2 * nu2);

        l5coef = 5.0 - 18.0 * t2 + (t2 * t2) + 14.0 * nu2
            - 58.0 * t2 * nu2;

        l6coef = 61.0 - 58.0 * t2 + (t2 * t2) + 270.0 * nu2
            - 330.0 * t2 * nu2;

        l7coef = 61.0 - 479.0 * t2 + 179.0 * (t2 * t2) - (t2 * t2 * t2);

        l8coef = 1385.0 - 3111.0 * t2 + 543.0 * (t2 * t2) - (t2 * t2 * t2);

        /* Calculate easting (x) */
        xy[0] = N * Math.cos (phi) * l
            + (N / 6.0 * Math.pow (Math.cos (phi), 3.0) * l3coef * Math.pow (l, 3.0))
            + (N / 120.0 * Math.pow (Math.cos (phi), 5.0) * l5coef * Math.pow (l, 5.0))
            + (N / 5040.0 * Math.pow (Math.cos (phi), 7.0) * l7coef * Math.pow (l, 7.0));

        /* Calculate northing (y) */
        xy[1] = ArcLengthOfMeridian (phi)
            + (t / 2.0 * N * Math.pow (Math.cos (phi), 2.0) * Math.pow (l, 2.0))
            + (t / 24.0 * N * Math.pow (Math.cos (phi), 4.0) * l4coef * Math.pow (l, 4.0))
            + (t / 720.0 * N * Math.pow (Math.cos (phi), 6.0) * l6coef * Math.pow (l, 6.0))
            + (t / 40320.0 * N * Math.pow (Math.cos (phi), 8.0) * l8coef * Math.pow (l, 8.0));

        return;
    }



    /*
    * MapXYToLatLon
    *
    * Converts x and y coordinates in the Transverse Mercator projection to
    * a latitude/longitude pair.  Note that Transverse Mercator is not
    * the same as UTM; a scale factor is required to convert between them.
    *
    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
    *   GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
    *
    * Inputs:
    *   x - The easting of the point, in meters.
    *   y - The northing of the point, in meters.
    *   lambda0 - Longitude of the central meridian to be used, in radians.
    *
    * Outputs:
    *   philambda - A 2-element containing the latitude and longitude
    *               in radians.
    *
    * Returns:
    *   The function does not return a value.
    *
    * Remarks:
    *   The local variables Nf, nuf2, tf, and tf2 serve the same purpose as
    *   N, nu2, t, and t2 in MapLatLonToXY, but they are computed with respect
    *   to the footpoint latitude phif.
    *
    *   x1frac, x2frac, x2poly, x3poly, etc. are to enhance readability and
    *   to optimize computations.
    *
    */
    function MapXYToLatLon (x, y, lambda0, philambda)
    {
        var phif, Nf, Nfpow, nuf2, ep2, tf, tf2, tf4, cf;
        var x1frac, x2frac, x3frac, x4frac, x5frac, x6frac, x7frac, x8frac;
        var x2poly, x3poly, x4poly, x5poly, x6poly, x7poly, x8poly;

        /* Get the value of phif, the footpoint latitude. */
        phif = FootpointLatitude (y);

        /* Precalculate ep2 */
        ep2 = (Math.pow (sm_a, 2.0) - Math.pow (sm_b, 2.0))
              / Math.pow (sm_b, 2.0);

        /* Precalculate cos (phif) */
        cf = Math.cos (phif);

        /* Precalculate nuf2 */
        nuf2 = ep2 * Math.pow (cf, 2.0);

        /* Precalculate Nf and initialize Nfpow */
        Nf = Math.pow (sm_a, 2.0) / (sm_b * Math.sqrt (1 + nuf2));
        Nfpow = Nf;

        /* Precalculate tf */
        tf = Math.tan (phif);
        tf2 = tf * tf;
        tf4 = tf2 * tf2;

        /* Precalculate fractional coefficients for x**n in the equations
           below to simplify the expressions for latitude and longitude. */
        x1frac = 1.0 / (Nfpow * cf);

        Nfpow *= Nf;   /* now equals Nf**2) */
        x2frac = tf / (2.0 * Nfpow);

        Nfpow *= Nf;   /* now equals Nf**3) */
        x3frac = 1.0 / (6.0 * Nfpow * cf);

        Nfpow *= Nf;   /* now equals Nf**4) */
        x4frac = tf / (24.0 * Nfpow);

        Nfpow *= Nf;   /* now equals Nf**5) */
        x5frac = 1.0 / (120.0 * Nfpow * cf);

        Nfpow *= Nf;   /* now equals Nf**6) */
        x6frac = tf / (720.0 * Nfpow);

        Nfpow *= Nf;   /* now equals Nf**7) */
        x7frac = 1.0 / (5040.0 * Nfpow * cf);

        Nfpow *= Nf;   /* now equals Nf**8) */
        x8frac = tf / (40320.0 * Nfpow);

        /* Precalculate polynomial coefficients for x**n.
           -- x**1 does not have a polynomial coefficient. */
        x2poly = -1.0 - nuf2;

        x3poly = -1.0 - 2 * tf2 - nuf2;

        x4poly = 5.0 + 3.0 * tf2 + 6.0 * nuf2 - 6.0 * tf2 * nuf2
        	- 3.0 * (nuf2 *nuf2) - 9.0 * tf2 * (nuf2 * nuf2);

        x5poly = 5.0 + 28.0 * tf2 + 24.0 * tf4 + 6.0 * nuf2 + 8.0 * tf2 * nuf2;

        x6poly = -61.0 - 90.0 * tf2 - 45.0 * tf4 - 107.0 * nuf2
        	+ 162.0 * tf2 * nuf2;

        x7poly = -61.0 - 662.0 * tf2 - 1320.0 * tf4 - 720.0 * (tf4 * tf2);

        x8poly = 1385.0 + 3633.0 * tf2 + 4095.0 * tf4 + 1575 * (tf4 * tf2);

        /* Calculate latitude */
        philambda[0] = phif + x2frac * x2poly * (x * x)
        	+ x4frac * x4poly * Math.pow (x, 4.0)
        	+ x6frac * x6poly * Math.pow (x, 6.0)
        	+ x8frac * x8poly * Math.pow (x, 8.0);

        /* Calculate longitude */
        philambda[1] = lambda0 + x1frac * x
        	+ x3frac * x3poly * Math.pow (x, 3.0)
        	+ x5frac * x5poly * Math.pow (x, 5.0)
        	+ x7frac * x7poly * Math.pow (x, 7.0);

        return;
    }
    

   	function LatLongToUTM(lat,lng,acur){
		

		var xy = new Array(2);

        if (isNaN (parseFloat (lng))) {
             
            //if(console) console.log("Please enter a valid longitude in the lon field. -->"+lng);
            return false;
        }

        lon = parseFloat (lng);

        if ((lon < -180.0) || (180.0 <= lon)) {
            //if(console) console.log("The longitude you entered is out of range.  " +
              //     "Please enter a number in the range [-180, 180). -->"+lng);
            return false;
        }

        if (isNaN (parseFloat (lat))) {
           // if(console) console.log("Please enter a valid latitude in the lat field. -->"+lat);
            return false;
        }

        lat = parseFloat (lat);

        if ((lat < -90.0) || (90.0 < lat)) {
            //if(console) console.log("The latitude you entered is out of range.  " +
            //       "Please enter a number in the range [-90, 90]. -->"+lat);
            return false;
        }

        // Compute the UTM zone.
        zone = Math.floor ((lon + 180.0) / 6) + 1;

        zone = LatLonToUTMXY (DegToRad (lat), DegToRad (lon), zone, xy);
			
		var utm=new UTMObject(zone,xy,acur);

		return utm;
		
	}


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
   	
   	
	function UTMObject (zone,xy,accuracy) {
		
		this.zone = zone;
		this.x = xy[0]
        this.y = xy[1]
        
        this.xLetter = getDigraphEast(zone,this.x);
		this.yLetter = getDigraphNorth(zone,this.y);
		
		this.xNum=parseInt(xy[0]/accuracy)%10;
		this.yNum=parseInt(((xy[1]/accuracy)%100)%10);
		
		//this.digraph=determineLetter(this.yLetter,this.yNum);
				
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

//   		isZoneLimit(zone, xy[0], xy[1], acur, isSouthernHem(lat), square, utmCoords);

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
