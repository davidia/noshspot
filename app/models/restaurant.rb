class Restaurant
  include Mongoid::Document
  field :location, type: Array
  field :price, type: Integer
  index [[ :location, Mongo::GEO2D ]]
end
