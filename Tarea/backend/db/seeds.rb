# Usuarios
user1 = User.create!(name: 'Andy Menutti', email: 'andy@example.com')
user2 = User.create!(name: 'Jane Doe', email: 'jane@example.com')

# Proyectos
project1 = Project.create!(name: 'OMNI Platform', description: 'Generative AI sound platform', user: user1)
project2 = Project.create!(name: 'Task Manager API', description: 'Rails + Next.js app', user: user1)
project3 = Project.create!(name: 'Portfolio Redesign', description: 'andymenutti.vercel.app rebuild', user: user2)

# Tareas
project1.tasks.create!([
  { title: 'Setup audio engine', status: :completed, priority: :high, assigned_to: user1 },
  { title: 'Integrate Replicate API', status: :in_progress, priority: :high, assigned_to: user1 },
  { title: 'Design UI components', status: :pending, priority: :medium, assigned_to: user2 }
])

project2.tasks.create!([
  { title: 'Create Rails API', status: :completed, priority: :high, assigned_to: user1 },
  { title: 'Build Next.js frontend', status: :in_progress, priority: :high, assigned_to: user1 },
  { title: 'Write tests', status: :pending, priority: :medium, due_date: Date.today + 2 }
])

project3.tasks.create!([
  { title: 'Wireframes', status: :completed, priority: :low, assigned_to: user2 },
  { title: 'Scroll animations', status: :pending, priority: :medium, assigned_to: user2 }
])

puts "✅ Seeds creados: #{User.count} users, #{Project.count} projects, #{Task.count} tasks"