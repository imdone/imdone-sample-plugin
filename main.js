import Plugin from 'imdone-api'

export default class SamplePlugin extends Plugin {
  
  constructor (project) {
    super(project)
  }
  
  onTaskUpdate (task) {
    task.interpretedContent = task.interpretedContent.replace(/- \[x\] (.*)$/gm, (match, p1) => {
      return `- [x] ~~${p1}~~`
    })
  }

  getBoardActions () {
    const project = this.project
    return [
      {
        name: 'Filter for urgent cards',
        action: () => {
          project.setFilter('allTags=urget')
        }
      },
      {
        name: 'Add a card in TODO',
        action: () => {
          project.newCard({ list: 'TODO'})
        }
      },
      {
        name: 'Test snackBar',
        action: () => {
          project.snackBar({message:'Testing snackBar'})
        }
      },
      {
        name: 'Test toast',
        action: () => {
          project.toast({message:'Testing toast'})
        }
      }
    ]
  }

  getCardLinks (task) {
    const project = this.project
    return [
      {
        action: () => {
          console.log('Active Task:',task)
        },
        icon: 'rocket',
        pack: 'fas',
        title: `Write task to console`
      },
      {
        action: () => {
          this.project.addMetadata(task, 'metadata', 'value')
        },
        icon: 'table',
        pack: 'fas',
        title: 'Add metadata:value'
      },
      {
        action: () => {
          this.project.addTag(task, 'urgent')
        },
        icon: 'tag',
        pack: 'fas',
        title: 'Add urgent tag'
      },
      {
        action: () => {
          this.project.copyToClipboard(task.data.rawMarkdown, "Markdown copied to clipboard!")
        },
        icon: 'markdown',
        pack: 'fab',
        title: 'Copy markdown'
      },
      {
        action: () => {
          this.project.copyToClipboard(task.data.html, "HTML copied to clipboard!")
        },
        icon: 'copy',
        pack: 'fas',
        title: 'Copy html'
      }

    ]
  }

  getCardProperties (task) {
    const {
      source,
      line,
      totals
    } = task
    return {
      date: (new Date()).toDateString(),
      time: (new Date()).toLocaleTimeString(),
      timestamp: (new Date()).toISOString(),
      sourceLink: source && `[${source.path}:${line}](${source.path}:${line})`
    }
  }
}
