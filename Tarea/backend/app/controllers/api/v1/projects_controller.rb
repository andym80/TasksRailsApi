class Api::V1::ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :update, :destroy]

def index
  projects = Project.includes(:tasks).page(params[:page]).per(20)
  render json: projects.as_json(include: { tasks: { only: [:id, :title, :status, :priority] } }), status: :ok
end

  def show
    render json: @project.as_json(include: :tasks), status: :ok
  end

  def create
    project = Project.create!(project_params)
    render json: project, status: :created
  end

  def update
    @project.update!(project_params)
    render json: @project, status: :ok
  end

  def destroy
    @project.destroy!
    render json: { message: 'Project deleted' }, status: :ok
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:name, :description, :user_id)
  end
end