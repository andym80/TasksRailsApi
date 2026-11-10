require "test_helper"

class Api::V1::TasksControllerTest < ActionDispatch::IntegrationTest
  test "GET /api/v1/tasks returns tasks with project and assignee names" do
    get "/api/v1/tasks"
    assert_response :success

    json = JSON.parse(response.body)
    assert_equal 2, json.size
    assert_equal "2", response.headers["X-Total-Count"]

    first = json.first
    assert_equal "Fixture task one", first["title"]
    assert_equal "Fixture project one", first.dig("project", "name")
    assert_equal "Ada Fixture", first.dig("assigned_to", "name")
  end

  test "GET /api/v1/tasks filters by status and priority" do
    get "/api/v1/tasks", params: { status: "completed", priority: "low" }
    assert_response :success

    titles = JSON.parse(response.body).map { |task| task["title"] }
    assert_equal ["Fixture task two"], titles
  end

  test "GET /api/v1/tasks answers 422 for an unknown filter" do
    get "/api/v1/tasks", params: { status: "bogus" }
    assert_response :unprocessable_entity
  end

  test "GET /api/v1/tasks honours per_page" do
    get "/api/v1/tasks", params: { per_page: 1 }
    assert_response :success
    assert_equal 1, JSON.parse(response.body).size
    assert_equal "2", response.headers["X-Total-Count"]
  end

  test "POST /api/v1/projects/:id/tasks creates a task" do
    assert_difference("Task.count", 1) do
      post "/api/v1/projects/#{projects(:one).id}/tasks",
        params: { task: { title: "New task", priority: "high", due_date: "2026-04-01" } },
        as: :json
    end
    assert_response :created
    assert_equal "pending", JSON.parse(response.body)["status"]
  end

  test "POST without a title answers 422 with the reasons" do
    post "/api/v1/projects/#{projects(:one).id}/tasks", params: { task: { title: "" } }, as: :json
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["errors"], "Title can't be blank"
  end

  test "PATCH /api/v1/tasks/:id/status updates the status" do
    patch "/api/v1/tasks/#{tasks(:one).id}/status", params: { status: "in_progress" }, as: :json
    assert_response :success
    assert_equal "in_progress", tasks(:one).reload.status
  end

  test "PATCH status with an unknown value answers 422 instead of failing" do
    patch "/api/v1/tasks/#{tasks(:one).id}/status", params: { status: "bogus" }, as: :json
    assert_response :unprocessable_entity
    assert_equal "pending", tasks(:one).reload.status
  end

  test "DELETE /api/v1/tasks/:id deletes the task" do
    assert_difference("Task.count", -1) do
      delete "/api/v1/tasks/#{tasks(:two).id}"
    end
    assert_response :success
  end

  test "GET /api/v1/tasks/:id answers 404 for a missing task" do
    get "/api/v1/tasks/0"
    assert_response :not_found
  end
end
