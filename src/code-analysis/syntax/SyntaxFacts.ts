import { ISyntaxKind, SyntaxKind } from './SyntaxKind'

export class SyntaxFacts {
  static getUnaryOperatorPrecedence(kind: SyntaxKind) {
    switch(kind) {
      case SyntaxKind.PlusToken:
      case SyntaxKind.MinusToken:
        return 3
      
      default: return 0
    }
  }

  static getBinaryOperatorPrecedence(kind: SyntaxKind) {
    switch(kind) {
      case SyntaxKind.StarToken:
      case SyntaxKind.SlashToken:
        return 2

      case SyntaxKind.PlusToken:
      case SyntaxKind.MinusToken:
        return 1

      default: return 0
    }
  }
}
