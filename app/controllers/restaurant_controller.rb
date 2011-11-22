class RestaurantController < ApplicationController
  def near
  
    #near = Restaurant.near(location: [ 52.30, -0.15 ])  
    #near = Restaurant.near(location: )
    # near = Restaurant.find(
    #   { location : { $near : , 
    #     $maxDistance : 0.01 } } )
    tags = params[:tags]
    latlong =  [ params[:lat].to_f, params[:long].to_f ]
    radius = params[:radius].to_f
    near = Restaurant.where(:location.within => { "$center" => [ latlong, radius ] }).
    where(:price.lte => params[:price_high].to_i).
    where(:price.gte => params[:price_low].to_i).
    where(:stars.lte => params[:stars_high].to_i).
    where(:stars.gte => params[:stars_low].to_i)
    near= near.any_in(tags: tags.downcase.split(',')) if tags and tags.length > 0
    #near = Restaurant.where(:location => {"$near" => latlong, "$maxDistance" => radius})
    
    

     

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => near}
      format.json { render :json => near}
    end    
  end
end
