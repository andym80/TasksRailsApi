class User < ApplicationRecord
  has_many :projects, dependent: :destroy
  has_many :tasks, foreign_key: :assigned_to_id

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end