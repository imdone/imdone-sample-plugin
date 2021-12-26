const Plugin = require('imdone-api')

export default class MyPlugin extends Plugin {
  
  constructor (project) {
    super(project)
  }
  
  strikeOutCompletedItems (lists) {
    lists.forEach(list => {
      list.tasks.forEach(task => {
        task.interpretedContent = task.interpretedContent.replace(/- \[x\] (.*)$/gm, (match, p1) => {
          return `- [x] ~~${p1}~~`
        })
      })
    })
  }

  onListsChange (lists) {
    this.strikeOutCompletedItems(lists)
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
        title: `Write task to console.`
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
          this.project.addTag(task, 'tag')
        },
        icon: 'tag',
        pack: 'fas',
        title: 'Add tag'
      },
      {
        action: () => {
          this.project.copyToClipboard(task.data.rawMarkdown, "Markdown copied to clipboard!")
        },
        icon: 'markdown',
        pack: 'fab',
        title: 'Copy markdown to clipboard'
      },
      {
        action: () => {
          this.project.copyToClipboard(task.data.html, "HTML copied to clipboard!")
        },
        icon: 'copy',
        pack: 'fas',
        title: 'Copy html to clipboard'
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
      sourceLink: source && `[${source.path}:${line}](${source.path}:${line})`,
      dueEmoji: (() => {
        const due = totals["What's Due?"]
        let emoji = ':2nd_place_medal:'
        if (due >= 3) {
          emoji = ':fire:'
        } else if (due === 0) {
          emoji = ':rocket:'
        }
        return `<span style="font-size: 1.5em;">${emoji}</span>`
      })(),
      recentEmoji: (() => {
        const recentlyCompleted = totals["Recently Completed"]
        let emoji = ':2nd_place_medal:'
        if (recentlyCompleted >= 3) {
          emoji = ':rocket:'
        } else if (recentlyCompleted === 0) {
          emoji = ':fire:'
        }
        return `<span style="font-size: 1.5em;">${emoji}</span>`
      })(),
      wipEmoji: (() => {
        const doing = totals["DOING"]
        let emoji = ':2nd_place_medal:'
        if (doing >= 3) {
          emoji = ':fire:'
        } else if (doing === 0) {
          emoji = ':sleeping:'
        } else if (doing === 1) {
          emoji = ':rocket:'
        }
        return `<span style="font-size: 1.5em;">${emoji}</span>`
      })(),
      cardTotal: (() => {
        let count = 0
        Object.keys(totals).forEach(list => {
          count += totals[list]
        })
        return count
      })()
    }
  }
}
