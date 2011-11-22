class Restaurant
  include Mongoid::Document

  embeds_many :sources

  field :location, type: Array
  index [[ :location, Mongo::GEO2D ]]
end
