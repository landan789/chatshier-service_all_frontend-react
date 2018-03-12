import React from 'react';
import { HOUR } from './unitTime';

const statusText = {
    2: '未處理',
    3: '處理中',
    4: '已解決',
    5: '已關閉'
};

const priorityText = {
    1: '低',
    2: '中',
    3: '高',
    4: '急'
};

const priorityColors = {
    1: '#33ccff',
    2: 'rgb(113, 180, 209)',
    3: 'rgb(233, 198, 13)',
    4: 'rgb(230, 100, 100)'
};

export function toPriorityBorder(priority) {
    let style = {};
    let color = priorityColors[priority] ? priorityColors[priority] : '';
    if (color) {
        style.borderLeft = '5px solid ' + color;
    }
    return style;
}

export function toStatusText(status) {
    return statusText[status] ? statusText[status] : '未知';
}

export function toPriorityText(priority) {
    return priorityText[priority] ? priorityText[priority] : '無';
}

export function toLocalTimeString(millisecond) {
    let date = new Date(millisecond);
    let localDate = date.toLocaleDateString();
    let localTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let localTimeString = localDate + localTime;
    return localTimeString;
}

export function toDueDateSpan(dueTime) {
    let nowTime = Date.now();
    let dueDate = new Date(dueTime).getTime();
    let hr = (dueDate - nowTime) / HOUR;

    let style = {
        padding: '1px .75rem',
        margin: '1px',
        borderRadius: '1rem',
        backgroundColor: hr < 0 ? 'rgb(91, 195, 92)' : 'rgb(227, 79, 79)',
        color: '#fff',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    };

    let text = hr < 0 ? '即期' : '過期';
    return <span style={style}>{text}</span>;
}
