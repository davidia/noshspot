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
      radius = 0.01
      
      criteria = FakeCriteria.new
      
      criteria.should_receive(:where).
          with(:location.within => { "$center" => [ latlong, radius ] }).
          and_return([FakeRest.new])

      Restaurant.should_receive(:limit).with(100).and_return(criteria)      
                        
      get 'search', {format: 'json', search_area: '51.5,-0.1,0.01'}      
      json = ActiveSupport::JSON::decode(response.body)
      json.should satisfy {|r| r[0]['name']=='fake'}
    end
  end
end
