import { SyntaxKind } from './SyntaxKind'
import { SyntaxToken } from './SyntaxToken'

export class Lexer {
  #text = ''
  #position = 0
  diagnostics: Array<string> = []

  constructor(text: string) {
    this.#text = text
  }

  get current() {
    if(this.#position >= this.#text.length) return '\0'

    return this.#text.charAt(this.#position)
  }

  #next = () => this.#position++

  lex() {
    if(this.#position >= this.#text.length) {
      return new SyntaxToken(
        SyntaxKind.EndOfFileToken,
        this.#position,
        '\0',
        null
      )
    }

    if(
      (Number(this.current) ||
      this.current == '0') &&
      this.current !== '' &&
      this.current !== ' '
    ) {
      const start = this.#position

      while(
        (Number(this.current) ||
        this.current == '0') &&
        this.current !== '' &&
        this.current !== ' '
      ) {
        this.#next()
      }

      const text = this.#text.substring(start, this.#position)
      const value = Number(text)

      if(value !== 0 && !value) {
        this.diagnostics.push(`The number ${text} isn't valid Int32.`)
      }

      return new SyntaxToken(
        SyntaxKind.NumberToken,
        start,
        text,
        value
      )
    }

    if(this.current === ' ' || this.current === '') {
      const start = this.#position

      while(this.current === ' ' || this.current === '') {
        this.#next()
      }

      const text = this.#text.substring(start, this.#position)

      return new SyntaxToken(
        SyntaxKind.WhitespaceToken,
        start,
        text,
        null
      )
    }

    const symbols = {
      '+': () => new SyntaxToken(SyntaxKind.PlusToken, this.#position++, '+', null),
      '-': () => new SyntaxToken(SyntaxKind.MinusToken, this.#position++, '-', null),
      '*': () => new SyntaxToken(SyntaxKind.StarToken, this.#position++, '*', null),
      '/': () => new SyntaxToken(SyntaxKind.SlashToken, this.#position++, '/', null),
      '(': () => new SyntaxToken(SyntaxKind.OpenParenthesisToken, this.#position++, '(', null),
      ')': () => new SyntaxToken(SyntaxKind.CloseParenthesisToken, this.#position++, ')', null)
    }

    if(this.current in symbols) {
      const key = this.current as keyof typeof symbols
      return symbols[key]()
    }

    this.diagnostics.push(`ERROR: bad character input: '${this.current}'`)
    return new SyntaxToken(
      SyntaxKind.BadToken,
      this.#position++,
      this.#text.substring(this.#position - 1, 1),
      null
    )
  }

}
