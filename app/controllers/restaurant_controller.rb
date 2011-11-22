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
    where(:'sources.price'.lte => params[:price_high].to_i).
    where(:'sources.price'.gte => params[:price_low].to_i).
    where(:'sources.rating'.gte => params[:stars_min].to_i).limit(100)    
    near= near.any_in(:'sources.tags' => tags.downcase.split(',')) if tags and tags.length > 0
    #near = Restaurant.where(:location => {"$near" => latlong, "$maxDistance" => radius})
    
    

     

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => near}
      format.json { render :json => near}
    end    
  end
end
