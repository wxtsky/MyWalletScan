export const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp) * 1000;
    const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

    if (seconds < 60) {
        return Math.round(seconds) + ' 秒前';
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        return Math.round(minutes) + ' 分前';
    }

    const hours = minutes / 60;
    if (hours < 24) {
        return Math.round(hours) + ' 时前';
    }

    const days = hours / 24;
    return Math.round(days) + ' 天前';
};
