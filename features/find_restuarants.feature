Feature: Find Restaurants

  As a Visitor
  I want to find nearby restaurants with specific attributes
  So that I can find a restaurant that matches my tastes
  
  @javascript
  Scenario: Location Search
    Given the following restaurant exists:
      | Name | Lat			| Long   |
      | Nosh | 51.001       | -1.001 |  
    When I vist the homepage
      And I move the search circle to [51.0,-1.0]
    Then I should see a marker for "Nosh" on the map