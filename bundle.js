'use strict';

var Plugin = require('imdone-api');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Plugin__default = /*#__PURE__*/_interopDefaultLegacy(Plugin);

class SamplePlugin extends Plugin__default["default"] {
  
  constructor (project) {
    super(project);
  }
  
  onTaskUpdate (task) {
    task.interpretedContent = task.interpretedContent.replace(/- \[x\] (.*)$/gm, (match, p1) => {
      return `- [x] ~~${p1}~~`
    });
  }

  getBoardActions () {
    const project = this.project;
    return [
      {
        name: 'Filter for urgent cards',
        action: () => {
          project.setFilter('allTags=urget');
        }
      },
      {
        name: 'Add a card in TODO',
        action: () => {
          project.newCard({ list: 'TODO'});
        }
      },
      {
        name: 'Test snackBar',
        action: () => {
          project.snackBar({message:'Testing snackBar'});
        }
      },
      {
        name: 'Test toast',
        action: () => {
          project.toast({message:'Testing toast'});
        }
      }
    ]
  }

  getCardLinks (task) {
    this.project;
    return [
      {
        action: () => {
          console.log('Active Task:',task);
        },
        icon: 'rocket',
        pack: 'fas',
        title: `Write task to console`
      },
      {
        action: () => {
          this.project.addMetadata(task, 'metadata', 'value');
        },
        icon: 'table',
        pack: 'fas',
        title: 'Add metadata:value'
      },
      {
        action: () => {
          this.project.addTag(task, 'tag');
        },
        icon: 'tag',
        pack: 'fas',
        title: 'Add tag'
      },
      {
        action: () => {
          this.project.copyToClipboard(task.data.rawMarkdown, "Markdown copied to clipboard!");
        },
        icon: 'markdown',
        pack: 'fab',
        title: 'Copy markdown'
      },
      {
        action: () => {
          this.project.copyToClipboard(task.data.html, "HTML copied to clipboard!");
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
    } = task;
    return {
      date: (new Date()).toDateString(),
      time: (new Date()).toLocaleTimeString(),
      timestamp: (new Date()).toISOString(),
      sourceLink: source && `[${source.path}:${line}](${source.path}:${line})`,
      dueEmoji: (() => {
        const due = totals["What's Due?"];
        let emoji = ':2nd_place_medal:';
        if (due >= 3) {
          emoji = ':fire:';
        } else if (due === 0) {
          emoji = ':rocket:';
        }
        return `<span style="font-size: 1.5em;">${emoji}</span>`
      })(),
      recentEmoji: (() => {
        const recentlyCompleted = totals["Recently Completed"];
        let emoji = ':2nd_place_medal:';
        if (recentlyCompleted >= 3) {
          emoji = ':rocket:';
        } else if (recentlyCompleted === 0) {
          emoji = ':fire:';
        }
        return `<span style="font-size: 1.5em;">${emoji}</span>`
      })(),
      wipEmoji: (() => {
        const doing = totals["DOING"];
        let emoji = ':2nd_place_medal:';
        if (doing >= 3) {
          emoji = ':fire:';
        } else if (doing === 0) {
          emoji = ':sleeping:';
        } else if (doing === 1) {
          emoji = ':rocket:';
        }
        return `<span style="font-size: 1.5em;">${emoji}</span>`
      })(),
      cardTotal: (() => {
        let count = 0;
        Object.keys(totals).forEach(list => {
          count += totals[list];
        });
        return count
      })()
    }
  }
}

module.exports = SamplePlugin;
