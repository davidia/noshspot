class RestaurantController < ApplicationController

  def extract_geo_params geo_params
    lat_lng  = geo_params["center"].map{|c|c.to_f}
    
    # cap search at 1000M and convert degrees latitude
    # E/W will be slightly squiffy due to spherical nature of earth
    radius = geo_params["radius"].to_f
    max_dist = [radius,1000.0].min/1852/60

    [lat_lng,max_dist]
  end

  def search
     
    lat_lng, max_dist = extract_geo_params params[:geo]      

    #DB has default limit of 100 for near
    results = Restaurant.where(
      :location => {"$near" => lat_lng ,"$maxDistance" => max_dist }
    ) 
        
    if params.has_key? "price"
      pp = params["price"]
      results = results.where(:'sites.normalised_price'.lte => pp["high"].to_i)      
      results = results.where(:'sites.normalised_price'.gte => pp["low"].to_i)      
    end

    if params.has_key? "rating_min"
      results = results.where(:'sites.normalised_rating'.gte => params["rating_min"].to_i)            
    end

    response = {data:results}

    #warn user if results capped
    response['msg'] = 'Capped at 100 restaurants' if (results.length == 100)

    respond_to do |format|
      format.html # index.html.erb    
      format.json { render :json => response}
    end    
  end
end
