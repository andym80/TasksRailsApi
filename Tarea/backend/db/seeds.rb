# Safe to run more than once: records are looked up before they are created.

andy = User.find_or_create_by!(email: "andy@example.com") { |user| user.name = "Andy Menutti" }
jane = User.find_or_create_by!(email: "jane@example.com") { |user| user.name = "Jane Doe" }

projects = {
  "OMNI Platform" => {
    description: "Generative AI sound platform", user: andy,
    tasks: [
      { title: "Setup audio engine", status: :completed, priority: :high, assigned_to: andy, due_date: Date.current - 6 },
      { title: "Integrate Replicate API", status: :in_progress, priority: :high, assigned_to: andy, due_date: Date.current },
      { title: "Design UI components", status: :pending, priority: :medium, assigned_to: jane, due_date: Date.current + 9 }
    ]
  },
  "Task Manager API" => {
    description: "Rails + Next.js app", user: andy,
    tasks: [
      { title: "Create Rails API", status: :completed, priority: :high, assigned_to: andy, due_date: Date.current - 12 },
      { title: "Build Next.js frontend", status: :in_progress, priority: :high, assigned_to: andy, due_date: Date.current - 1 },
      { title: "Write tests", status: :pending, priority: :medium, due_date: Date.current + 2 }
    ]
  },
  "Portfolio Redesign" => {
    description: "andymenutti.vercel.app rebuild", user: jane,
    tasks: [
      { title: "Wireframes", status: :completed, priority: :low, assigned_to: jane },
      { title: "Scroll animations", status: :pending, priority: :medium, assigned_to: jane, due_date: Date.current + 21 }
    ]
  }
}

projects.each do |name, attributes|
  project = Project.find_or_create_by!(name: name, user: attributes[:user]) do |record|
    record.description = attributes[:description]
  end

  attributes[:tasks].each do |task|
    project.tasks.find_or_create_by!(title: task[:title]) { |record| record.assign_attributes(task.except(:title)) }
  end
end

puts "Seeds listos: #{User.count} users, #{Project.count} projects, #{Task.count} tasks"
