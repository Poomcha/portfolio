import { Store } from './store'

export class Mistral {
  private url = import.meta.env.VITE_SERVER_URL
  private port = import.meta.env.VITE_SERVER_PORT
  private endpoint = import.meta.env.VITE_SERVER_ENDPOINT

  public async chat(question: string) {
    const url = `${this.url}:${this.port}${this.endpoint}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: question }),
    })

    return response.body
  }

  public async streamToStore(store: Store, question: string, answerId: string) {
    store.setStoreAnswer('', answerId)
    // This should be a stream
    try {
      const response = await this.chat(question)

      if (response) {
        const reader = response.getReader()
        const decoder = new TextDecoder('utf-8')

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          const chunk = decoder.decode(value, { stream: true })
          store.appendToStoreAnswer(chunk, answerId)
        }
      }
    } catch (error) {
      throw error
    }
  }
}
