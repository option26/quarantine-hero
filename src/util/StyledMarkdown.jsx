import React from 'react';
import Markdown from 'markdown-to-jsx';
import { baseUrl } from '../appConfig';

export default function StyledMarkdown(props) {
  const {
    children,
    options = {
      forceBlock: true,
      overrides: {
        a: {
          component: ({ href, className, children: title }) => {
            if (href.startsWith('http') && !href.startsWith(baseUrl)) {
              return (
                <a
                  href={href}
                  className={className}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => props.stopPropagation && e.stopPropagation()}
                >
                  {title}
                </a>
              );
            }
            return (
              <a
                href={href}
                className={className}
                onClick={(e) => props.stopPropagation && e.stopPropagation()}
              >
                {title}
              </a>
            );
          },
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
