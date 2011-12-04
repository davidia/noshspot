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
var center = new google.maps.LatLng(51.513, -.124);

var radius = 300


var circle
var markers = [];
var tags = ""
var price_low = 1
var price_high = 4

var stars_min = 1
// var stars_high = 5

var openwindow


function addSource(source){

	str =  '<tr><td><a href="'+source.url+'" target = "_blank">'+ source.name + '</a>'
	
	str += '<td>'
	if(source.normalised_rating){
	str += '<div class="rating-view">'
				+'<div class="stars"></div>'
				+'<div class="stars-fill" style="width:'+Math.floor(16*source.normalised_rating)+'px"></div>'+
		  +'</div>'
	}

	//
	
	// if(source.name=='TimeOut'){
	// 	if(source.rating){ str += '<div class="stars s'+source.rating+'"></div>'}
	// }
	// if(source.name=='London-Eating'){
		
	// 	if(source.rating){
	// 		str += '<div class="lescore">'
	// 		str += '<div class="leinner" style="width:'+Math.floor(8*source.rating)+'px">'
	// 		str += '</div></div>'
	// 	}
	// 	source.rating
	// }
	

	if(source.price){  str += '<td>' + source.price}
	

	return str
}

function getInfoWindow(venue){
	
	content = '<div class="card">'
	content += '<h3>' + venue.name  + '</h3>'
	content += '<table><tr><th><th>Rating<th>Price'

	for(i in venue.sites){
		content = content + addSource(venue.sites[i])
	}

	
	content += '</table>'
	content += '<div >'
	content += venue.street_address + '</br>' 
	content += venue.postcode + '</br>' 
	if(venue.telephone){	
		content += venue.telephone.slice(0,3) + ' ' +
				   venue.telephone.slice(3,7) + ' ' +
				   venue.telephone.slice(7,11)
	}
		
	content += '</div>'
	content += '</div>'

	return  new google.maps.InfoWindow({
		    content: content
		});
	
}

excluded=[]
exclusive=[]

function reviewMarkers(){
	if(exclusive.length > 0){
		for(i in markers){
			marker=markers[i]
			show = exclusive.indexOf(marker.cuisine) != -1
			marker.setVisible(show)			
		}
	} else if(excluded.length > 0){
		for(i in markers){
			marker=markers[i]
			show = excluded.indexOf(marker.cuisine) == -1
			marker.setVisible(show)			
		}
	}

}

function addTag(tag,count){
	id = tag.split(' ').join('')
	$('#tags').append('<div id="'+id+'"class="tag">'+tag+'<div class="count"> '+count+
		'<img class="tick" src="/assets/tick.png"><img class="cross" src="assets/cross.png">'+
		'</div></div>'
	)

	$('#'+id+' img.cross').bind('click', function() {
		if((ix = excluded.indexOf(tag)) > -1){
			excluded.splice(ix,1)  		
  			$(this).parents('.tag').removeClass('excluded')			
		}else{
  			excluded.push(tag)  		
  			$(this).parents('.tag').addClass('excluded')
  		}
  		reviewMarkers()
	});

	$('#'+id+' img.tick').bind('click', function() {
		if((ix = exclusive.indexOf(tag)) > -1){
			exclusive.splice(ix,1)  		
  			$(this).parents('.tag').removeClass('exclusive')			
		}else{
  			exclusive.push(tag)  		
  			$(this).parents('.tag').addClass('exclusive')
  		}
  		reviewMarkers()
	});
}

function hideMsg() {
	setTimeout(function() {
		$( "#msg" ).hide( 'slide', {direction: 'up'}, 500 );    		
	}, 2000 );
};

//Fodar
function doSearch(){

	search_data = {geo:{}}

	latLng = circle.getCenter()	
	search_data['geo']['center']=[latLng.lat(),latLng.lng()]
	search_data['geo']['radius']=circle.getRadius()

	if(price_low > 1 || price_high < 4) {
		search_data['price']={}
		search_data['price']['low']=price_low
		search_data['price']['high']=price_high
	}

	if(stars_min > 1) {
		search_data['rating_min']=stars_min
	}
       
    $.getJSON('restaurants/search.json',search_data,function(response) {	 	

    	data=response.data

    	if(response.msg){
    		$( "#msg" ).empty()
    		$( "#msg" ).append(response.msg)
    		$( "#msg" ).show( 'slide', {direction: 'up'}, 500, hideMsg );    		
    	}
    	
    	for (i in markers) {
      		markers[i].setMap(null);
    	}

    	tags_obj = {}
    	tags=[]

    	$.each(data, function(index, venue) {
    		
    		tag = 'Unknown'
    		for(j in venue.sites){
    			site = venue.sites[j]
    			if (site.name == "London-Eating"){
	    			for(ti in site.tags){
	    				tag = site.tags[ti]
	    				if(tags_obj[tag]){
	    					tags_obj[tag] += 1
	    				}else{
	    					tags_obj[tag] = 1
	    				}
    				}
    			}    			
    		}

  		var myLatlng = new google.maps.LatLng(venue.location[0],venue.location[1]);
		var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title:venue.name,
		 });
		marker.data = venue
		marker.cuisine = tag


		google.maps.event.addListener(marker, 'click', function() {

			if(!marker.window){
				marker.window = getInfoWindow(venue)
			}

			if(openwindow){
				openwindow.close()			
			}

			if(openwindow != marker.window){
				openwindow = marker.window
				openwindow.open(map,marker);
			}else{
				openwindow = null
			}
 			
		});

		markers.push(marker)
		});

		for(elem in tags_obj)
    		tags.push({key: elem, value:tags_obj[elem]})
    		addTag(elem,tags[elem])	

		$('#tags').empty()
		tags.sort( function srt(e1, e2)  {return e1.key.localeCompare(e2.key);})
    	for(i in tags)
    		addTag(tags[i].key,tags[i].value)
		
  	});
}

var prices = ['Budget','Mid-Range','Expensive','Luxury']


$(document).ready(function() {
  
    var myOptions = {
      zoom: 16,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: [{ featureType:'poi',
      			
      			stylers: [ { visibility: "off" }]
      		  }]
    };

    map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);


    google.maps.event.addListener(map, 'click', function(msevt) {
    	circle.setCenter(msevt.latLng)
    });



var search_area = {
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: center,
      radius: radius,
      editable:false,
      clickable:false,
      fillColor:'#81F781',
      strokeColor:'#2EFE2E'
    };
    circle = new google.maps.Circle(search_area);
    displayRange()
    

google.maps.event.addListener(circle, 'center_changed', function() {
	scheduleSearch()
});

var timerid;
// google.maps.event.addListener(circle, 'radius_changed', function() {
//  	displayRange()
 	
// });

function displayRange(range){
	$("#range").empty()
	$("#range").append(circle.getRadius()+'M')
}

function displayRating(min_stars){
	$("#rating").empty()
	$("#rating").append(min_stars + ' +')
}

function scheduleSearch(){
	clearTimeout(timerid)
	timerid = setTimeout("doSearch()",300);	
}

$(function() {
		$( "#slider-range" ).slider({
			
			min: 100,
			max: 1000,
			step: 10,
			value:  300 ,
			slide: function( event, ui ) {						
				circle.setRadius(ui.value)					
				displayRange()
				scheduleSearch()
			}
		});
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
				scheduleSearch()
			}
		});
	});


	

$(function() {
		start_stars=1
	    displayRating(start_stars)
		$( "#slider-stars" ).slider({		
			min: 1,
			max: 5,
			value:  start_stars ,
			slide: function( event, ui ) {
				stars_min = ui.value
				displayRating(stars_min)				
				scheduleSearch()
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

