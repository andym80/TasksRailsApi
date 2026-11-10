class ApplicationController < ActionController::API
  MAX_PER_PAGE = 100

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  # Paginates with Kaminari and reports the full count in the X-Total-Count header.
  def paginate(scope)
    per_page = params[:per_page].to_i
    per_page = 20 unless per_page.between?(1, MAX_PER_PAGE)
    page = scope.page(params[:page]).per(per_page)
    response.headers["X-Total-Count"] = page.total_count.to_s
    page
  end

  def not_found(e)
    render json: { error: e.message }, status: :not_found
  end

  def unprocessable_entity(e)
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def bad_request(e)
    render json: { errors: [e.message] }, status: :bad_request
  end
end
