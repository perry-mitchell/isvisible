import isElement from 'iselement';
import {getStyleProperty} from 'style-properties';


// cross-browser way of getting element's style property
function getStyle (element, property) {
  if (window.getComputedStyle) {
    return getStyleProperty(element, property).original;
  } else if (element.currentStyle) {
    return element.currentStyle[property];
  }
  return null;
}


export function isVisible (element) {
  // don't bother with non-element inputs
  if (!isElement(element)) {
    return false;
  }

  // This should prevent problems with ShadowDOMPolyfill. It returns different
  // object when asking directly via `document.body` (native element) and when
  // asking via `document.querySelector()` (wrapped element). This would result
  // in traversing too far in the `while` cycle below.
  const body_element = document.querySelector('body');
  const html_element = document.querySelector('html');

  // elements that are not inserted into the body are never visible
  if (!body_element || !body_element.contains(element)) {
    return false;
  }

  // invisible elements
  if (getStyle(element, 'visibility') === 'hidden') {
    return false;
  }

  // test display property recursively for element and all its parents, until BODY
  while (element && (element !== body_element) && (element !== html_element)) {
    if (getStyle(element, 'display') === 'none') {
      return false;
    }
    if (getStyle(element, 'opacity').toString() === '0') {
      return false;
    }
    element = element.parentNode;
  }

  return true;
}


export function isVisibleAll (list) {
  for (let i = 0; i < list.length; i++) {
    if (!isVisible(list[i])) {
      return false;
    }
  }
  return true;
}


export function isVisibleAny (list) {
  for (let i = 0; i < list.length; i++) {
    if (isVisible(list[i])) {
      return true;
    }
  }
  return false;
}


export default isVisible;