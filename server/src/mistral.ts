import { Mistral } from "@mistralai/mistralai";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_AGENT_API_KEY = process.env.MISTRAL_AGENT_API_KEY;

export default class MistralClient {
  private client: Mistral;
  constructor() {
    // Initialize client
    this.client = new Mistral({ apiKey: MISTRAL_API_KEY });
  }

  // Produce a stream of a chat completion from a specific MistralAI agent
  public async chatStream(prompt: string, agentId = MISTRAL_AGENT_API_KEY) {
    try {
      if (!agentId) {
        throw new Error("Missing agentId");
      }
      const modelResponse = await this.client.agents.stream({
        messages: [{ role: "user", content: prompt }],
        // Specific MistralAI Agent
        agentId: agentId,
        stream: true,
      });

      return modelResponse;
    } catch (error) {
      throw error;
    }
  }
}
