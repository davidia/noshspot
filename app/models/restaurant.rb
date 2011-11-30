class Restaurant
  include Mongoid::Document

  embeds_many :sites



  def lat= lat
    self.location ||= [nil,nil]
    self.location[0] = lat
  end

  def long= long
    self.location ||= [nil,nil]
    self.location[1] = long
  end

  field :name
  field :location, type: Array
  index [[ :location, Mongo::GEO2D ]]
end
