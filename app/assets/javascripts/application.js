// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery-ui
//= require jquery_ujs
//= require_tree .

var map;
var center = new google.maps.LatLng(51.518, -.135);

var c = center
var radius = 800

var circle
var markers = [];
var tags = ""
var price_low = 1
var price_high = 4

var stars_low = 1
var stars_high = 5

var openwindow

function checkSearch(){
	var go = false
	if(circle.center != c){
		c = circle.center
		go = true
	}
	if(circle.radius != radius){
		radius = circle.radius
		go = true
		
		$("#range").text(Math.round(radius)+'M');
	}
	if(go){
		doSearch()
	}
}

function doSearch(){
	args = 'lat='+c.Pa+'&long='+c.Qa+'&radius='+(radius/1600.0/60.0)
	args = args + '&price_low=' + price_low
	args = args + '&price_high=' + price_high
	args = args + '&stars_low=' + stars_low
	args = args + '&stars_high=' + stars_high
	args = args + '&tags=' + tags

	$("#list").empty() 
    for (i in markers) {
      markers[i].setMap(null);
    }
    $.getJSON('restaurants/near.json',args,function(data) {	 	
    	$.each(data, function(index, value) { 
  		var myLatlng = new google.maps.LatLng(value.location[0],value.location[1]);
		var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title:value.name });

		var infowindow = new google.maps.InfoWindow({
		    content: value.name + '<br/>Stars: ' + value.stars + '<br/>Price: ' + value.price
		});

		google.maps.event.addListener(marker, 'click', function() {
			if(openwindow){
				openwindow.close()
			}
			openwindow = infowindow
 			infowindow.open(map,marker);
		});


		//$("#list").append('<li>'+value.name+'</li>')

		markers.push(marker)
		});
		
  	});
}




$(document).ready(function() {
  
    var myOptions = {
      zoom: 13,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

var search_area = {
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: center,
      radius: radius,
      editable:true
    };
    circle = new google.maps.Circle(search_area);

google.maps.event.addListener(circle, 'center_changed', function() {
	checkSearch();
});

google.maps.event.addListener(circle, 'radius_changed', function() {
	checkSearch();
});

	
	

$(function() {
		$( "#slider-price" ).slider({
			range: true,
			min: 1,
			max: 4,
			values: [ 1, 4 ],
			slide: function( event, ui ) {
				price_low = ui.values[ 0 ] 
				price_high = ui.values[ 1 ] 
				doSearch()				
			}
		});
	});

$(function() {
		$( "#tabs" ).tabs({
			collapsible: true
		});
		$( ".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *" )
			.removeClass( "ui-corner-all ui-corner-top" )
			.addClass( "ui-corner-bottom" );	
	});
	

$(function() {
		$( "#slider-stars" ).slider({
			range: true,
			min: 1,
			max: 5,
			values: [ 1, 5 ],
			slide: function( event, ui ) {
				stars_low = ui.values[ 0 ] 
				stars_high = ui.values[ 1 ] 
				doSearch()				
			}
		});
	});

	$("#tagslist").bind("mousedown", function(e) {
		e.metaKey = true;
	}).selectable({
			stop: function() {
				tags = ''
				$( ".ui-selected", this ).each(function() {
					tags = tags +','+this.textContent
					
				});
			tags = tags.substring(1)
			doSearch()
			}
		});

	doSearch()

});


