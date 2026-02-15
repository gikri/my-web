export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  url?: string
  gradient: string
}

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'devops' | 'design'
}
