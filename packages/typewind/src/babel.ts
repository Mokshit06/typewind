import { NodePath, PluginObj, PluginPass, types as t } from '@babel/core';
import _eval from 'eval';
import { createTypewindContext } from './utils';
import generator from '@babel/generator';

export default function headingBabelPlugin(): PluginObj<
  PluginPass & { classes: string[] }
> {
  const nodesReplaced = new Set<any>();
  const ctx = createTypewindContext();

  return {
    name: 'typewind',
    pre(state) {
      this.classes ??= [];
    },
    visitor: {
      MemberExpression(path, state) {
        if (
          !t.isIdentifier(path.node.object) ||
          path.node.object.name !== 'tw'
          // !t.isIdentifier(path.node.property)
        )
          return;

        let curPath = path as NodePath<any>;
        let prevPath: NodePath<any> = undefined!;

        while (
          curPath &&
          (t.isMemberExpression(curPath.node) ||
            (t.isCallExpression(curPath.node) &&
              (prevPath == undefined || prevPath.node == curPath.node.callee)))
        ) {
          prevPath = curPath!;
          curPath = curPath.parentPath!;
        }

        const code: string = generator(prevPath.node).code;

        const { result } = _eval(
          `
const { createTw } = require("typewind/dist/evaluate.js");
const tw = createTw();
try {
  let result$$ = ${code};
  if (typeof result$$ === 'function' || typeof result$$ === "undefined") {
    throw new Error()
  } else {
    exports.result = result$$.toString();
  }
} catch (error) {
  throw new Error(\`Error in evaluating typewind expression: ${code.replace(
    '`',
    '\\`'
  )}\`)
}
`,
          true
        ) as { result: string };

        if (prevPath.node && !t.isStringLiteral(prevPath.node)) {
          nodesReplaced.add(prevPath.node);
          // ignore this 👍
          try {
            prevPath.replaceWith(t.stringLiteral(result));
          } catch {}
        }
      },
    },
  };
}
