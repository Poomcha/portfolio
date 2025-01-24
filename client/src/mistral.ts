import axios from 'axios'

export class Mistral {
  private url = import.meta.env.VITE_SERVER_URL
  private port = import.meta.env.VITE_SERVER_PORT
  private endpoint = import.meta.env.VITE_SERVER_ENDPOINT

  public async chat(question: string) {
    const url = `https://portfolio-liart-eight-49.vercel.app/api/chat`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: question }),
    })

    return response.body
  }
}
