import { ValidationError } from "express-validator"

interface SErrorParams {
  msg: string[]
  status: number
  log?: string
}
export class SError extends Error {
  constructor(
    public params: SErrorParams,
    public validationParams: ValidationError[] = []
  ) {
    super()
    if (validationParams.length > 0) {
      this.params.msg = validationParams.map((val) => {
        return String(val.msg)
      })
    }
    if (params.log !== undefined) {
      console.log(params.log)
    }
    Object.setPrototypeOf(this, SError.prototype)
  }
}
