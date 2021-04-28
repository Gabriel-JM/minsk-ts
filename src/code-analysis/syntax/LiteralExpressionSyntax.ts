import { ExpressionSyntax } from './ExpressionSyntax'
import { SyntaxKind } from './SyntaxKind'
import { SyntaxToken } from './SyntaxToken'

export class LiteralExpressionSyntax extends ExpressionSyntax {
  kind = SyntaxKind.LiteralExpression
  
  constructor(public literalToken: SyntaxToken) {
    super()
  }

  getChildren() {
    return [
      this.literalToken
    ]
  }
}
