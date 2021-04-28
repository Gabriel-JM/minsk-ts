import { ExpressionSyntax } from './ExpressionSyntax'
import { SyntaxKind } from './SyntaxKind'
import { SyntaxToken } from './SyntaxToken'

export class UnaryExpressionSyntax extends ExpressionSyntax {
  kind = SyntaxKind.UnaryExpression

  constructor(
    public operatorToken: SyntaxToken,
    public operand: ExpressionSyntax
  ) {
    super()
  }

  getChildren() {
    return [
      this.operatorToken,
      this.operand
    ]
  }
}
