import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { themr } from 'react-css-themr';
import { AUTOCOMPLETE } from '../identifiers';
import RawFormFieldSkin from './FormFieldSkin';
import Autocomplete from '../../../components/Autocomplete';

/**
 * The raw skin for the Autocomplete component.
 *
 * Since the skin uses raw sub-components by default, it exports this
 * factory method to make this configurable from the outside. This
 * is needed to provide components with a default skin (see one level up).
 *
 * @param FormFieldSkin
 * @returns {Component}
 */

export const autocompleteSkinFactory = (FormFieldSkin) => (
  (props) => {
    const filteredAndLimitedSuggestions = _.slice(props.filteredWords, 0, props.maxVisibleSuggestions);
    const isFirstOptionHighlighted = props.highlightedOptionIndex === 0 && filteredAndLimitedSuggestions.length;

    let selectedWords = props.selectedWords && props.selectedWords.map((selectedWord, index) => {
      return (
        <span className={props.theme.selectedWordBox} key={index}>
        <span className={props.theme.selectedWordValue}>
          {selectedWord}
          <span
            className={props.theme.selectedWordRemoveButton}
            onClick={props.component.removeWord.bind(null, index)}
          >
            &times;
          </span>
        </span>
      </span>
      );
    });

    // show placeholder only if no maximum selections declared or maximum not reached
    const canMoreWordsBeSelected = props.selectedWords.length < props.maxSelections;
    let placeholder = (!props.maxSelections || canMoreWordsBeSelected) ? props.placeholder : '';

    // selected words and input for enter new one
    const autocompleteContent = (
      <div className={props.theme.selectedWords}>
        {selectedWords}
        <input
          className={props.theme.selectWords}
          onKeyDown={props.component.onKeyDown}
          placeholder={placeholder}
          onKeyUp={props.component.clearInvalidChars}
          ref={element => {
            props.component.registerSkinPart(Autocomplete.SKIN_PARTS.INPUT, element);
          }}
        />
      </div>
    );

    return (
      <div ref={(element) => props.component.registerSkinPart(Autocomplete.SKIN_PARTS.ROOT, element)}>
        <FormFieldSkin input={
          <div
            className={props.theme.autocompleteWrapper}
            onClick={props.component.handleAutocompleteClick}
          >
            <div
              className={classnames([
                props.theme.autocompleteContent,
                props.isSuggestionsOpened ? props.theme.opened : null,
                props.selectedWords.length ? props.theme.hasSelectedWords : null,
                props.error ? props.theme.errored : null,
              ])}
              ref={element => {
                props.component.registerSkinPart(Autocomplete.SKIN_PARTS.SUGGESTIONS, element);
              }}
            >
              {autocompleteContent}
            </div>
            {props.suggestedWords &&
            <ul
              className={classnames([
                props.theme.suggestionsList,
                props.isSuggestionsOpened ? props.theme.opened : null,
                isFirstOptionHighlighted ? props.theme.firstOptionHighlighted : null,
              ])}
              style={props.dropdownParams && {
                top: props.dropdownParams.positionY,
                left: props.dropdownParams.positionX,
                width: props.dropdownParams.width,
              }}
            >
              {props.filteredWords.length ? filteredAndLimitedSuggestions.map((option, index) => {
                  return (
                    <li
                      key={index}
                      className={classnames([
                        props.theme.suggestionsListItem,
                        index === props.highlightedOptionIndex ? props.theme.highlighted : null,
                      ])}
                      onMouseEnter={() => props.component.setHighlightedOptionIndex(index)}
                      onClick={(event) => props.component.updateSelectedWords(event)}
                    >
                      {option}
                    </li>
                  );
                }) :
                <li className={props.theme.suggestionsListItem}>No matching results</li>
              }
            </ul>
            }
          </div>

        } {...props} />
      </div>
    );
  }
);

/**
 * Export the raw version of this component which does not include any styles.
 */
export default themr(AUTOCOMPLETE)(autocompleteSkinFactory(RawFormFieldSkin));
