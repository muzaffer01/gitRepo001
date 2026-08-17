Feature: Cart
  As a shopper
  I want to review and adjust the items in my cart
  So that my order is correct before I check out

  Scenario: An empty cart shows a message to continue shopping
    Given I am on the cart page
    Then I should see the message "Your cart is empty"
    And I should see a "Continue shopping" link

  Scenario: The cart lists items with the correct subtotal
    Given I have added "Wireless Noise-Cancelling Headphones" to my cart
    When I am on the cart page
    Then I should see the product "Wireless Noise-Cancelling Headphones"
    And the subtotal should be "$89.99"

  Scenario: Updating an item's quantity recalculates totals
    Given I have added "Wireless Noise-Cancelling Headphones" to my cart
    And I am on the cart page
    When I set the quantity to "2"
    Then the cart line for "Wireless Noise-Cancelling Headphones" should total "$179.98"
    And the subtotal should be "$179.98"

  Scenario: Removing the only item empties the cart
    Given I have added "Wireless Noise-Cancelling Headphones" to my cart
    And I am on the cart page
    When I remove the item
    Then I should see the message "Your cart is empty"
    And the cart badge should read "0"

  Scenario: The cart persists after a page reload
    Given I have added "Wireless Noise-Cancelling Headphones" to my cart
    And I am on the cart page
    When I reload the page
    Then I should see the product "Wireless Noise-Cancelling Headphones"
    And the subtotal should be "$89.99"

  Scenario: A full shopping journey completes via header navigation
    Given I am on the product list page
    When I open the product "Mechanical Keyboard, RGB Backlit"
    And I click "Add to Cart"
    And I click the header cart link
    Then I should be on the cart page
    And I should see the product "Mechanical Keyboard, RGB Backlit"
