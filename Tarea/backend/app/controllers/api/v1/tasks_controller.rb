class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy, :status]

  # Related records sent with every task so the client can show names instead of ids.
  TASK_JSON = {
    include: {
      project: { only: [:id, :name] },
      assigned_to: { only: [:id, :name] }
    }
  }.freeze

  def index
    return if invalid_filter?(:status, Task.statuses) || invalid_filter?(:priority, Task.priorities)

    tasks = Task.includes(:project, :assigned_to).order(Arel.sql("due_date ASC NULLS LAST"), :id)
    tasks = tasks.where(status: params[:status]) if params[:status].present?
    tasks = tasks.where(priority: params[:priority]) if params[:priority].present?
    tasks = paginate(tasks)
    render json: tasks.as_json(TASK_JSON), status: :ok
  end

  def show
    render json: @task.as_json(TASK_JSON), status: :ok
  end

  def create
    project = Project.find(params[:project_id])
    task = project.tasks.create!(task_params)
    render json: task.as_json(TASK_JSON), status: :created
  end

  def update
    @task.update!(task_params)
    render json: @task.as_json(TASK_JSON), status: :ok
  end

  def status
    @task.update!(status: params[:status])
    render json: @task.as_json(TASK_JSON), status: :ok
  end

  def destroy
    @task.destroy!
    render json: { message: "Task deleted" }, status: :ok
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :status, :priority, :due_date, :assigned_to_id)
  end

  # Answers 422 for an unknown filter value instead of letting the query fail.
  def invalid_filter?(name, allowed)
    value = params[name]
    return false if value.blank? || allowed.key?(value)

    render json: { errors: ["#{name} must be one of: #{allowed.keys.join(', ')}"] }, status: :unprocessable_entity
    true
  end
end
