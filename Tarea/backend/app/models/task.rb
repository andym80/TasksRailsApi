class Task < ApplicationRecord
  belongs_to :project
  belongs_to :assigned_to, class_name: "User", optional: true

  # validate: true turns an unknown value into a validation error (422) instead of an ArgumentError (500).
  enum :status, { pending: 0, in_progress: 1, completed: 2 }, default: :pending, validate: true
  enum :priority, { low: 0, medium: 1, high: 2 }, default: :medium, validate: true

  validates :title, presence: true
end
