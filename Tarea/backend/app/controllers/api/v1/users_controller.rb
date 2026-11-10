class Api::V1::UsersController < ApplicationController
  def index
    render json: User.order(:name).as_json(only: [:id, :name, :email]), status: :ok
  end
end
