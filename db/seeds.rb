# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)



require "yaml"

records = YAML::load(IO.read('db/combined.yml'))

Restaurant.delete_all
records.each do |r|

  Restaurant.create(r)
  
  # sources = r["sources"]
  # r.delete "sources"
  # rest = Restaurant.create(r)
  # sources.each{ |s| rest.sources.create(s) }
end