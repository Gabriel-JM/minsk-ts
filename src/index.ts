import readline from 'readline'
import { Binder } from './binding/Binder'
import { Evaluator } from './code-analysis/Evaluator'
import { SyntaxNode } from './code-analysis/syntax/SyntaxNode'
import { SyntaxToken } from './code-analysis/syntax/SyntaxToken'
import { SyntaxTree } from './code-analysis/syntax/SyntaxTree'

process.on('unhandledRejection', (reason, promise) => {
  console.log('Rejection:', promise)
  process.exit(1)
})

process.on('exit', code => {
  if(code === 1) {
    console.error('Process finalized...')
  }
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function quest(text: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(text, a => resolve(a))
  })
}

function prettyPrint(node: SyntaxNode, indent = '', isLast = true) {
  const marker = isLast ? "└── " : "├── "
  let text = indent + marker + node.kind

  const nodeToken = node as SyntaxToken
  if(node && nodeToken.value != null) {
    text += ' ' + nodeToken.value
  }

  console.log(text)

  indent += isLast ? "    " : "│   "
  
  if(node.getChildren) {
    const childNodes = node.getChildren()

    for(const child of childNodes) {
      const isLast = childNodes.indexOf(child) === childNodes.length - 1
      prettyPrint(child, indent, isLast)
    }
  }
  
}

async function run() {
  let showTree = false

  while(true) {
    const line = await quest('> ')

    if(line === '') break;

    if(line === '#showTree') {
      showTree = !showTree
      console.log(
        showTree
        ? 'Showing parse trees.'
        : 'Not showing parse trees.'
      )
      continue
    } else if(line === '#cls') {
      console.clear()
      continue
    } else if(line === '.exit') {
      process.exit(0)
    }

    const syntaxTree = SyntaxTree.parse(line)
    const binder = new Binder()
    const boundExpression = binder.bindExpression(syntaxTree.root)

    const diagnostics = syntaxTree.diagnostics.concat(binder.diagnostics)

    if(showTree) {
      prettyPrint(syntaxTree.root)
    }

    if(diagnostics.length) {
      for(const diagnostic of syntaxTree.diagnostics) {
        console.log(diagnostic)
      }
    } else {
      const evaluator = new Evaluator(boundExpression)
      const result = evaluator.evaluate()
      console.log(result)
    }
  }
  
  rl.close()
}

run()
