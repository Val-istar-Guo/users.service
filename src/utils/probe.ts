interface PossibleValues {
  [key: string]: (value) => boolean
}


export class Probe<T extends PossibleValues> {
  private variable: any
  private possibleValues: T

  constructor(variable: any, possibleValues: T) {
    this.variable = variable
    this.possibleValues = possibleValues
  }

  get is(): Record<keyof T, boolean> {
    const value = this.variable

    const result = Object.entries(this.possibleValues)
      .map(([key, fn]) => ({ key, value: fn(value) }))
      .reduce((obj, { key, value }) => (obj[key] = value, obj), {})

    return result as Record<keyof T, boolean>
  }

  get not(): Record<keyof T, boolean> {
    const value = this.variable

    const result = Object.entries(this.possibleValues)
      .map(([key, fn]) => ({ key, value: !fn(value) }))
      .reduce((obj, { key, value }) => (obj[key] = value, obj), {})

    return result as Record<keyof T, boolean>
  }

  swtich<U>(options: Partial<Record<keyof T | 'default', U>>): U {
    if (!options.default) throw new TypeError('probe.switch() need default value')
    const keys = Object.keys(options).filter(key => key !== 'default')

    const value = this.variable
    for (const key of keys) {
      if (this.possibleValues[key](value)) return options[key] as U
    }

    return options.default
  }
}
