// @flow
import React, { Component } from 'react';
import type { ComponentType, Element } from 'react';
import { pickBy, isEmpty } from 'lodash';

// components
import { withTheme } from './HOC/withTheme';

// utility functions
import { composeTheme, addThemeId, didThemePropsChange } from '../utils/themes';

// constants
import { IDENTIFIERS } from '../themes/API';

type Props = {
  bold: boolean,
  center: boolean,
  children: Element<*>,
  className: string,
  context: {
    theme: Object,
    ROOT_THEME_API: Object
  },
  h1: boolean,
  h2: boolean,
  h3: boolean,
  h4: boolean,
  light: boolean,
  lowerCase: boolean,
  medium: boolean,
  regular: boolean,
  right: boolean,
  left: boolean,
  skin: ComponentType<any>,
  theme: Object,
  themeId: string,
  themeOverrides: Object,
  thin: boolean,
  upperCase: boolean
};

type State = { composedTheme: Object };

class HeaderBase extends Component <Props, State> {
  // define static properties
  static displayName = 'Header';
  static defaultProps = {
    theme: null,
    themeId: IDENTIFIERS.HEADER,
    themeOverrides: {}
  };

  constructor(props: Props) {
    super(props);

    const { context, themeId, theme, themeOverrides } = props;

    this.state = {
      composedTheme: composeTheme(
        addThemeId(theme || context.theme, themeId),
        addThemeId(themeOverrides, themeId),
        context.ROOT_THEME_API
      )
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    didThemePropsChange(this.props, nextProps, this.setState.bind(this));
  }

  _assembleInlineStyles = ({ center, lowerCase, left, right, upperCase }) => {
    const inlineStyles = {};
    const textAlign = pickBy({ center, left, right });
    const textTransform = pickBy({ lowerCase, upperCase });

    if (!isEmpty(textAlign)) {
      inlineStyles.textAlign = Object.keys(textAlign)[0];
    }

    if (!isEmpty(textTransform)) {
      inlineStyles.textTransform = Object.keys(textTransform)[0];
    }

    return inlineStyles;
  };

  _assembleHeaderTheme = (styleProps: Object) => {
    const activeClasses = this._getActiveClasses(styleProps);
    const theme = this.state.composedTheme[this.props.themeId];

    return activeClasses.reduce((reducedTheme, activeClass) => {
      if (activeClass && Object.hasOwnProperty.call(theme, activeClass)) {
        reducedTheme[activeClass] = theme[activeClass];
      }
      return reducedTheme;
    }, {});
  };

  _getActiveFont = ({ light, medium, regular, thin, bold }) => {
    const fontProps = pickBy({ light, medium, regular, thin, bold });
    if (isEmpty(fontProps)) { return; }
    // returns the first active font if more than 1 is passed
    return Object.keys(fontProps)[0];
  };

  _getActiveTheme = ({ h1, h2, h3, h4 }) => {
    const themeProps = pickBy({ h1, h2, h3, h4 });
    if (isEmpty(themeProps)) { return; }
    // returns the first active theme if more than 1 is passed
    return Object.keys(themeProps)[0];
  };

  _getActiveClasses = (styleProps: Object) => {
    const activeClasses = ['header'];
    const activeTheme = this._getActiveTheme(styleProps);
    const activeFont = this._getActiveFont(styleProps);

    if (activeTheme) { return [...activeClasses, activeTheme]; }
    if (activeFont) { return [...activeClasses, activeFont]; }

    return [...activeClasses, activeTheme, activeFont].filter(val => val);
  };

  render() {
    const { children, className, skin: HeaderSkin, ...styleProps } = this.props;

    const reducedTheme = this._assembleHeaderTheme(styleProps);
    const inlineStyles = this._assembleInlineStyles(styleProps);

    return (
      <HeaderSkin
        className={className}
        inlineStyles={inlineStyles}
        theme={reducedTheme}
      >
        {children}
      </HeaderSkin>
    );
  }
}

export const Header = withTheme(HeaderBase);
