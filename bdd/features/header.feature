Feature: Header cart badge
  As a shopper
  I want the cart badge to always reflect how many items I have
  So that I know my cart status while browsing

  Scenario: The cart badge shows zero when the cart is empty
    Given I am on the product list page
    Then the cart badge should read "0"

  Scenario: The cart badge reflects the total quantity across multiple items
    Given I have added "Wireless Noise-Cancelling Headphones" to my cart
    And I have added "Stainless Steel Insulated Water Bottle" to my cart
    When I am on the product list page
    Then the cart badge should read "2"
