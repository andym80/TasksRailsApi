require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(name: "Andy", email: "andy@test.com")
  end

  test "valid project" do
    project = Project.new(name: "OMNI", user: @user)
    assert project.valid?
  end

  test "invalid without name" do
    project = Project.new(user: @user)
    assert_not project.valid?
    assert_includes project.errors[:name], "can't be blank"
  end

  test "belongs to user" do
    project = Project.create!(name: "OMNI", user: @user)
    assert_equal @user, project.user
  end
end