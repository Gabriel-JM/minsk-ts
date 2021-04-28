import { ParenthesizedExpressionSyntax } from './syntax/ParenthesizedExpressionSyntax'
import { BoundExpression, BoundLiteralExpression, BoundUnaryExpression, BoundUnaryOperatorKind, BoundBinaryExpression, BoundBinaryOperatorKind } from '../binding/Binder'

export class Evaluator {
  constructor(public root: BoundExpression) {}

  evaluate(): number {
    return evaluateExpression(this.root)
  }
}

function evaluateExpression(node: BoundExpression): number {
  if(node instanceof BoundLiteralExpression) {
    return node.value as any
  }

  if(node instanceof BoundUnaryExpression) {
    const operand = evaluateExpression(node.operand)

    switch (node.operatorKind) {
      case BoundUnaryOperatorKind.Identity:
        return operand
      case BoundUnaryOperatorKind.Negation:
        return -operand
      default:
        throw new Error(`Unexpected unary operator: ${node.operatorKind}`)
    }
  }

  if(node instanceof BoundBinaryExpression) {
    const left = evaluateExpression(node.left);
    const right = evaluateExpression(node.right);

    switch (node.operatorKind) {
      case BoundBinaryOperatorKind.Addition:
        return left + right;
      case BoundBinaryOperatorKind.Subtraction:
        return left - right;
      case BoundBinaryOperatorKind.Multiplication:
        return left * right;
      case BoundBinaryOperatorKind.Division:
        return left / right;
      default:
        throw new Error(`Unexpected binary operator: ${node.operatorKind}`);
    }
  }

  throw new Error(`Unexpected node: ${node.kind}`)
}
