import { ExpressionSyntax } from './ExpressionSyntax'
import { SyntaxKind } from './SyntaxKind'
import { SyntaxToken } from './SyntaxToken'

export class BinaryExpressionSyntax extends ExpressionSyntax {
  kind = SyntaxKind.BinaryExpression

  constructor(
    public left: ExpressionSyntax,
    public operatorToken: SyntaxToken,
    public right: ExpressionSyntax
  ) {
    super()
  }

  getChildren() {
    return [
      this.left,
      this.operatorToken,
      this.right
    ]
  }
}
