var global_codi_e_poc;
var global_lang;

var taxonSearch="all";
var zonasSearch="A";
var counterListHash = new Hashtable();
var commentsCount=0;

var baseUrlPyrenaea="http://atlasflorapyrenaea.org/florapyrenaea/";

var utmCount={'ca_ES':'Quantitat','es_ES':'Cantidad','es_EU':'Zenbatekoa','fr_FR':'QuantitÃ©'};
var utmClass={'ca_ES':'Classe','es_ES':'Clase','es_EU':'Klase','fr_FR':'Classe'};
var utmYear={'ca_ES':'Any','es_ES':'AÃ±o','es_EU':'Urtea','fr_FR':'AnnÃ©e'};
var unknownYear={'ca_ES':'Sense data','es_ES':'Sin fecha','es_EU':'Urtea','fr_FR':'AnnÃ©e'};
var rangeYears={'ca_ES':'Anys','es_ES':'AÃ±os','es_EU':'Urteak','fr_FR':'AnnÃ©es'};
var photoSource={'ca_ES':'Font','es_ES':'Fuente','es_EU':'Jatorria','fr_FR':'Source'};
var photoTextAragon={'es_ES':'Atlas de la flora de Arag\363n'};
var level_trans={'grupo':'Gr.','family':'Fam.','genus':'Gen.','species':'Sp.','subspecies':'Subsp.'};

function centerSquare(utmPrec){

	var bounds = new google.maps.LatLngBounds();
	var i;

	var polygonCoords = polygonSelection.getPath();

	for (i = 0; i < polygonCoords.length; i++) {
		bounds.extend(polygonCoords.getAt(i));
	}

	if($('#autoAlitudeAndLocality').is(':checked')){

		codeLatLng(bounds.getCenter().lat(), bounds.getCenter().lng())
		getElevation(bounds.getCenter());

	}


	map.map.setCenter(bounds.getCenter());
	if(utmPrec=='10km') map.map.setZoom(9);
	else map.map.setZoom(11);
}


$(function() { 

	$('ul.nav-pills li a').on('click',function() {           

	});

	$('ul.nav-pills li a[data-toggle="tab"]').on('shown', function (e) {
		updateOffset('map_canvas'); 
	})

	$("form :input").on("keypress", function(e) {
		return e.keyCode != 13;
	});

	$('#utm_value').on("keyup", function(e) {
		if(e.keyCode == 13){

			utm=$('#utm_value').val();
			utmPrec=checkUTM(utm);

			//console.log('UTM value: '+utm+' prec: '+utmPrec);

			$('input:radio[name=utm]').val([utmPrec]);
			changeAccuracy();

			if(utmPrec!=''){

				//if(polygonSelection!=null) polygonSelection.setMap(null);
				UTMsquare.setMap(null);  

				MGRS2LatLong(utm,map,"utm_search");

				checkUTMCorrectness(utm);

				centerSquare(utmPrec);
			}
			else{
				$('#labelCheckUTM').show().delay(4000).fadeOut();
			}
		}   

		// $('#utm_value').focus().trigger({ type : 'keypress', which : 13 });
	});

}); 


function loadMap(taxon){
	window.location = "/datosDeEspecie?ident="+taxon;
}


function cargaAnteriorTaxon(elActual){
	window.location = "/datosDeEspecie?ident=anterior&actual='"+elActual+"'";
}

function cargaSiguienteTaxon(elActual){
	window.location = "/datosDeEspecie?ident=siguiente&actual='"+elActual+"'";
}


function showUTMs(){


	if($('#utmListButton').is('.utmListDisabled')){


		$('.table tr td .utmCount').each(function() {

			$(this).css("visibility", "hidden")

		});


		$('.table tr td .utmLink').each(function() {

			$(this).css("visibility", "hidden")

		});

		$('#utmListButton').removeClass("utmListDisabled").addClass("utmListEnabled");


	}
	else{

		$('.table tr td .utmCount').each(function() {

			$(this).css("visibility", "")

		});

		$('.table tr td .utmLink').each(function() {

			$(this).css("visibility", "")

		});

		$('#utmListButton').removeClass("utmListEnabled").addClass("utmListDisabled");


	}

}


function focusTableRow(rowId){

	$('.'+rowId).addClass('error');
}

function focusToTableEnd(){

	var w = $(window);
	var row=$('.table').find('tr').last();

	if (row.length){
		w.scrollTop( row.offset().top - (w.height()/2) );
	}

}



function getCookie(name) {
	var prop = name + "=";
	var plen = prop.length;
	var clen = InCookie.length;
	var i=0;
	if (clen>0) {
		i = InCookie.indexOf(prop,0);
		if (i!=-1) {
			j = InCookie.indexOf(";",i+plen);
			if(j!=-1)
				return unescape(InCookie.substring(i+plen,j));
			else
				return unescape(InCookie.substring(i+plen,clen));
		}
		else
			return "";
	}
	else return "";
}

function setCookie (name, value) {
	var argv = setCookie.arguments;
	var argc = setCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null
			var path = (argc > 3) ? argv[3] : null
					var domain = (argc > 4) ? argv[4] : null
							var secure = (argc > 5) ? argv[5] : false
									document.cookie = name + "=" + escape(value) +
									((expires==null) ? "" : ("; expires=" + expires.toGMTString())) +
									((path==null) ? "" : (";path=" + path)) +
									((domain==null) ? "" : ("; domain=" + domain)) +
									((secure==true) ? "; secure" : "");
}

function getURLParameter(name) {
	return decodeURIComponent(
			(location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
	);  
}


function triggerTaxonTreeEvent(level,parent){


	console.log("Trigger: "+level+" "+parent+" Class: "+$('#'+parent).attr('class'));

	if(level==='subspecies_last'){

		window.location = "Citation?action=info&codi_e_poc="+parent.replace(/_/g, "+");   

	}
	else{

		console.log("else");

		var children = $('#'+parent).children();

		console.log("\t L: "+level+" P:"+parent+" --> C: ");

		if(children.length<=1){

			console.log("(1)");

			loadTaxonTree(level, parent);

		}
		else{

			children = $('#'+parent).find('> ul > li');

			if($('#'+parent).attr('class')==='subspecies' && children.is(":visible")){

				console.log("(2)");
				window.location = "Citation?action=info&codi_e_poc="+parent.replace(/_/g, "+");   

			}
			else{

				console.log("(3)");

				if (children.is(":visible")) children.hide('fast');
				else children.show('fast');

			}

		}
	}

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function loadTaxonTree(level, parent){
	
	
	if(level==='subspecies'){
		window.location = "/#/specy?query="+parent.replace(/_/g, "+");   
		return;
	}

	try {
		$.ajax({
			type: "GET",
			url: serverUrl +  "/listTaxonTreeBy" + capitalizeFirstLetter(level) + "?parent="+parent,
			success: function (r1) {
	
				var taxon_array=r1;
				var ul_ = $('<ul class=\"'+level+'\"></ul>');
				$.each (taxon_array, function (taxonLeaf) {
					//console.log (taxon_array[taxonLeaf].children);
					var a_ =$('<a data-target=\"#\"><span class=\"label label-info\">'+level_trans[level]+'</span> '  + taxon_array[taxonLeaf].code + '</a>').on('click', function(){
						triggerTaxonTreeEvent($(this).closest('li').attr('class'),$(this).closest('li').attr('id'));
					});
	
					var li_=$("<li class=\""+taxon_array[taxonLeaf].nextLevel+"\" id=\""+taxon_array[taxonLeaf].code+"\"></li>");
	
					$(li_).append(a_);
	
					$(ul_).append(li_);
	
				});
				$("#"+parent).append(ul_);
			}
		});
	} catch ( err ) {
		console.log(err);
	}

}
