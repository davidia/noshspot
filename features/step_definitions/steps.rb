When /^I vist the homepage$/ do
  visit '/'
end


When /^I move the search circle to \[(.+),(.+)\]$/ do |lat, long|
  lat = lat.to_f
  long = long.to_f
  page.execute_script("circle.setCenter(new google.maps.LatLng(#{lat},#{long}))")
end

Then /^I should see a marker for "([^"]*)" on the map$/ do |arg1|
  page.execute_script("markers[0].getTitle()").should equal "Nosh"  
end
