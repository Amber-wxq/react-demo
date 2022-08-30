
const editorEl = document.querySelector("#editor");

function bind() {
    editorEl.addEventListener("mousedown", handleMousedown);
}

window.addEventListener("load", () => {
    bind();
});
//创建一个光标span，设置id为caret
const caret = createCaret();
//创建一个选区容器 设置id为selection-wrapper
const selectionWrapper = createSelectionWrapper();
//是否为选区的标志
let isSelecting = false;
//设置锚点
let anchorKeeper = null;
//设置焦点
let focusKeeper = null;
let anchorY = null;
let focusY = null;
let myselection = {};
//处理按下鼠标左键
function handleMousedown(e) {
    e.preventDefault();

    clearSelection();
    clearSelectionKeeper();
    setCursorDisplay(true);
    //   clearSelectionKeeper();
    //获取点击点的xy坐标和
    const { clientX, clientY, target } = e;
    console.log("target", target);
    anchorY = clientY;
    // getTextNode(target);

    const nodeAndOffset = getNodeAndOffsetByCoordinate(
        target,
        clientX,
        clientY
    );
    console.log("nodeAndOffset-down", nodeAndOffset);

    nodeAndOffset.node && setCaret(nodeAndOffset.node, nodeAndOffset.offset);
    anchorKeeper = {
        node: nodeAndOffset.node,
        offset: nodeAndOffset.offset,
    };

    editorEl.addEventListener("mousemove", handleMousemove);
    editorEl.addEventListener("mouseup", handleMouseup);
    isSelecting = true;
}


function handleMousemove(e) {
    e.preventDefault();
    // editorEl.addEventListener("mouseup", handleMouseup);
    console.log(isSelecting);
    if (!isSelecting) {
        return;
    }
    const { clientX, clientY, target } = e;

    const nodeAndOffset = getNodeAndOffsetByCoordinate2(
        target,
        clientX,
        clientY
    );
    focusY = clientY;
    console.log("nodeAndOffset-move", nodeAndOffset);
    setFocus(nodeAndOffset.node, nodeAndOffset.offset);

    console.log(1);

    setSelection();
}

function setSelection() {
    // clearCaret();
    setCursorDisplay(false);
    const range = document.createRange();
    if (
        anchorKeeper.node === focusKeeper.node &&
        anchorKeeper.offset > focusKeeper.offset
    ) {
        console.log("2");
        range.setEnd(anchorKeeper.node, anchorKeeper.offset);
        range.setStart(focusKeeper.node, focusKeeper.offset);
    } else if (anchorY > focusY) {
        range.setEnd(anchorKeeper.node, anchorKeeper.offset);
        range.setStart(focusKeeper.node, focusKeeper.offset);

    }
    else {
        range.setStart(anchorKeeper.node, anchorKeeper.offset);
        range.setEnd(focusKeeper.node, focusKeeper.offset);
    }

    console.log("myrange", range);
    clearSelection();
    const rects = range.getClientRects();
    //   console.log("rects.x", rects[0].x);
    for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        createSelection(rect.x, rect.y, rect.width, rect.height);
    }
}

function handleMouseup(e) {
    e.preventDefault();
    isSelecting = false;

    console.log('anchorKeeper', anchorKeeper, 'focusKeeper', focusKeeper);
    if (!focusKeeper) {
        myselection = {
            anchorNode: anchorKeeper.node,
            anchorOffset: anchorKeeper.offset,
            baseNode: anchorKeeper.node,
            baseOffset: anchorKeeper.offset,
            extentNode: anchorKeeper.node,
            extentOffset: anchorKeeper.offset,
            focusNode: anchorKeeper.node,
            focusOffset: anchorKeeper.offset,
            isCollapsed: true,
            rangeCount: 1,
            type: "Caret"
        }
    } else {
        myselection = {
            anchorNode: anchorKeeper.node,
            anchorOffset: anchorKeeper.offset,
            baseNode: anchorKeeper.node,
            baseOffset: anchorKeeper.offset,
            extentNode: focusKeeper.node,
            extentOffset: focusKeeper.offset,
            focusNode: focusKeeper.node,
            focusOffset: focusKeeper.offset,
            isCollapsed: false,
            rangeCount: 1,
            type: "range"
        }
    }
    console.log('myselection', myselection);
    // editorEl.removeEventListener("mousemove", handleMousemove);
    // editorEl.removeEventListener("mouseup", handleMouseup);
}

/**
 * @adescription 设置选区开始位置
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
    ABOVE: "above",
    BELOW: "below",
    RIGHT: "right",
    LEFT: "left",
};
function getTextNode(node) {
    console.log('--------------------------------');
    // console.log(node.firstChild,typeof(node.firstChild));
    const textNode = node.firstChild;

    // console.log('11',textContent, typeof(textContent));
    const flag = textNode.data.length;
    if (flag > 9) {
        console.log(true);
        return true;
    } else {
        console.log(false);
        return false;
    }

    console.log('--------------------------------');
    // return textNode;
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
        offset: -1,
    };
    const isText = getTextNode(node);


    if (isText) {
        const textNode = node.firstChild;
        // console.log("textNode", textNode);
        const { textContent } = textNode;
        // console.log("textContent", textContent);
        //计算offset
        const offset = getOffsetOfTextByCoordinate(
            textNode,
            x,
            y,
            0,
            textContent.length,
            textContent.length
        );
        res.node = textNode;
        res.offset = offset;
    }
    return res;
}

function getNodeAndOffsetByCoordinate2(node, x, y) {
    let res = {
        node: null,
        offset: -1,
    };



    if (node.firstChild) {
        const textNode = node.firstChild;
        // console.log("textNode", textNode);
        const { textContent } = textNode;
        // console.log("textContent", textContent);
        //计算offset
        const offset = getOffsetOfTextByCoordinate(
            textNode,
            x,
            y,
            0,
            textContent.length,
            textContent.length
        );
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
function getOffsetOfTextByCoordinate(
    textNode,
    x,
    y,
    from, //0
    to, //textContent.length
    contentLength
) {
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
        //range在屏幕上所占区域
        const rect = range.getClientRects()[0];
        // console.log("rect",rect);
        if (rect) {
            //获取坐标和某矩形的相对位置
            const relativePosition = getRelativePosition(
                x,
                y,
                rect.top,
                rect.bottom,
                rect.left,
                rect.width
            );
            switch (relativePosition) {
                case RELATIVE_POSITION.ABOVE: {
                    return getOffsetOfTextByCoordinate(
                        textNode,
                        x,
                        y,
                        from,
                        mid,
                        contentLength
                    );
                }
                case RELATIVE_POSITION.BELOW: {
                    return getOffsetOfTextByCoordinate(
                        textNode,
                        x,
                        y,
                        mid,
                        to,
                        contentLength
                    );
                }
                case RELATIVE_POSITION.LEFT: {
                    return getOffsetOfTextByCoordinate(
                        textNode,
                        x,
                        y,
                        from,
                        mid,
                        contentLength
                    );
                }
                case RELATIVE_POSITION.RIGHT: {
                    return getOffsetOfTextByCoordinate(
                        textNode,
                        x,
                        y,
                        mid,
                        to,
                        contentLength
                    );
                }
            }
        } else {
            return from;
        }
    }
    console.log("from", from);
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
        // } else if (x <= left ) {
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
    console.log('setCaret-range', range);
    const rect = range.getClientRects()[0];
    //   console.log("Caret-left", rect.left);
    caret.style.height = `${rect.height}px`;
    caret.style.top = `${rect.top}px`;
    caret.style.left = `${rect.left}px`;
}

/**
 * @description 创建光标
 * @returns 光标节点
 */
function createCaret() {
    const cursor = document.createElement("span");
    cursor.id = "caret";
    document.body.appendChild(cursor);
    return cursor;
}



/**
 * @description 创建选区容器
 * @returns 选区容器
 */
function createSelectionWrapper() {
    const wrapper = document.createElement("div");
    wrapper.id = "selection-wrapper";
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
    const selection = document.createElement("div");
    selection.className = "selection";
    selection.style.top = `${y}px`;
    selection.style.left = `${x - 10}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;
    selectionWrapper.appendChild(selection);
    console.log("left", selection.style.left);
}

/**
 * @description 清除所有选区视图
 */
function clearSelection() {
    selectionWrapper.innerHTML = "";
}

function clearAnchorY() {
    anchorY = null;
}
function clearFocusY() {
    focusY = null;
}

/**
 * 设置光标展示不展示
 * @param {boolean} visible 是否展示
 */
function setCursorDisplay(visible) {
    caret.style.display = visible ? "block" : "none";
}

/**
 * 设置选区
 * @param {Text} node 结束节点
 * @param {number} offset 偏移量
 */
function setSelection1(node, offset) {
    if (!anchorKeeper) {
        return;
    }
    focusKeeper = { node, offset };
    console.log("focusKeeper", focusKeeper);
    const { node: startNode, offset: startOffset } = anchorKeeper;

    // if (startNode.isEqualNode(node) && startOffset === offset) {
    //   return;
    // }
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

