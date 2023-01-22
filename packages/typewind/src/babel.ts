import {
  NodePath,
  PluginObj,
  PluginPass,
  types as t,
  Visitor,
} from '@babel/core';
import eval from 'eval';
import path from 'path';
import { createTypewindContext } from './utils';
import generator from '@babel/generator';

export function typewindContent() {
  const typewind = require.resolve('typewind');

  return path.join(typewind, '..', '..', '.generated');
}

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

        console.log('tw access');

        const code: string = (generator as any).default(prevPath.node).code;
        console.log(code);

        const { result } = eval(
          `
const {createTW} = require("typewind/dist/evaluate.cjs");
const tw = createTW();
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
