export default interface TranslateRequest {
  text: string
  from: string
  to: string
}

export type TranslateResponse = {
  status: 'ok'
  text: string
} | {
  status: 'error'
  error: any
}