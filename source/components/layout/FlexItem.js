// @flow
import React, { Component } from 'react';
import type { Node } from 'react';

// components
import { Base } from './Base';

type Props = {
  alignSelf?: string,
  children: Node,
  className?: string,
  flex?: number,
  order?: number,
  theme?: Object
};

export class FlexItem extends Component<Props> {

  static displayName = 'FlexItem';
  static defaultProps = { theme: {} };

  render() {
    const { children, className, alignSelf, flex, order, theme } = this.props;
    return (
      <Base
        activeClasses={['item']}
        className={className}
        inlineStyles={{ order, alignSelf, flex }}
        stylesToAdd={theme}
      >
        {children}
      </Base>
    );
  }
}

