require "test_helper"

class TaskTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(name: "Andy", email: "andy@test.com")
    @project = Project.create!(name: "OMNI", user: @user)
  end

  test "valid task" do
    task = Task.new(title: "Setup engine", project: @project)
    assert task.valid?
  end

  test "invalid without title" do
    task = Task.new(project: @project)
    assert_not task.valid?
    assert_includes task.errors[:title], "can't be blank"
  end

  test "default status is pending" do
    task = Task.create!(title: "Test task", project: @project)
    assert_equal "pending", task.status
  end
end