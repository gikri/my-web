export interface Project {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly tags: readonly string[]
  readonly url?: string
  readonly gradient: string
}

export interface Skill {
  readonly name: string
  readonly category: 'frontend' | 'backend' | 'devops' | 'design'
}
