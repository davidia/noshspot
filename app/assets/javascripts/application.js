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

var stars_min = 1
// var stars_high = 5

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

function br(string,value){
	return string + '</br>' + value
}

function addSource(source){
	str =  br('','<a href="'+source.url+'" target = "_blank">'+ source.name + '</a> ')
	if(source.raw_rating){ str += source.raw_rating}
	if(source.raw_price){  str += ' ' + source.raw_price}
	return str
}

function getInfoWindow(venue){
	
	content = br('',venue.name)
	if(venue.telephone){
		content = br(content,venue.telephone)
	}
	content = br(content,venue.postcode)
	for(i in venue.sources){
		content = content + addSource(venue.sources[i])
	}


	return  new google.maps.InfoWindow({
		    content: content
		});
	
}

//Fodar
function doSearch(){
	args = 'lat='+c.Pa+'&long='+c.Qa+'&radius='+(radius/1600.0/60.0)
	args = args + '&price_low=' + price_low
	args = args + '&price_high=' + price_high
	args = args + '&stars_min=' + stars_min
	//args = args + '&stars_high=' + stars_high
	args = args + '&tags=' + tags

	$("#list").empty() 
       
    $.getJSON('restaurants/near.json',args,function(data) {	 	

    	
    	for (i in markers) {
      		markers[i].setMap(null);
    	}

    	$.each(data, function(index, value) { 
  		var myLatlng = new google.maps.LatLng(value.location[0],value.location[1]);
		var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title:value.name });


		google.maps.event.addListener(marker, 'click', function() {
			if(openwindow){
				openwindow.close()
			}
			openwindow = getInfoWindow(value)
 			openwindow.open(map,marker);
		});


		//$("#list").append('<li>'+value.name+'</li>')

		markers.push(marker)
		});
		
  	});
}

var prices = ['Budget','Mid-Range','Expensive','Luxury']


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

				$("#price_min").empty()
				$("#price_min").append(prices[price_low-1])

				$("#price_max").empty()
				$("#price_max").append(prices[price_high-1])
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
			
			min: 1,
			max: 5,
			value:  1 ,
			slide: function( event, ui ) {
				stars_min = ui.value				
				$("#rating").empty()
				$("#rating").append(stars_min)
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


