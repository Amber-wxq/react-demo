const editorEl = document.querySelector('#editor');

function bind() {
  editorEl.addEventListener('mousedown', handleMousedown);
}

window.addEventListener('load', () => {
  bind();
});

const caret = createCaret();
const selectionWrapper = createSelectionWrapper();
let isSelecting = false;
let anchorKeeper = null;
let focusKeeper = null;

function handleMousedown(e) {
  e.preventDefault();
  const { clientX, clientY, target } = e;
  const nodeAndOffset = getNodeAndOffsetByCoordinate(target, clientX, clientY);
  nodeAndOffset.node && setCaret(nodeAndOffset.node, nodeAndOffset.offset);
  anchorKeeper = {
    node: nodeAndOffset.node,
    offset: nodeAndOffset.offset
  };
  // editorEl.addEventListener('mousemove', handleMousemove);
  // editorEl.addEventListener('mouseup', handleMouseup);
  isSelecting = true;
}

function handleMousemove(e) {
  console.log(isSelecting);
  if (!isSelecting) {
    return;
  }
  const { clientX, clientY, target } = e;
  const nodeAndOffset = getNodeAndOffsetByCoordinate(target, clientX, clientY);
  setSelection(nodeAndOffset.node, nodeAndOffset.offset);
}

function handleMouseup(e) {
  e.preventDefault();
  isSelecting = false;
  // editorEl.removeEventListener('mousemove', handleMousemove);
  // editorEl.removeEventListener('mouseup', handleMouseup);
}

/**
 * @description 设置选区开始位置
 * @param {Text} node 选区开始节点
 * @param {number} offset 选区开始偏移量
 */
function setAnchor(node, offset) {
  anchorKeeper = { node, offset };
}

/**
 * @description 设置选区结束位置
 * @param {Text} node 选区结束节点
 * @param {number} offset 选区结束偏移量
 */
function setFocus(node, offset) {
  focusKeeper = { node, offset };
}

/**
 * @description 清除选区
 */
function clearSelectionKeeper() {
  anchorKeeper = null;
  focusKeeper = null;
}

const RELATIVE_POSITION = {
  ABOVE: 'above',
  BELOW: 'below',
  RIGHT: 'right',
  LEFT: 'left'
}

/**
 * @description 获取节点和位置
 * @param {Element} node 节点
 * @param {number} x 横坐标
 * @param {number} y 纵坐标
 * @returns {{ node: Text, offset: number }} 文本节点和偏移量
 */
function getNodeAndOffsetByCoordinate(node, x, y) {
  let res = {
    node: null,
    offset: -1
  };
  if (node.nodeName === 'SPAN') {
    const textNode = node.firstChild;
    const { textContent } = textNode;
    const offset = getOffsetOfTextByCoordinate(textNode, x, y, 0, textContent.length, textContent.length);
    res.node = textNode;
    res.offset = offset;
  }
  return res;
}

/**
 * @description 根据坐标获取当前 offset 值
 * @param {Text} textNode 需要度量的文本节点
 * @param {number} x 横坐标，来自 eventObject
 * @param {number} y 纵坐标，来自 eventObject
 * @param {number} from 从第几个文本开始
 * @param {number} to 到第几个文本结束
 * @param {number} contentLength 整个文本的长度
 * @returns {number} 坐标位于 textNode 的哪个 offset 中
 */
function getOffsetOfTextByCoordinate(textNode, x, y, from, to, contentLength) {
  const range = document.createRange();
  const shouldContinue = to - from > 1;
  if (shouldContinue) {
    const mid = Math.floor((to + from) / 2);
    try {
      range.setStart(textNode, mid);
      range.setEnd(textNode, Math.max(Math.min(mid, contentLength), 0));
    } catch (e) {
      return from;
    }
    const rect = range.getClientRects()[0];
    if (rect) {
      const relativePosition = getRelativePosition(x, y, rect.top, rect.bottom, rect.left, rect.width);
      switch (relativePosition) {
        case RELATIVE_POSITION.ABOVE: {
          return getOffsetOfTextByCoordinate(textNode, x, y, from, mid, contentLength);
        }
        case RELATIVE_POSITION.BELOW: {
          return getOffsetOfTextByCoordinate(textNode, x, y, mid, to, contentLength);
        }
        case RELATIVE_POSITION.LEFT: {
          return getOffsetOfTextByCoordinate(textNode, x, y, from, mid, contentLength);
        }
        case RELATIVE_POSITION.RIGHT: {
          return getOffsetOfTextByCoordinate(textNode, x, y, mid, to, contentLength);
        }
      }
    } else {
      return from;
    }
  }
  const charStart = from;
  const charEnd = from + 1;
  try {
    range.setStart(textNode, charStart);
    range.setEnd(textNode, Math.max(Math.min(charEnd, contentLength), 0));
  } catch (e) {
    return charStart;
  }
  const charRect = range.getClientRects()[0];
  if (charRect) {
    if (x <= (charRect.left + charRect.width) / 2) {
      return charStart;
    } else {
      return charEnd;
    }
  } else {
    return charStart;
  }
}

/**
 * @description 获取坐标和某矩形的相对位置
 * @param {number} x 
 * @param {number} y 
 * @param {number} top 
 * @param {number} bottom 
 * @param {number} left 
 * @param {number} width
 * @returns {typeof RELATIVE_POSITION[keyof RELATIVE_POSITION]} 相对位置
 */
function getRelativePosition(x, y, top, bottom, left, width) {
  if (y < top) {
    return RELATIVE_POSITION.ABOVE;
  } else if (y > bottom) {
    return RELATIVE_POSITION.BELOW;
  } else if (x <= left + width) {
    return RELATIVE_POSITION.LEFT;
  } else {
    return RELATIVE_POSITION.RIGHT;
  }
}

/**
 * @description 绘制光标
 * @param {Text} textNode 绘制光标的文本节点
 * @param {number} offset 偏移量
 * @returns {void}
 */
function setCaret(textNode, offset) {
  const range = document.createRange();
  range.setStart(textNode, offset);
  range.setEnd(textNode, offset);
  const rect = range.getClientRects()[0];
  caret.style.height = `${rect.height}px`;
  caret.style.top = `${rect.top}px`;
  caret.style.left = `${rect.left}px`;
}

/**
 * @description 创建光标
 * @returns 光标节点
 */
function createCaret() {
  const cursor = document.createElement('span');
  cursor.id = 'caret';
  document.body.appendChild(cursor);
  return cursor;
}

/** 
 * @description 创建选区容器
 * @returns 选区容器
 */
function createSelectionWrapper() {
  const wrapper = document.createElement('div');
  wrapper.id = 'selection-wrapper';
  document.body.appendChild(wrapper);
  return wrapper;
}

/**
 * @description 创建选区视图
 * @param {number} x 距左边距离
 * @param {number} y 距上边距离
 * @param {number} width 宽度
 * @param {number} height 高度
 */
function createSelection(x, y, width, height) {
  const selection = document.createElement('div');
  selection.className = 'selection';
  selection.style.top = `${y}px`;
  selection.style.left = `${x}px`;
  selection.style.width = `${width}px`;
  selection.style.height = `${height}px`;
  selectionWrapper.appendChild(selection);
}

/**
 * @description 清除所有选区视图
 */
function clearSelection() {
  selectionWrapper.innerHTML = '';
}

/**
 * 设置光标展示不展示
 * @param {boolean} visible 是否展示
 */
function setCursorDisplay(visible) {
  caret.style.display = visible ? 'block' : 'none';
}

/**
 * 设置选区
 * @param {Text} node 结束节点
 * @param {number} offset 偏移量
 */
function setSelection(node, offset) {
  if (!anchorKeeper) {
    return;
  }
  focusKeeper = { node, offset };
  const { node: startNode, offset: startOffset } = anchorKeeper;
  if (startNode.isEqualNode(node) && startOffset === offset) {
    return;
  }
  clearSelection();
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(node, offset);
  const rects = range.getClientRects();
  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    createSelection(rect.x, rect.y, rect.width, rect.height);
  }
}