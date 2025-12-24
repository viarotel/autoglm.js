import { AutoGLM } from 'autoglm.js'

async function main() {
  const agent = new AutoGLM({
    maxSteps: 100,
    lang: 'cn',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey: '74fab98ebabd483a9fb88e311c14f61c.OIQrXM8thm8vSxo1',
    model: 'autoglm-phone',
  })

  // agent.on('*', (type, message) => {
  //   console.log(type, message)
  // })
  agent.run('打开抖音')
}

main()
