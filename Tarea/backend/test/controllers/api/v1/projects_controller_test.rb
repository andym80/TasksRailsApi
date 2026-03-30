require "test_helper"

class Api::V1::ProjectsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create!(name: "Andy", email: "andy@test.com")
    @project = Project.create!(name: "OMNI", user: @user)
  end

  test "GET /api/v1/projects returns list" do
    get "/api/v1/projects"
    assert_response :success
    json = JSON.parse(response.body)
    assert_kind_of Array, json
  end

  test "POST /api/v1/projects creates project" do
    assert_difference("Project.count", 1) do
      post "/api/v1/projects",
        params: { project: { name: "New Project", user_id: @user.id } },
        as: :json
    end
    assert_response :created
  end

  test "DELETE /api/v1/projects/:id deletes project" do
    assert_difference("Project.count", -1) do
      delete "/api/v1/projects/#{@project.id}"
    end
    assert_response :success
  end
end