class Task < ApplicationRecord
  belongs_to :project
  belongs_to :assigned_to, class_name: 'User', optional: true

  enum :status, { pending: 0, in_progress: 1, completed: 2 }, default: :pending
  enum :priority, { low: 0, medium: 1, high: 2 }, default: :medium

  validates :title, presence: true
  validates :status, presence: true
  validates :priority, presence: true
end
