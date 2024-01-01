import path from 'node:path'
import fs from 'node:fs'
import yaml from 'js-yaml'
import log from 'electron-log/main'
import { is } from '@electron-toolkit/utils'

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
        assistant.Config['ImagePath'] = is.dev
          ? path.join(loadpath, assistant.Config['ImageFile'])
          : path.join(loadpath, assistant.Config['ImageFile'])
        assistantlist.push(assistant.Config)
      }
    })
  } catch (error) {
    log.error(`load file:${loadpath}`, error)
  }
  return assistantlist
}
export function AssistantsSave(respath: string, assistants: Array<object>): void {
  const savepath = path.join(respath, 'assistants')
  try {
    assistants.map((assistant) => {
      const filepath = path.join(savepath, assistant['AssistantBase'].FileName)
      const savevalue = {
        Config: assistant['AssistantBase']
      }
      const savestr = yaml.dump(savevalue)
      fs.writeFileSync(filepath, savestr, 'utf-8')
    })
  } catch (error) {
    log.error(`save file:${savepath},e`, error)
  }
}
