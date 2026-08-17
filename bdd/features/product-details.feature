Feature: Product Details
  As a shopper
  I want to view a product's full details and add it to my cart
  So that I can decide whether to buy it and start an order

  Scenario: Viewing a product shows its full details
    Given I am on the product details page for "Wireless Noise-Cancelling Headphones"
    Then I should see the heading "Wireless Noise-Cancelling Headphones"
    And I should see the price "$89.99"
    And I should see the text "In stock"

  Scenario: Visiting an unknown product shows a not-found message
    Given I am on the product details page for an unknown product
    Then I should see the message "Product not found."

  Scenario: Adding to cart shows a confirmation message
    Given I am on the product details page for "Wireless Noise-Cancelling Headphones"
    When I click "Add to Cart"
    Then I should see the message "Added to cart!"
    And the cart badge should read "1"

  Scenario: Buying now navigates straight to the cart
    Given I am on the product details page for "Wireless Noise-Cancelling Headphones"
    When I click "Buy Now"
    Then I should be on the cart page
    And I should see the product "Wireless Noise-Cancelling Headphones"

  Scenario: The selected quantity is respected when buying now
    Given I am on the product details page for "Wireless Noise-Cancelling Headphones"
    When I select quantity "3"
    And I click "Buy Now"
    Then the cart line for "Wireless Noise-Cancelling Headphones" should total "$269.97"
