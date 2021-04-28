import { BinaryExpressionSyntax } from '../code-analysis/syntax/BinaryExpressionSyntax'
import { ExpressionSyntax } from '../code-analysis/syntax/ExpressionSyntax'
import { LiteralExpressionSyntax } from '../code-analysis/syntax/LiteralExpressionSyntax'
import { SyntaxKind } from '../code-analysis/syntax/SyntaxKind'
import { UnaryExpressionSyntax } from '../code-analysis/syntax/UnaryExpressionSyntax'

export type Type = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

export enum BoundNodeKind {
  LiteralExpression,
  UnaryExpression,
  BinaryExpression
}

export abstract class BoundNode {
  abstract readonly kind: BoundNodeKind
}

export abstract class BoundExpression extends BoundNode {
  abstract readonly type: Type

  constructor() {
    super()
  }
}

export enum BoundUnaryOperatorKind {
  Identity,
  Negation
}

export class BoundLiteralExpression extends BoundExpression {
  type = typeof this.value
  kind = BoundNodeKind.LiteralExpression

  constructor(readonly value: any) {
    super()
  }
}

export class BoundUnaryExpression extends BoundExpression {
  type = this.operand.type
  kind = BoundNodeKind.UnaryExpression

  constructor(
    public operatorKind: BoundUnaryOperatorKind,
    public operand: BoundExpression
  ) {
    super()
  }
}

export enum BoundBinaryOperatorKind {
  Addition,
  Subtraction,
  Multiplication,
  Division
}

export class BoundBinaryExpression extends BoundExpression {
  type = this.left.type
  kind = BoundNodeKind.BinaryExpression
  
  constructor(
    public left: BoundExpression,
    public operatorKind: BoundBinaryOperatorKind,
    public right: BoundExpression
  ) {
    super()
  }
}

export class Binder {
  readonly diagnostics: Array<string> = []

  bindExpression(syntax: ExpressionSyntax): BoundExpression {
    switch(syntax.kind) {
      case SyntaxKind.LiteralExpression:
        return this.bindLiteralExpression(syntax as LiteralExpressionSyntax)
      case SyntaxKind.UnaryExpression:
        return this.bindUnaryExpression(syntax as UnaryExpressionSyntax)
      case SyntaxKind.BinaryExpression:
        return this.bindBinaryExpression(syntax as BinaryExpressionSyntax)
      default:
        throw new Error(`Unexpected syntax: ${syntax.kind}`)
    }
  }

  bindLiteralExpression(syntax: LiteralExpressionSyntax) {
    const value = syntax.literalToken.value ?? 0
    return new BoundLiteralExpression(value)
  }

  bindUnaryExpression(syntax: UnaryExpressionSyntax) {
    const boundOperand = this.bindExpression(syntax.operand)
    const boundOperatorKind = this.bindUnaryOperatorKind(
      syntax.operatorToken.kind,
      boundOperand.type
    )

    if(boundOperatorKind === null) {
      this.diagnostics.push(
        `Unary operator '${syntax.operatorToken.kind}' is not defined for type ${boundOperand.type}`
      )
      return boundOperand
    }

    return new BoundUnaryExpression(boundOperatorKind, boundOperand)
  }

  bindUnaryOperatorKind(kind: SyntaxKind, operandType: Type) {
    if(operandType !== 'number') return null

    switch(kind) {
      case SyntaxKind.PlusToken:
        return BoundUnaryOperatorKind.Identity
      case SyntaxKind.MinusToken:
        return BoundUnaryOperatorKind.Negation
      default:
        throw new Error(`Unexpected unary operator: ${kind}`)
    }
  }

  bindBinaryExpression(syntax: BinaryExpressionSyntax) {
    const boundLeft = this.bindExpression(syntax.left)
    const boundRight = this.bindExpression(syntax.right)
    const boundOperatorKind = this.bindBinaryOperatorKind(
      syntax.operatorToken.kind,
      boundLeft.type,
      boundRight.type
    )

    if(boundOperatorKind === null) {
      this.diagnostics.push(
        `Binary operator '${syntax.operatorToken.kind}' is not defined for type ${boundLeft.type} and ${boundRight.type}`
      )
      return boundLeft
    }

    return new BoundBinaryExpression(boundLeft, boundOperatorKind, boundRight)
  }

  bindBinaryOperatorKind(kind: SyntaxKind, leftType: Type, rightType: Type) {
    if(leftType !== 'number' || rightType !== 'number') return null

    switch(kind) {
      case SyntaxKind.PlusToken:
        return BoundBinaryOperatorKind.Addition
      case SyntaxKind.MinusToken:
        return BoundBinaryOperatorKind.Subtraction
      case SyntaxKind.StarToken:
        return BoundBinaryOperatorKind.Multiplication
      case SyntaxKind.SlashToken:
        return BoundBinaryOperatorKind.Division
      default:
        throw new Error(`Unexpected binary operator: ${kind}`)
    }
  }
}
