import { BinaryExpressionSyntax } from './BinaryExpressionSyntax'
import { Lexer } from './Lexer'
import { LiteralExpressionSyntax } from './LiteralExpressionSyntax'
import { SyntaxKind, ISyntaxKind } from './SyntaxKind'
import { SyntaxToken } from './SyntaxToken'
import { ParenthesizedExpressionSyntax } from './ParenthesizedExpressionSyntax'
import { SyntaxTree } from './SyntaxTree'
import { ExpressionSyntax } from './ExpressionSyntax'
import { SyntaxFacts } from './SyntaxFacts'
import { UnaryExpressionSyntax } from './UnaryExpressionSyntax'

export class Parser {
  #tokens: Array<SyntaxToken> = []
  #position = 0
  diagnostics: Array<string> = []

  constructor(text: string) {
    const tokens = []
    const lexer = new Lexer(text)
    let token

    do {
      token = lexer.lex()

      if(
        token.kind !== SyntaxKind.WhitespaceToken &&
        token.kind !== SyntaxKind.BadToken
      ) {
        tokens.push(token)
      }

    } while(token.kind !== SyntaxKind.EndOfFileToken)

    this.#tokens = [...tokens]
    this.diagnostics = [...lexer.diagnostics]
  }

  get current() {
    return this.peek(0)
  }

  peek(offset: number) {
    const index = this.#position + offset
    if(index >= this.#tokens.length) {
      return this.#tokens[this.#tokens.length - 1]
    }
    
    return this.#tokens[index]
  }

  nextToken() {
    const current = this.current
    this.#position++
    return current
  }

  matchToken(kind: SyntaxKind) {
    if(this.current.kind === kind) return this.nextToken()

    this.diagnostics.push(`ERROR: unexpected token <${this.current.kind}>, expected <${kind}>`)
    return new SyntaxToken(kind, this.current.position, null, null)
  }

  parse() {
    const expresion = this.parseExpression()
    const endOfFileToken = this.matchToken(SyntaxKind.EndOfFileToken)

    return new SyntaxTree(this.diagnostics, expresion, endOfFileToken)
  }

  parseExpression(parentPrecedence = 0) {
    let left: ExpressionSyntax
    const unaryOperatorPrecedence = SyntaxFacts.getUnaryOperatorPrecedence(
      this.current.kind
    )

    if(unaryOperatorPrecedence != 0 && unaryOperatorPrecedence >= parentPrecedence) {
      const operandToken = this.nextToken()
      const operand = this.parseExpression(unaryOperatorPrecedence)
      left = new UnaryExpressionSyntax(operandToken, operand)
    } else {
      left = this.parsePrimaryExpression()
    }

    while(true) {
      const precedence = SyntaxFacts.getBinaryOperatorPrecedence(this.current.kind)
      if(precedence === 0 || precedence <= parentPrecedence) break;

      const operatorToken = this.nextToken()
      const right = this.parseExpression(precedence)
      left = new BinaryExpressionSyntax(left, operatorToken, right)
    }

    return left
  }

  parsePrimaryExpression(): ExpressionSyntax {
    if(this.current.kind === SyntaxKind.OpenParenthesisToken) {
      const left = this.nextToken()
      const expression = this.parseExpression()
      const right = this.matchToken(SyntaxKind.CloseParenthesisToken)

      return new ParenthesizedExpressionSyntax(left, expression, right)
    }

    const number = this.matchToken(SyntaxKind.NumberToken)
    return new LiteralExpressionSyntax(number)
  }

}
