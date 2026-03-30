require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "valid user" do
    user = User.new(name: "Andy", email: "andy@test.com")
    assert user.valid?
  end

  test "invalid without name" do
    user = User.new(email: "andy@test.com")
    assert_not user.valid?
    assert_includes user.errors[:name], "can't be blank"
  end

  test "invalid with duplicate email" do
    User.create!(name: "Andy", email: "andy@test.com")
    user = User.new(name: "Andy2", email: "andy@test.com")
    assert_not user.valid?
    assert_includes user.errors[:email], "has already been taken"
  end
end