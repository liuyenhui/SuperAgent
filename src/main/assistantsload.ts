import path from 'path-browserify'
import fs from 'fs'
import yaml from 'js-yaml'
// import { System } from '@/components/public/system';
import log from 'electron-log/main'

// const InsertAssistantBase = AssistantsStore((state)=>state.InsertAssistantBase)

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
        assistantlist.push(assistant.Config)
      }
      // InsertAssistantBase(assistant)
      // console.log(assistant)
      // console.log(assistant.Config.Prompt)
      // // 写入yml文件
      // assistant.Config.Prompt = "小红书作者"
      // // 序列化对象 info
      // let yamlStr = yaml.dump(assistant);
      // console.log(yamlStr)
      // fs.writeFileSync(filename,yamlStr,'utf-8')
    })
  } catch (error) {
    log.error(`load file:${loadpath}`, error)
  }
  return assistantlist
}
