import React from 'react';
import Markdown from 'markdown-to-jsx';

export default function StyledMardown(props) {
  const {
    children,
    options = {
      forceBlock: true,
      overrides: {
        a: {
          props: {
            className: 'text-secondary hover:underline',
          },
        },
        del: {
          component: ({ children: c }) => (<u>{c}</u>),
        },
        ul: {
          props: {
            className: 'list-disc ml-5',
          },
        },
        li: {
          props: {
            className: 'mt-1',
          },
        },
      },
    },
    className,
  } = props;

  return (
    <Markdown className={`font-open-sans ${className}`} options={options}>
      {children.replace(/\n\n(\n+)/g, (m, p1) => `\n\n${p1.replace(/\n/g, '<br/>')}\n`)}
    </Markdown>
  );
}
