import { PluginObj, PluginPass, types as t } from '@babel/core';
import path from 'path';

export function headwindContent() {
  const headwind = require.resolve('headwind');

  return path.join(headwind, '..', '..', '.generated');
}

function fmt(str: string) {
  return str.replace(/_/g, '-');
}

export default function headingBabelPlugin(): PluginObj<
  PluginPass & { headwind: { classes: string } }
> {
  return {
    name: 'headwind',
    visitor: {
      MemberExpression(path, _) {
        if (
          !t.isIdentifier(path.node.object) ||
          path.node.object.name !== 'tw' ||
          !t.isIdentifier(path.node.property)
        )
          return;

        let curPath = path as any;

        let className = path.node.property.name;

        while (
          curPath.parentPath.isMemberExpression() ||
          curPath.parentPath.isCallExpression()
        ) {
          if (!t.isIdentifier(curPath.node.property)) {
            curPath = curPath.parentPath;
            continue;
          }

          if (t.isMemberExpression(curPath.parent)) {
            className += ' ' + curPath.parent.property.name;
          }
          curPath = curPath.parentPath;
        }

        curPath.replaceWith(t.stringLiteral(fmt(className)));
      },
    },
  };
}
