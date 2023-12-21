import path from 'node:path'
import fs from 'node:fs'
import yaml from 'js-yaml'
import log from 'electron-log/main'

export function AssistantsLoad(respath: string): Array<unknown> {
  const assistantlist: Array<unknown> = []
  const loadpath = path.join(respath, 'assistants')
  try {
    fs.readdirSync(loadpath).map((file) => {
      const filepath = path.join(loadpath, file)
      if (path.extname(filepath).toLowerCase() === '.yml') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const assistant = yaml.load(fs.readFileSync(filepath, 'utf-8')) as any
        const filename = path.basename(filepath)
        // Config字段是助手基本信息
        assistant.Config['FileName'] = filename
        assistant.Config['ImagePath'] = path.join(loadpath, assistant.Config['ImageFile'])
        assistantlist.push(assistant.Config)
      }
    })
  } catch (error) {
    log.error(`load file:${loadpath}`, error)
  }
  return assistantlist
}
