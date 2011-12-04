require 'spec_helper'


class FakeCriteria
  def initialize
    
  end    
end

class FakeRest
  def initialize
    @name ='fake'
  end    
end

describe RestaurantController do
  describe "#search" do
    it "should fetch records in a search_area" do
      latlong = [51.5,-0.1]
      radius = 800.0/1600/60
      
      criteria = FakeCriteria.new
      
      criteria.should_receive(:where).
          with(:location.within => { "$center" => [ latlong, radius ] }).
          and_return([FakeRest.new])

      Restaurant.should_receive(:limit).with(10000).and_return(criteria)      
                        
      post 'search', {format: 'json', request: '{area: {center:[51.5,-0.1], radius: 800}}'}
      p response.body
      json = ActiveSupport::JSON::decode(response.body)
      json.should satisfy {|r| r[0]['name']=='fake'}
    end
  end
end
