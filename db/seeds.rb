# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


require File.expand_path('../defs', __FILE__)

require "yaml"


records = YAML::load(IO.read('db/combined.yml'))

Restaurant.delete_all
records.each do |venue|
  hash = venue.to_hash
  Restaurant.create(hash)
end