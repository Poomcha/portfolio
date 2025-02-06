import { Mistral } from "@mistralai/mistralai";
import { EventStream } from "@mistralai/mistralai/lib/event-streams";
import {
  AgentsCompletionRequest,
  AgentsCompletionStreamRequest,
  ChatCompletionResponse,
  CompletionEvent,
} from "@mistralai/mistralai/models/components";
import { Retrier } from "@poomcha/retrier";
import { RetrierOptions } from "@poomcha/retrier/src/retrier/types";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_AGENT_API_KEY = process.env.MISTRAL_AGENT_API_KEY;

export default class MistralClient {
  private client: Mistral;
  private retrier: Retrier;

  private readonly retrierOptions: RetrierOptions<unknown, unknown> = {
    maxRetries: 2,
    delay: 1000,
    onSuccess: {
      callback: function (_res) {
        return;
      },
      args: [],
      override: false,
    },
    onFailure: {
      callback: function (error) {
        console.error(error);

        return `Error: MistralAI Unavailable.`;
      },
      args: [],
      override: true,
    },
  };
  constructor() {
    // Initialize client
    this.client = new Mistral({ apiKey: MISTRAL_API_KEY });
    this.retrier = new Retrier(this.retrierOptions);
  }

  // Produce a response of a chat completion from a specific MistralAI agent
  public async chat(prompt: string, agentId = MISTRAL_AGENT_API_KEY) {
    try {
      if (!agentId) {
        throw new Error("Missing agentId");
      }
      const mistralApiCall = async function (options: AgentsCompletionRequest) {
        return await (this.client as Mistral).agents.complete(options);
      };
      const mistralApiOptions = {
        messages: [{ role: "user", content: prompt }],
        // Specific MistralAI Agent
        agentId: agentId,
      };

      const modelResponse = await this.retrier.retryAsync<
        ChatCompletionResponse,
        void,
        string
      >(mistralApiCall.bind(this), [mistralApiOptions]);

      return modelResponse;
    } catch (error) {
      throw error;
    }
  }

  // Produce a stream of a chat completion from a specific MistralAI agent
  public async chatStream(prompt: string, agentId = MISTRAL_AGENT_API_KEY) {
    try {
      if (!agentId) {
        throw new Error("Missing agentId");
      }
      const mistralApiCall = async function (
        options: AgentsCompletionStreamRequest
      ) {
        return await (this.client as Mistral).agents.stream(options);
      };
      const mistralApiCallOptions = {
        messages: [{ role: "user", content: prompt }],
        // Specific MistralAI Agent
        agentId: agentId,
        stream: true,
      };

      const modelResponse = await this.retrier.retryAsync<
        EventStream<CompletionEvent>,
        never,
        string
      >(mistralApiCall.bind(this), [mistralApiCallOptions]);

      return modelResponse;
    } catch (error) {
      throw error;
    }
  }
}
