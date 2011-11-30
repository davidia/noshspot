class Site
  include Mongoid::Document
  
  embedded_in :restaurant

  field :name
  field :url
  field :price
  field :rating

end
