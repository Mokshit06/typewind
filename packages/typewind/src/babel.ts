import {
  NodePath,
  PluginObj,
  PluginPass,
  types as t,
  Visitor,
} from '@babel/core';
import _eval from 'eval';
import path from 'path';
import { createTypewindContext } from './utils';
import generator from '@babel/generator';

function fmt(str: string) {
  return str.replace(/_/g, '-');
}

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
          path.node.object.name !== 'tw' ||
          !t.isIdentifier(path.node.property)
        )
          return;

        let curPath = path as NodePath<any>;
        let prevPath: NodePath<any> = undefined!;

        while (
          curPath &&
          (t.isMemberExpression(curPath.node) ||
            t.isCallExpression(curPath.node))
        ) {
          prevPath = curPath!;
          curPath = curPath.parentPath!;
        }

        if (
          t.isCallExpression(prevPath.parent) ||
          t.isMemberExpression(prevPath.parent)
        )
          return;

        const code: string = generator(prevPath.node).code;

        const { result } = _eval(
          `
const { createTw } = require("typewind/dist/evaluate.js");
const tw = createTw();
exports.result = ${code}.toString()
`,
          true
        ) as { result: string };

        // console.log(prevPath.node, [...nodesReplaced][0]);
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
