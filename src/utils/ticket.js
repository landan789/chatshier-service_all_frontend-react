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
    2: 'rgb(103, 210, 40)',
    3: 'rgb(233, 198, 13)',
    4: 'rgb(230, 100, 100)'
};

export function toPriorityColor(priority) {
    return priorityColors[priority] ? priorityColors[priority] : priorityColors[1];
}

export function toStatusText(status) {
    return statusText[status] ? statusText[status] : '未知';
}

export function toPriorityText(priority) {
    return priorityText[priority] ? priorityText[priority] : '無';
}

export function toDueDateSpan(dueTime) {
    let nowTime = Date.now();
    let dueDate = new Date(dueTime).getTime();
    let hr = (dueDate - nowTime) / HOUR;

    let style = {
        padding: '1px .75rem',
        margin: '1px',
        borderRadius: '1rem',
        backgroundColor: hr < 0 ? 'rgb(227, 79, 79)' : 'rgb(91, 195, 92)'
    };

    let text = hr < 0 ? '過期' : '即期';
    return <span className="text-light text-nowrap font-weight-bold due-date-text" style={style}>{text}</span>;
}
