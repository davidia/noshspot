


class Venue
  attr_accessor :name,  :postcode, :street_address, :telephone, :location
  attr :sources
  def initialize
    @sources = []
  end

  def to_hash 
    h = Hash.new
    [:name,  :postcode, :street_address, :telephone, :location].each{ |m| h[m] = self.send(m) }
    h[:sites] = sources.map{|s| s.to_hash}
    h
  end

end

class Source
  attr_accessor :name,:url, :rating, :normalised_rating, :price, :normalised_price
  attr :tags,:name
  def initialize name
    @tags = []
    @name = name
  end

  def to_hash
    h = Hash.new
    [:name,:url, :rating, :normalised_rating, :price, :normalised_price,:tags,:name].each do |m|
      h[m] = self.send(m)
    end
    h    
  end
end


