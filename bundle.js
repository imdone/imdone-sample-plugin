'use strict';

var Plugin = require('imdone-api');
var settings = require('imdone-api/lib/settings');

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
      sourceLink: source && `[${source.path}:${line}](${source.path}:${line})`
    }
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

  getCardActions (task) {
    return [
      ...this.getTagActions(task),
      ...this.getMetaActions(task),
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

  getMetaActions (task) {
    return this.getMeta()
      .filter(({key, value}) => !(task.allMeta[key] && task.allMeta[key].includes(value)))
      .map(({key, value}) => {
        return {
          action: () => {
            this.project.addMetadata(task, key, value);
          },
          icon: 'table',
          pack: 'fas',
          title: `Add metadata ${key} = ${value}`
        }      
      })
  }

  getTagActions (task) {
    return this.getTags()
      .filter(({name}) => !task.allTags.includes(name))
      .map(({name}) => {
        return {
          action: () => {
            this.project.addTag(task, name);
          },
          icon: 'tag',
          pack: 'fas',
          title: `Add ${name} tag`
        }      
      })
  }

  getTags () {
    return this.getSettings().tags || []
  }

  getMeta () {
    return this.getSettings().meta || []
  }

  getSettingsSchema () {
    if (!this.settingSchema) {
      this.settingSchema = new settings.Settings()
        .addProperty(
          'tags',
          new settings.ArrayProperty()
            .itemsDraggable(true)
            .setTitle('Tags')
            .setDescription('Quick add tags from card menu.')
            .itemTitle('Tag')
            .addItemProperty('name', new settings.StringProperty().setTitle('Name'))
        )
        .addProperty(
          'meta',
          new settings.ArrayProperty()
            .itemsDraggable(true)
            .setTitle('Metadata')
            .setDescription('Quick set metadata from card menu.')
            .itemTitle('Key, value pair')
            .addItemProperty('key', new settings.StringProperty().setTitle('Key'))
            .addItemProperty('value', new settings.StringProperty().setTitle('Value'))
        );
    }
    return this.settingSchema
  }
}

module.exports = SamplePlugin;
