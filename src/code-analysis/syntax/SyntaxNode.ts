import { SyntaxKind } from './SyntaxKind'

export abstract class SyntaxNode {
  public abstract kind: SyntaxKind
  public abstract getChildren(): Array<SyntaxNode>
}
