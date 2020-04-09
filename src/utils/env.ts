interface Snapshot {
  prod: boolean
  dev: boolean
  test: boolean
  local: boolean
  not: Snapshot
}

class Env {
  private variable: () => string

  constructor(variable = () => process.env.NODE_ENV || 'local') {
    this.variable = variable
  }

  get is(): Snapshot {
    const value = this.variable()

    const dev = value === 'development'
    const local = value === 'local'
    const test = value === 'test'
    const prod = !dev && !local

    const snapshot = {
      prod,
      dev,
      local,
      test,
      get not() {
        return {
          prod: !this.prod,
          dev: !this.dev,
          local: !this.local,
          test: !this.test,
          get not() {
            return snapshot
          },
        }
      },
    }

    return snapshot
  }

  public switch<T>(mapping: { dev?: T; prod?: T; local?: T; test?: T; default: T; priority?: T }): T {
    if (mapping.priority !== undefined) return mapping.priority

    if (this.is.dev && mapping.dev !== undefined) return mapping.dev
    else if (this.is.test && mapping.test !== undefined) return mapping.test
    else if (this.is.local && mapping.local !== undefined) return mapping.local
    else if (this.is.prod && mapping.prod !== undefined) return mapping.prod

    return mapping.default
  }
}

export const env = new Env()
