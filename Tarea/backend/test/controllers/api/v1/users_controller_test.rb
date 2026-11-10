require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  test "GET /api/v1/users lists users by name" do
    get "/api/v1/users"
    assert_response :success

    names = JSON.parse(response.body).map { |user| user["name"] }
    assert_equal ["Ada Fixture", "Bruno Fixture"], names
  end
end
