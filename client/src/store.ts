import { reactive } from 'vue'
import { Mistral } from './mistral'

//#region Types
interface StoreInterface {
  qA: Array<{
    question?: string
    answer?: string
    id: string
  }>
}

type StoreQuestionType = StoreInterface['qA'][number]['question']
type StoreAnswerType = StoreInterface['qA'][number]['answer']
type StoreIdType = StoreInterface['qA'][number]['id']
//#endregion

//#region Class Store
class Store {
  private store: StoreInterface
  private qABase: StoreInterface['qA'][number] = {
    question: '',
    answer: undefined,
    id: 'qA-0',
  }
  private mistral = new Mistral()

  private preambule = `Present yourself in the language whose code is ${window.navigator.language}.`

  constructor() {
    this.store = reactive<StoreInterface>({
      qA: [
        {
          question: '',
          answer: undefined,
          id: 'qA-0',
        },
      ],
    })
  }

  //#region Getters
  public getStore() {
    return this.store
  }
  public getStoreQuestion(id: StoreIdType): StoreQuestionType {
    try {
      return this.getStore()['qA'][this.parseId(id)]['question']
    } catch (error) {
      throw error
    }
  }
  public getStoreAnswer(id: StoreIdType): StoreAnswerType {
    try {
      return this.getStore()['qA'][this.parseId(id)]['answer']
    } catch (error) {
      throw error
    }
  }
  //#endregion

  //#region Setters
  public setStore(store: StoreInterface) {
    this.store = store
  }
  public setStoreQuestion(question: StoreQuestionType, id: StoreIdType) {
    try {
      if (question) {
        this.store['qA'][this.parseId(id)]['question'] = question.trim()
      }
    } catch (error) {
      throw error
    }
  }
  public appendToStoreQuestion(chunk: string, id: StoreIdType) {
    try {
      const question = this.store['qA'][this.parseId(id)]['question']
      if (!question && !!question!.trim()) {
        this.setStoreQuestion(chunk, id)
      } else {
        this.setStoreQuestion(question!.concat(chunk), id)
      }
    } catch (error) {
      throw error
    }
  }
  public setStoreAnswer(answer: StoreAnswerType, id: StoreIdType) {
    try {
      this.store['qA'][this.parseId(id)]['answer'] = this.parseAnswerToHTML(answer)
    } catch (error) {
      throw error
    }
  }
  public appendToStoreAnswer(chunk: string, id: StoreIdType) {
    try {
      const answer = this.store['qA'][this.parseId(id)]['answer']
      if (!answer && !!answer!.trim()) {
        this.setStoreAnswer(chunk, id)
      } else {
        this.setStoreAnswer(answer?.concat(chunk), id)
      }
    } catch (error) {
      throw error
    }
  }
  //#endregion

  //#region Public Methods
  public async initStore() {
    const answer = await this.mistral.streamToStore(this, this.preambule, this.getFirstId())

    this.insertNewQA()
  }

  public insertNewQA() {
    this.store['qA'].push({
      question: '',
      answer: undefined,
      id: `qA-${this.getStore()['qA'].length}`,
    })
  }

  public getCurrentId() {
    return this.store.qA[this.store.qA.length - 1]['id']
  }

  public getFirstId() {
    return this.store.qA[0]['id']
  }
  //#endregion

  //#region Private Methods
  private parseId(id: StoreIdType): number {
    try {
      return parseInt(id.split('-')[1])
    } catch (error) {
      throw error
    }
  }

  private parseAnswerToHTML(answer: StoreAnswerType = '') {
    return answer.replaceAll('\n', '<br />')
  }
}
//#endregion

export { Store }
