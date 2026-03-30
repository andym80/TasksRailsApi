class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy, :status]

def index
  tasks = Task.all
  tasks = tasks.where(status: params[:status]) if params[:status].present?
  tasks = tasks.where(priority: params[:priority]) if params[:priority].present?
  tasks = tasks.page(params[:page]).per(20)
  render json: tasks, status: :ok
end

  def show
    render json: @task, status: :ok
  end

  def create
    project = Project.find(params[:project_id])
    task = project.tasks.create!(task_params)
    render json: task, status: :created
  end

  def update
    @task.update!(task_params)
    render json: @task, status: :ok
  end

  def status
    @task.update!(status: params[:status])
    render json: @task, status: :ok
  end

  def destroy
    @task.destroy!
    render json: { message: 'Task deleted' }, status: :ok
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :status, :priority, :due_date, :assigned_to_id)
  end
end
