class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.integer :status
      t.integer :priority
      t.date :due_date
      t.references :project, null: false, foreign_key: true
      t.references :assigned_to, null: true, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
