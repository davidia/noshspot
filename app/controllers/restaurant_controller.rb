class RestaurantController < ApplicationController
  def search
     
    

    tags = params[:tags]
   
    results = Restaurant.limit(100)
    wheres = []

    if search_area = params[:search_area]
      lat,long,radius = search_area.split(',').map {|a| a.to_f}      
      results = results.where(:location.within => { "$center" => [ [lat,long], radius ] })
    end
    
    # if ph = params[:price_high]  
    #   results = results.where(:'sources.normalised_price'.lte => ph.to_i)
    # end

    # if(pl = params[:price_low])
    #   results = results.where(:'sources.normalised_price'.gte => pl.to_i)
    # end
        
    #where(:'sources.rating'.gte => params[:stars_min].to_i).limit(100)    
    #near= near.any_in(:'sources.tags' => tags.downcase.split(',')) if tags and tags.length > 0
    #near = Restaurant.where(:location => {"$near" => latlong, "$maxDistance" => radius})
    
    respond_to do |format|
      #format.html # index.html.erb
      #format.xml  { render :xml => results}
      format.json { render :json => results}
    end    
  end
end
