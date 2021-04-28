import { ExpressionSyntax } from './ExpressionSyntax'
import { SyntaxKind } from './SyntaxKind'
import { SyntaxToken } from './SyntaxToken'

export class ParenthesizedExpressionSyntax extends ExpressionSyntax {
  kind = SyntaxKind.ParenthesizedExpression

  constructor(
    public openParenthesisToken: SyntaxToken,
    public expression: ExpressionSyntax,
    public closeParenthesisToken: SyntaxToken
  ) {
    super()
  }

  getChildren() {
    return [
      this.openParenthesisToken,
      this.expression,
      this.closeParenthesisToken
    ]
  }
}
