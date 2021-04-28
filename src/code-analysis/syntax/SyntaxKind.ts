export enum SyntaxKind {
  // Tokens
  NumberToken,
  WhitespaceToken,
  PlusToken,
  MinusToken,
  StarToken,
  SlashToken,
  OpenParenthesisToken,
  CloseParenthesisToken,
  BadToken,
  EndOfFileToken,

  // Expressions
  LiteralExpression,
  UnaryExpression,
  BinaryExpression,
  ParenthesizedExpression
}

export type ISyntaxKind = keyof typeof SyntaxKind
