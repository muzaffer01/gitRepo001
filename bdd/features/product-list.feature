Feature: Product List
  As a shopper
  I want to browse and narrow down the product catalog
  So that I can find items I'm interested in

  Background:
    Given I am on the product list page

  Scenario: Shows the full product catalog
    Then I should see 8 product cards
    And I should see the product "Wireless Noise-Cancelling Headphones"
    And I should see the product "Bestselling Mystery Novel (Paperback)"

  Scenario: Searching filters products by name
    When I search for "Yoga Mat"
    Then I should see the product "Yoga Mat with Carrying Strap"
    And I should not see the product "Wireless Noise-Cancelling Headphones"

  Scenario: Filtering by category shows only matching products
    When I filter by category "Books"
    Then I should see the product "Bestselling Mystery Novel (Paperback)"
    And I should not see the product "Ceramic Non-Stick Frying Pan, 10-inch"

  Scenario: Empty search shows no products found
    When I search for "nonexistent-product-xyz"
    Then I should see the message "No products found."

  Scenario: Product card links to its details page
    Then the product card for "Wireless Noise-Cancelling Headphones" should link to "/products/1"

  Scenario: Combined search and category filter narrows results
    When I filter by category "Electronics"
    And I search for "keyboard"
    Then I should see the product "Mechanical Keyboard, RGB Backlit"
    And I should not see the product "Wireless Noise-Cancelling Headphones"

  Scenario: Cart badge starts at zero
    Then the cart badge should read "0"

  Scenario: Layout reflows without horizontal overflow on a mobile viewport
    When I resize the viewport to mobile width
    Then the page should not scroll horizontally
