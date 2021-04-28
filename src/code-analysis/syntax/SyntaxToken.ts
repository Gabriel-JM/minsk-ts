import { SyntaxKind } from './SyntaxKind'
import { SyntaxNode } from './SyntaxNode'

export class SyntaxToken extends SyntaxNode {
  constructor(
    public kind: SyntaxKind,
    public position: number,
    public text: string | null,
    public value: object | number | string | boolean | Function | null
  ) {
    super()
  }

  getChildren() {
    return []
  }
}
