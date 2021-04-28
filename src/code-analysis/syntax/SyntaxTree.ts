import { ExpressionSyntax } from './ExpressionSyntax'
import { Parser } from './Parser'
import { SyntaxToken } from './SyntaxToken'

export class SyntaxTree {
  constructor(
    public diagnostics: string[],
    public root: ExpressionSyntax,
    public endOfFileToken: SyntaxToken
  ) {}

  static parse(text: string) {
    const parser = new Parser(text)
    return parser.parse()
  }
}
