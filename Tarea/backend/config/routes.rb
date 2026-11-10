Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index]
      resources :projects do
        resources :tasks, only: [:create]
      end
      resources :tasks, only: [:index, :show, :update, :destroy] do
        member do
          patch :status
        end
      end
    end
  end
end
